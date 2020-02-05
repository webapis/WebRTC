/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react';
import useScaleDrone from './signaling/scaledrone/useScaleDrone';
import ConnectToService from './signaling/pusher/ConnectToService';
import VideoConferenceView from './video-conference/ui-components/VideoConferenceView';

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

  useEffect(() => {
    if (connectionState) {
      debugger;
    }
  }, [connectionState]);

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
      <div>
        <h1 className="demo-title">{title}</h1>
        <div>
          <VideoConferenceView
            signalingMessage={message}
            sendSignalingMessage={sendMessage}
            conferenceName="video-conference"
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
