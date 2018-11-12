import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// other imports omitted
import config from './aws-exports' // new
import Amplify from 'aws-amplify' // new
Amplify.configure(config) // new



ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));
serviceWorker.register();





