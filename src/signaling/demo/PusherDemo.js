/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
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

const Client = ({ target, name, message, sendMessage, messageSizeLimit }) => {
  const { signalingMessage, sendSignalingMessage } = useSignaling({
    target,
    name,
    message,
    sendMessage,
    messageSizeLimit
  });
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (messages.length > 0) {
      debugger;
    }
  }, [messages]);

  useEffect(() => {
    if (signalingMessage) {
      debugger;
      if (messages.length === 0) {
        debugger;
        setMessages([signalingMessage]);
      }
      if (messages.length > 0) {
        debugger;
        setMessages(prev => [...prev, signalingMessage]);
      }
    }
  }, [signalingMessage]);

  function handleChange(e) {
    const { value } = e.target;
    setText(value);
  }

  function handleSendMessage() {
    sendSignalingMessage({text });
  }

  return (
    <div className="client">
      <div>{name}</div>
      <div className="messages">
        {messages.length>0 &&
          messages.map(m => {
            return (
              <div>
                <div>{m && m.name && m.name}</div>
                <div>{m && m.message.text && m.message.text}</div>
              </div>
            );
          })}
      </div>
      <input type="text" onChange={handleChange} value={text} name="message" />
      <button type="button" onClick={handleSendMessage}>
        Send Message
      </button>
    </div>
  );
};
