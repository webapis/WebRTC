/* eslint-disable no-unused-vars */
import React from 'react';
import WebRTCState from './common/webrtc-connection-state';
import VideoConferenceView from './video-conference/ui-components/VideoConferenceView';
import useVideoConferenceUIState from './video-conference/webrtc/useVideoConferenceUIState';
import useSignaling from './signaling/useSignaling';
import iceServers from './video-conference/webrtc/ice-servers';
import useWebRTC from './video-conference/webrtc/use-webrtc';
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
  const { uiState } = useVideoConferenceUIState({ state });
  return (
    <div className="client">
      <div className="client-top">
        <VideoConferenceView
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
