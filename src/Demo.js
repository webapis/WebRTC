/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState,useEffect } from 'react';
import Client from './Client';
import useScaleDrone from './signaling/scaledrone/useScaleDrone';
import ConnectToService from './signaling/pusher/ConnectToService';

export default function Demo({ title }) {
  const {
    signalingError,
    connectionState,
    messageSizeLimit,
    sendMessage,
    message,
    connectToService
  } = useScaleDrone({ channel_id: 'kgrfnwzdUtSa0se7', room_name: 'signaling' });

  const [started, setStarted] = useState(false);

  useEffect(()=>{
    if(connectionState){
      debugger;
      
    }
  },[connectionState])

  if (signalingError) {
    return <div> {signalingError.message}</div>;
  }
  if (connectionState === '') {
    return <ConnectToService connectToService={connectToService} />;
  }
  if (connectionState === 'connecting') {
    return <div className="connection">Connecting to Signaling Service...</div>;
  }
  if (connectionState === 'connected') {
    return (
      <div className="root">
        <h1 className="demo-title">{title}</h1>
        <div className="demo">
          {/* <Client
            name="mario"
            started={started}
            setStarted={setStarted}
            conference_name="conference_name"
            message={message}
            sendMessage={sendMessage}
            messageSizeLimit={messageSizeLimit}
          />
        */}
        Client
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
