import { useState, useEffect } from 'react';

import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
export default function usePusher(config) {
  const { instanceLocator, userId, url } = config;
  debugger;
  const [chatManager, setChatManager] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [pusherError, setPusherError] = useState(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (!navigator.onLine) {
      setPusherError(new Error('Your device is offline'));
    } else {
      debugger;
      setChatManager(
        new ChatManager({
          instanceLocator,
          userId,
          tokenProvider: new TokenProvider({ url })
        })
      );
    }
  }, [userId, instanceLocator, url]);

  useEffect(() => {
    if (chatManager) {
      debugger;
      setConnecting(true);
      chatManager
        .connect()
        .then(cUser => {
          debugger;
          setCurrentUser(cUser);
        })
        .catch(err => {
          debugger;
          setPusherError(err);
        });
    }
  }, [chatManager]);

  useEffect(() => {
    if (currentUser) {
      debugger;
      setConnecting(false);
    }
  }, [currentUser]);

  return { currentUser, pusherError, connecting };
}

export function getPusherConfig({ userId }) {
  return {
    instanceLocator: 'v1:us1:655c56ba-ae22-49a7-9cdb-ccd682a39c84',
    userId,
    url:
      'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/655c56ba-ae22-49a7-9cdb-ccd682a39c84/token'
  };
}
