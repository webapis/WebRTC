import React, { useEffect } from 'react';
import useWebRTC from '../webrtc/use-webrtc';
import iceServers from '../webrtc/ice-servers';
import DisplayMediaStream from './DisplayMediaStream';
import './css/style.css';

export default function ParticipantView({
  signalingMessage,
  sendSignalingMessage,
  remoteParticipant,
  name
}) {
  const { state, remoteMediaStream } = useWebRTC({
    signalingMessage,
    sendSignalingMessage,
    remoteParticipant,
    name,
    iceServers,
    mediaConstraints: { video: true, audio: false }
  });

  return (
    <div className="participant">
      <DisplayMediaStream mediaStream={remoteMediaStream} width="100" />
    </div>
  );
}
