/* eslint-disable no-restricted-syntax */
import { useEffect, useState } from 'react';

export default function useCaller({
  state,
  signalingMessage,
  sendSignalingMessage,
  createRTCPeerConnection,
  rtcPeerConnection,
  getLocalMediaStream,
  localMediaStream,
  remoteIceCandidates
}) {
  const [callerError, setCallerError] = useState(false);
  const [initiated, setInitiated] = useState(false);
  function resetState() {
    setInitiated(false);
    setCallerError(null);
  }

  useEffect(() => {
    return () => {
      if (state.signalingState === 'closed') {
        resetState();
      }
    };
  });
  function initiateOffer() {
    setInitiated(true);
  }
  useEffect(() => {
    if (initiated) {
      getLocalMediaStream();
    }
  }, [initiated]);

  useEffect(() => {
    if (localMediaStream && initiated) {
      createRTCPeerConnection(true);
    }
  }, [localMediaStream, initiated]);

  useEffect(() => {
    if (rtcPeerConnection && localMediaStream && initiated   && rtcPeerConnection.signalingState !=='closed') {
      localMediaStream.getVideoTracks().forEach(t => {
        rtcPeerConnection.addTrack(t, localMediaStream);
      });
    }
  }, [rtcPeerConnection, localMediaStream]);

  useEffect(() => {
    if (rtcPeerConnection && rtcPeerConnection.getReceivers().length > 0) {
      rtcPeerConnection
        .createOffer()
        .then(offer => {
          return rtcPeerConnection.setLocalDescription(offer);
        })
        .then(() => {
          sendSignalingMessage({
            sdp: rtcPeerConnection.localDescription,
            type: 'offer'
          });
        })
        .catch(err => {
          setCallerError(err);
        });
    }
  }, [rtcPeerConnection]);

  useEffect(() => {
    if (
      signalingMessage &&
      signalingMessage.message.type === 'answer' &&
      rtcPeerConnection
    ) {
      rtcPeerConnection
        .setRemoteDescription(signalingMessage.message.sdp)
        .then(() => {
          if (remoteIceCandidates.length > 0) {
            for (const ice in remoteIceCandidates) {
              if (ice) {
                rtcPeerConnection.addIceCandidate(remoteIceCandidates[ice]);
              }
            }
          }
        })
        .catch(err => {
          setCallerError(err); // 8.1. Caller
        });
    }
  }, [signalingMessage, rtcPeerConnection]);

  return { initiateOffer, callerError };
}