import React from 'react';
import usePusher from '../pusher/usePusher';
import useSignaling from '../useSignaling';
import ConnectToService from '../pusher/ConnectToService';
import './style.css';

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

  if (signalingError) {
    return <div> {signalingError.message}</div>;
  }
  if (connectionState === '') {
    debugger; //1
    return <ConnectToService connectToService={connectToService} />;
  }
  if (connectionState === 'connecting') {
    debugger; //
    return <div>Connecting...</div>;
  }
  if (connectionState === 'connected') {
    debugger; //
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

const Client = ({ target, name, message, sendMessage, messageSizeLimit }) => {
  const {
    signalingMessage,
    resetSignalingState,
    sendSignalingMessage,
    error
  } = useSignaling({ target, name, message, sendMessage, messageSizeLimit });

  return <div>Client</div>;
};
