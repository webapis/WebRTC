import React from 'react';
import usePusher from '../../pusher/usePusher';
import Client from './Client';
import ConnectToService from '../../pusher/ConnectToService';
import '../style.css';


export default function Clients({    signalingError,
    connectionState,
    sendMessage,
    message,
    messageSizeLimit,
    connectToService}) {
 

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
    );
  }

  return <div>Something went wrong</div>;
}
