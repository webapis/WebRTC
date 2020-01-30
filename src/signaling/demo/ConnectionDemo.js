import React from 'react';
import usePusher, { getPusherConfig } from '../pusher/usePusher';
import ConnectingToPusher from '../pusher/ConnectingToPusher';
import './style.css';
export default function ConnectionDemo() {
  const {
    currentUser,
    pusherError,
    connecting,
    chatManager,
    connectToPusher
  } = usePusher(getPusherConfig({ userId: 'signaler' }));

  if (pusherError) {
    return <div>Pusher error:{pusherError.message}</div>;
  } else if (!currentUser && !connecting)
    return (
      <ConnectingToPusher
        currentUser={currentUser}
        chatManager={chatManager}
        connectToPusher={connectToPusher}
      />
    );
  else if (!currentUser && connecting) {
    return <div className="root"> <div className="connecting">Connecting to pusher!</div></div>;
  } else {
    return<div className="root"><div className="connected">Connected to Pusher</div></div>
  }
}
