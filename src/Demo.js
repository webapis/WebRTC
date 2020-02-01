import React from 'react';
import Client from './Client';
import useScaleDrone from './signaling/scaledrone/useScaleDrone';
import ConnectToService from './signaling/pusher/ConnectToService';

// import ErrorMessage from './ErrorMessage';

export default function Demo({ title }) {
  const {
    signalingError,
    connectionState,
    messageSizeLimit,
    sendMessage,
    message,
    connectToService
  } = useScaleDrone({ channel_id: 'kgrfnwzdUtSa0se7', room_name: 'signaling' });

  if (signalingError) {
    return <div> {signalingError.message}</div>;
  }
  if (connectionState === '') {
    return <ConnectToService connectToService={connectToService} />;
  }
  if (connectionState === 'connecting') {
    return <div>Connecting...</div>;
  }
  if (connectionState === 'connected') {
    return (
      <div className="root">
        <h1 className="demo-title">{title}</h1>
        <div className="demo">
          <Client
            target="mario"
            name="dragos"
            message={message}
            sendMessage={sendMessage}
            messageSizeLimit={messageSizeLimit}
          />
          <Client
            target="dragos"
            name="mario"
            message={message}
            sendMessage={sendMessage}
            messageSizeLimit={messageSizeLimit}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="loading">
      <h2>Loading...</h2>
    </div>
  );
}
