import { useState, useEffect } from 'react';

import { ChatManager, TokenProvider } from '@pusher/chatkit-client'

export default function usePusher({
  instanceLocator,
  userId,
  tokenProviderUrl,
  roomId
}) {
  const [chatManager, setChatManager] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [signalingError, setSignalingError] = useState(null);
  const [message, setMessage] = useState(null);
  const [connectionState, setConnectionState] = useState('');
  useEffect(() => {
    if (!navigator.onLine) {
      setSignalingError(new Error('Your device is offline'));
    }
  });
  useEffect(() => {
    if (chatManager) {
   //   debugger; //3.
      chatManager
        .connect()
        .then(cUser => {
          setCurrentUser(cUser);
        })
        .catch(err => {
          setSignalingError(err);
          setConnectionState('');
        });
    }
  }, [chatManager]);

  useEffect(() => {
    if (currentUser) {
      setConnectionState('connected');
   //   debugger; // 4.
      currentUser.subscribeToRoomMultipart({
        roomId,
        hooks: {
          onMessage: m => {
        //    debugger;
            const msg = JSON.parse(m.parts[0].payload.content);
            setMessage(msg);
          }
        },
        messageLimit: 0
      });
    }
  }, [currentUser]);

  function connectToService() {
  //  debugger; // 2
    setConnectionState('connecting');
    setChatManager(
      new ChatManager({
        instanceLocator,
        userId,
        tokenProvider: new TokenProvider({ url: tokenProviderUrl })
      })
    );
  }

  function sendMessage(msg) {
    currentUser.sendSimpleMessage({
      text: JSON.stringify(msg),
      roomId
    });
  }

  return {
    signalingError,
    connectionState,
    messageSizeLimit: 5,
    sendMessage,
    message,
    connectToService
  };
}


