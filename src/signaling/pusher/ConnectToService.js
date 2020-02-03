import React from 'react';
import pusher from './pusher.png';
import './css/style.css';
export default function ConnectingToPusher({ connectToService }) {
  return (
    <div className="root">
      <button type="button" className="connect-btn" onClick={connectToService}>
        Start Demo
      </button>
    </div>
  );
}
