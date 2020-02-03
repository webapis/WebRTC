import React from 'react';
import TextChatView from './text-chat/ui-components/TextChatView';
import useWebRTC from './text-chat/webrtc/use-webrtc';
import iceServers from './text-chat/webrtc/ice-servers';
import useSignaling from './signaling/useSignaling';
import WebRTCState from './common/webrtc-connection-state';
import ErrorMessage from './ErrorMessage';
import './css/style.css';

export default function Client({
  target,
  name,
  message,
  sendMessage,
  messageSizeLimit,
  started,
  setStarted
}) {
  const { signalingMessage, sendSignalingMessage } = useSignaling({
    target,
    name,
    message,
    sendMessage,
    messageSizeLimit
  });
  const {
    initiateOffer,
    error: webRTCError,
    message: msg,
    connected,
    sendMessage: sendMsg,
    state
  } = useWebRTC({ name, signalingMessage, sendSignalingMessage, iceServers });

  function createOffer() {
    setStarted(true)
    initiateOffer();
  }

  if (webRTCError) {
    return <ErrorMessage error={webRTCError} />;
  }

  return (
    <div className="client">
      <div className="client-top">
        {state.connectionState === 'connected' && (
          <TextChatView
            sendMessage={sendMsg}
            state={state}
            remoteMessage={msg}
            connected={connected}
          />
        )}
        {state.connectionState !== 'connected' && (
          <div className="connect">
            <button type="button" disabled={started} onClick={createOffer}>
              Connect to Peer
            </button>
          </div>
        )}
      </div>
      <div className="client-bottom">
        <WebRTCState
          signalingState={state.signalingState}
          connectionState={state.connectionState}
          iceConnectionState={state.iceConnectionState}
          iceGatheringState={state.iceGatheringState}
        />
      </div>
    </div>
  );
}
