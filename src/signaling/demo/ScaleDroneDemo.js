import React from 'react';
import useScaledrone from '../scaledrone/useScaleDrone';
import Clients from './shareable/Clients';

export default function ScaleDroneDemo() {
  const {
    signalingError,
    connectionState,
    messageSizeLimit,
    sendMessage,
    message,
    connectToService
  } = useScaledrone({
    channel_id: 'kgrfnwzdUtSa0se7',
    room_name: 'signaling',
    mock: true
  });

  return (
    <div>
      ScaleDrone
      <Clients
        signalingError={signalingError}
        connectToService={connectToService}
        connectionState={connectionState}
        sendMessage={sendMessage}
        message={message}
        messageSizeLimit={messageSizeLimit}
      />
    </div>
  );
}
