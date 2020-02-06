/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import adapter from 'webrtc-adapter';
import Demo from './Demo'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Demo title="Video Conference Demo with multiple participants using WebRTC" />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
