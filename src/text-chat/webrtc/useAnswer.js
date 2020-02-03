/* eslint-disable no-restricted-syntax */
import { useState, useEffect } from 'react';

export default function useAnswer({
  signalingMessage,
  sendSignalingMessage,
  createRTCPeerConnection,
  rtcPeerConnection,
  remoteIceCandidates
}) {
  const [remoteOffer, setRemoteOffer] = useState(null);
  const [asnwerError, setAnswerError] = useState(null);

  useEffect(() => {
    if (signalingMessage && signalingMessage.type === 'offer') {
    
      setRemoteOffer(signalingMessage.sdp);
    }
  }, [signalingMessage]);

  useEffect(() => {
    if (remoteOffer) {
      createRTCPeerConnection(false);
    }
  }, [remoteOffer]);

  useEffect(() => {
    if (remoteOffer && rtcPeerConnection) {
      rtcPeerConnection
        .setRemoteDescription(remoteOffer)
        .then(() => {
          if (remoteIceCandidates.length > 0) {
            for (const ice in remoteIceCandidates) {
              if (ice) {
                rtcPeerConnection.addIceCandidate(remoteIceCandidates[ice]);
              }
            }
          }
        })
        .then(() => {
          return rtcPeerConnection.createAnswer();
        })
        .then(answer => {
       return   rtcPeerConnection.setLocalDescription(answer);
        })
        .then(() => {
          sendSignalingMessage({
            type: 'answer',
            sdp: rtcPeerConnection.localDescription
          });
        })
        .catch(err => {
          setAnswerError(err);
        });
    }
  }, [rtcPeerConnection, remoteOffer]);

  return { asnwerError };
}
