import React from 'react';
import './css/style.css';

export default function ConnectingToPusher({
  connectToService
}) {

    return (
      <div className="root">
        <button type="button" className="connect-btn" onClick={connectToService}>
          Connect to Service
        </button>
      </div>
    );
  
 
}
