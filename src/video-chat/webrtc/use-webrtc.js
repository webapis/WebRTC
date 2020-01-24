import { useState, useEffect } from 'react';
import useRTCPeerConnection from './useRTCPeerConnection';
import useLocalMediaStream from './localMedieaStream/useLocalMediaStream';
import useCaller from './useCaller';
import useCallee from './useCallee';

export default function useWebRTC({
  iceServers,
  signalingMessage,
  sendSignalingMessage,
  mediaConstraints
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
    signalingMessage
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
  const { initiateOffer, callerError } = useCaller({
    state,
    signalingMessage,
    sendSignalingMessage,
    createRTCPeerConnection,
    rtcPeerConnection,
    localMediaStream,
    getLocalMediaStream,
    remoteIceCandidates
  });
  const { initiateAnswer, calleeError } = useCallee({
    state,
    signalingMessage,
    sendSignalingMessage,
    createRTCPeerConnection,
    rtcPeerConnection,
    localMediaStream,
    getLocalMediaStream,
    remoteIceCandidates
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
