/* eslint-disable no-unused-vars */
import React from 'react';
import WebRTCState from './common/webrtc-connection-state';
import VideoChatView from './video-chat/ui-components/VideoChatView';
import useVideoChatUiState from './video-chat/webrtc/use-ui-state';
import useSignaling from './signaling/useSignaling';
import iceServers from './video-chat/webrtc/ice-servers';
import useWebRTC from './video-chat/webrtc/use-webrtc';
import './css/style.css';

const mediaSize = {
  localStreamSize: { height: 70, width: 70 },
  remoteStreamSize: { height: 150, width: 180 }
};

const mediaConstraints = { video: true, audio: false };

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
    handleSendMessage,
    state,
    webRTCError,
    remoteMediaStream,
    localMediaStream
  } = useWebRTC({
    sendSignalingMessage,
    signalingMessage,
    mediaConstraints,
    iceServers
  });
  const { uiState } = useVideoChatUiState({ state });
  return (
    <div className="client">
      <div className="client-top">
        <VideoChatView
          name={name}
          target={target}
          mediaSize={mediaSize}
          handleSendMessage={handleSendMessage}
          state={state}
          localMediaStream={localMediaStream}
          uiState={uiState}
          remoteMediaStream={remoteMediaStream}
          webRTCError={webRTCError}
        />
      </div>
      <div className="client-bottom">
        <WebRTCState
          signalingState={state.signalingState}
          connectionState={state.connectionState}
          iceGatheringState={state.iceGatheringState}
          iceConnectionState={state.iceConnectionState}
        />
      </div>
    </div>
  );
}
