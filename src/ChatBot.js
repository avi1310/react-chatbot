import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import { ChatBot } from 'aws-amplify-react';
import { Interactions } from 'aws-amplify';
import { ChatFeed, Message } from 'react-chat-ui'
import Dropzone from 'react-dropzone'
import config from './aws-exports'
var aws = require('aws-sdk');

export default class RChatBot extends Component {
  state = {
    input: '',
    finalMessage: '',
    messages: [
      new Message({
        id: 1,
        message: "Hello, how can I help you today?",
      })
    ],
  }
  
  addPhoto() {
    var albumBucketName = 'photo6998';
    var bucketRegion = 'us-east-1';
    var IdentityPoolId = 'us-east-1:b1651fcd-05d8-4d91-9142-f693742a8842';

    // aws.config.update({
    //   region: bucketRegion,
    //   credentials: new aws.CognitoIdentityCredentials({
    //     IdentityPoolId: IdentityPoolId
    //   })
    // });

    aws.config.update({ accessKeyId: 'AKIAI36HMTWVY3HJZWOA', secretAccessKey: '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' });

    var s3 = new aws.S3({
      params: {Bucket: "photo6998"}
    });
    var files = document.getElementById('avatar').files;
    if (!files.length) {
      return alert('Please choose a file to upload first.');
    }
    var file = files[0];
    var fileName = file.name;
    // var albumPhotosKey = encodeURIComponent(albumName) + '//';

    // var photoKey = albumPhotosKey + fileName;
    s3.putObject({
      Bucket: albumBucketName,
      Key: fileName,
      Body: file,
      ACL: 'public-read'
    },function(err, data) {
      if (err) {
        console.log(err);
        return alert('There was an error uploading your photo: ', err.message);
      }
      alert('Successfully uploaded photo.');
      // viewAlbum(albumName);
    });
    // s3.upload({
    //   Key: fileName,
    //   Body: file,
    //   ACL: 'public-read'
    // }, function(err, data) {
    //   if (err) {
    //     console.log(err);
    //     return alert('There was an error uploading your photo: ', err.message);
    //   }
    //   alert('Successfully uploaded photo.');
    //   // viewAlbum(albumName);
    // });
  }
  onChange(e) {
    const input = e.target.value
    this.setState({
      input
    })
  }
  handleComplete(err, confirmation) {
    if (err) {
      alert('Bot conversation failed')
      return;
    }
    alert('Success: ' + JSON.stringify(confirmation, null, 2));
    return 'Reservation booked. Thank you! What would you like to do next?';
  }
  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.submitMessage()
    }
  }
  async submitMessage() {
    const { input } = this.state
    if (input === '') return
    const message = new Message({
      id: 0,
      message: input,
    })
    let messages = [...this.state.messages, message]

    this.setState({
      messages,
      input: ''
    })
    const response = await Interactions.send("OrderFlowers", input);
    const responseMessage = new Message({
      id: 1,
      message: response.message,
    })
    messages  = [...this.state.messages, responseMessage]
    this.setState({ messages })

    if (response.dialogState === 'Fulfilled') {
      if (response.intentName === 'OrderFlowers') {
        // const { slots: { FlowerType, PickupDate, PickupTime } } = response
        // const finalMessage = `Congratulations! Your trip to ${​FlowerType}  with a ${​PickupDate} rooom on for ${​PickupTime} days has been booked!!`
        // this.setState({ finalMessage })
      }
    }
  }
  render() {
  return (
      <div className="App">
        <div>
        <label for="avatar">Upload a picture:</label>
        <input type="file" id="avatar" name="avatar" accept="image/jpeg" />
        </div>
        <button class="favorite styled"
        type="button" onClick={this.addPhoto}>
          Upload Image
        </button>

        <header style={styles.header}>
          <p style={styles.headerTitle}>Welcome to Virtual Concierge Assistant!</p>
        </header>
        <div style={styles.messagesContainer}>
          <h2>{this.state.finalMessage}</h2>
          <ChatFeed
            messages={this.state.messages}
            hasInputField={false}
            bubbleStyles={styles.bubbleStyles}
          />
          <input
            onKeyPress={this._handleKeyPress}
            onChange={this.onChange.bind(this)}
            style={styles.input}
            value={this.state.input}
          />
        </div>
      </div>
    );
  }
}

const styles = {
  bubbleStyles: {
    text: {
      fontSize: 16,
    },
    chatbubble: {
      borderRadius: 30,
      padding: 10
    }
  },
  headerTitle: {
    color: 'white',
    fontSize: 22
  },
  header: {
    backgroundColor: 'rgb(0, 132, 255)',
    padding: 20,
    borderTop: '12px solid rgb(204, 204, 204)'
  },
  messagesContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    alignItems: 'center'
  },
  input: {
    fontSize: 16,
    padding: 10,
    outline: 'none',
    width: 350,
    border: 'none',
    borderBottom: '2px solid rgb(0, 132, 255)'
  }
}