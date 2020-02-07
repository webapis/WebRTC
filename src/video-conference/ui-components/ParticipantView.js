import React, { useEffect, useState } from 'react';
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
  const {
    remoteMediaStream,
    initiateOffer,
    rtcPeerConnection
  } = useWebRTC({
    signalingMessage,
    sendSignalingMessage,
    remoteParticipant,
    name,
    iceServers,
    mediaConstraints: { video: true, audio: false }
  });
  const [joined, setJoined] = useState(false);
  useEffect(() => {
    if (
      signalingMessage &&
      signalingMessage.message &&
      signalingMessage.message.type === 'joined-conference' &&
      signalingMessage.message.participant === name
    ) {
      setJoined(true);
    }

    if (
      signalingMessage &&
      signalingMessage.message &&
      signalingMessage.message.type === 'joined-conference' &&
      signalingMessage.message.participant === remoteParticipant &&
      joined
    ) {
      initiateOffer();
    }

    if (
      signalingMessage &&
      signalingMessage.message &&
      signalingMessage.message.type === 'leave-conference' &&
      signalingMessage.message.participant === name
    ) {
     
      if (rtcPeerConnection) {
        rtcPeerConnection.close();
        setJoined(false)
      }
    }

    if (
      signalingMessage &&
      signalingMessage.message &&
      signalingMessage.message.type === 'leave-conference' &&
      signalingMessage.message.participant === remoteParticipant
    ) {
    
      if (rtcPeerConnection) {
        rtcPeerConnection.close();
        setJoined(false)
      }
    }
  }, [signalingMessage]);
  return (
    <div className="participant">
 
      <DisplayMediaStream title={remoteParticipant} mediaStream={remoteMediaStream} width="100" />
    </div>
  );
}
