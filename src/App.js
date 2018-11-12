import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import { ChatBot } from 'aws-amplify-react';
import { Interactions } from 'aws-amplify';
import { ChatFeed, Message } from 'react-chat-ui'
import {Route} from 'react-router-dom'
import Login from './containers/Login'
import RChatBot from './ChatBot'

class App extends Component {
  state = {
    userAuthenticated: false
  }
  userAuth = () => (
    this.setState({userAuthenticated: true})
  )
  render() {
    return (
      <div className="app">
        <Route exact path="/" render={() => (
           this.state.userAuthenticated?(
            <RChatBot/>):(<Login userAuth={this.userAuth} />)
        )}/>
        
      </div>
    )
  }
}

export default App;
