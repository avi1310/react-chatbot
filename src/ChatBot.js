import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { ChatBot } from 'aws-amplify-react';
import { Interactions } from 'aws-amplify';
import { ChatFeed, Message } from 'react-chat-ui'

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