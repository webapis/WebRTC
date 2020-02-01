/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import Clients from './shareable/Clients';
import usePusher from '../pusher/usePusher';

const pusherConfig = {
  instanceLocator: 'v1:us1:655c56ba-ae22-49a7-9cdb-ccd682a39c84',
  userId: 'signaler',
  roomId: '0d3729a6-d4c2-4af0-8e7a-1efc9ea0f428',
  tokenProviderUrl:
    'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/655c56ba-ae22-49a7-9cdb-ccd682a39c84/token'
};

export default function PusherDemo() {
  const {
    signalingError,
    connectionState,
    sendMessage,
    message,
    messageSizeLimit,
    connectToService
  } = usePusher(pusherConfig);

  return (
    <div>
      Pusher
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
