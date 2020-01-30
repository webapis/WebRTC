import React from 'react';
import Client from './Client';
import usePusher, { getPusherConfig } from './signaling/pusher/usePusher';
import ErrorMessage from './ErrorMessage';
import pusherIcon from './signaling/pusher/pusher.png';
import './css/style.css';

export default function Demo({ title, clientOneName, clientTwoName }) {
  const {
    currentUser: clientOne,
    error: clientOneError,
    connectToPusher: connectOne,
    connecting: connectingOne
  } = usePusher(getPusherConfig({ userId: clientOneName }));
  const {
    currentUser: clientTwo,
    error: clientTwoError,
    connectToPusher: connectTwo,
    connecting: connectingTwo
  } = usePusher(getPusherConfig({ userId: clientTwoName }));
  function startDemo() {
    connectOne();
    connectTwo();
  }
  if (clientOneError) {
    return <ErrorMessage error={clientOneError} />;
  }
  if (clientTwoError) {
    return <ErrorMessage error={clientTwoError} />;
  }
  if (!clientOne && !clientTwo && !connectingOne && !connectingTwo) {
    return (
      <div className="connection">
        <button type="button" onClick={startDemo}>
          Start Demo
        </button>
      </div>
    );
  }
  if (connectingTwo || connectingOne) {
    return (
      <div className="connection">
        <h3>Connecing.... to</h3>
        <img width="100px" src={pusherIcon} alt="pusher icon" />
      </div>
    );
  }
  if (clientOne && clientTwo) {
    return (
      <div className="root">
        <h1 className="demo-title">{title}</h1>
        <div className="demo">
          <Client
            currentUser={clientOne}
            name={clientOneName}
            target={clientTwoName}
          />
          <Client
            currentUser={clientTwo}
            name={clientTwoName}
            target={clientOneName}
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
