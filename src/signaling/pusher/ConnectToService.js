import React from 'react';

import './css/style.css';

export default function ConnectingToPusher({ connectToService }) {
  return (
    <div className="connect-to-service">
      <div className="bnt-container">
        <button
          type="button"
          onClick={connectToService}
        >
          Connect to Service
        </button>
      </div>
    </div>
  );
}
