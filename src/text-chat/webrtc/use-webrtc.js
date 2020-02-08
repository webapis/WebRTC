import { useEffect, useState } from 'react';
import useRTCPeerConnection from './useRTCPeerConnection';
import useOffer from './useOffer';
import useAnswer from './useAnswer';

export default function useWebRTCDataChannel({
  sendSignalingMessage,
  signalingMessage,
  iceServers,
  name
}) {
  const {
    rtcPeerConnection,
    dataChannel,
    datachannelError,
    state,
    message,
    remoteIceCandidates,
    createRTCPeerConnection
  } = useRTCPeerConnection({
    signalingMessage,
    sendSignalingMessage,
    iceServers
  });
  const { initiateOffer, offerError } = useOffer({
    signalingMessage,
    sendSignalingMessage,
    rtcPeerConnection,
    createRTCPeerConnection,
    remoteIceCandidates
  });
  const { asnwerError } = useAnswer({
    signalingMessage,
    sendSignalingMessage,
    rtcPeerConnection,
    createRTCPeerConnection,
    remoteIceCandidates
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (asnwerError) {
      setError(asnwerError);
    } else if (offerError) {
      setError(offerError);
    } else if (datachannelError) {
      setError(datachannelError);
    }
  }, [asnwerError, offerError, datachannelError]);

  function sendMessage(value) {
  
    const localMessage = { sender: name, message: value };
    dataChannel.send(JSON.stringify(localMessage));
  }
  return {
    initiateOffer,
    error,
    message,
    sendMessage,
    state
  };
}
