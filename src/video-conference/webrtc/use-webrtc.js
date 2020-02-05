import { useState, useEffect } from 'react';
import useRTCPeerConnection from './useRTCPeerConnection';
import useLocalMediaStream from './localMediaStream/useLocalMediaStream';
import useOffer from './useOffer';
import useAnswer from './useAnswer';

export default function useWebRTC({
  iceServers,
  signalingMessage,
  sendSignalingMessage,
  mediaConstraints,
  remoteParticipant,
  name
}) {
  const {
    remoteMediaStream,
    rtcPeerConnection,
    createRTCPeerConnection,
    state,
    remoteIceCandidates,
    closeConnection
  } = useRTCPeerConnection({
    sendSignalingMessage,
    iceServers,
    signalingMessage,
    remoteParticipant
  });
  const [error, setError] = useState(null);

  const {
    localMediaStream,
    getLocalMediaStream,
    localMediaStreamError
  } = useLocalMediaStream({
    state,
    mediaConstraints
  });
  const { initiateOffer, callerError } = useOffer({
    state,
    signalingMessage,
    sendSignalingMessage,
    createRTCPeerConnection,
    rtcPeerConnection,
    localMediaStream,
    getLocalMediaStream,
    remoteIceCandidates,
    remoteParticipant,
    name
  });
  const { initiateAnswer, calleeError } = useAnswer({
    state,
    signalingMessage,
    sendSignalingMessage,
    createRTCPeerConnection,
    rtcPeerConnection,
    localMediaStream,
    getLocalMediaStream,
    remoteIceCandidates,
    remoteParticipant,
    name
  });
  function resetState() {
    setError(null);
  }
  useEffect(() => {
    if (!rtcPeerConnection) {
      //  debugger;
      resetState();
    }
  }, [rtcPeerConnection]);
  useEffect(() => {
    if (callerError) {
      setError(callerError);
    } else if (calleeError) {
      setError(calleeError);
    } else if (localMediaStreamError) {
      setError(localMediaStreamError);
    }
  }, [calleeError, callerError, localMediaStreamError]);

  function handleSendMessage(type) {
    switch (type) {
      case 'answer':
        initiateAnswer();
        break;
      case 'offer':
        initiateOffer();
        break;
      case 'decline':
        closeConnection('decline');
        break;
      case 'end':
        closeConnection('end');
        break;
      case 'ignore':
        closeConnection('ignore');
        break;
      case 'cancel':
        closeConnection('cancel');
        break;

      default:
    }
  }

  return {
    webRTCError: error,
    state,
    localMediaStream,
    remoteMediaStream,
    handleSendMessage
  };
}
