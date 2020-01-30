import React from 'react';
import pusher from './pusher.png';
import './css/style.css';
export default function ConnectingToPusher({
  currentUser,
  connectToPusher,
  chatManager
}) {
  if (!currentUser && chatManager) {
    return (
      <div className="root">
        <button className="connect-btn" onClick={connectToPusher}>
          Connect to Signaling Service
        </button>
      </div>
    );
  }
  return null;
}
