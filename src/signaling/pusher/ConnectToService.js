import React from 'react';
import pusher from './pusher.png';
import './css/style.css';
export default function ConnectingToPusher({
  connectToService
}) {

    return (
      <div className="root">
        <button className="connect-btn" onClick={connectToService}>
          Connect to Service
        </button>
      </div>
    );
  
 
}
