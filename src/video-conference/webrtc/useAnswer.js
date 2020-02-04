/* eslint-disable no-restricted-syntax */
import { useEffect, useState } from 'react';

export default function useCallee({
  state,
  signalingMessage,
  sendSignalingMessage,
  rtcPeerConnection,
  createRTCPeerConnection,
  remoteIceCandidates,
  getLocalMediaStream,
  localMediaStream
}) {
  const [calleeError, setCalleeError] = useState(null);
  const [remoteOffer, setRemoteOffer] = useState(null);
  const [localTrackAdded, setLocalTrackAdded] = useState(false);

  function resetState() {
    setRemoteOffer(null);
    setLocalTrackAdded(false);
  }
  useEffect(() => {
    return () => {
      if (state.signalingState === 'closed') {
        resetState();
      }
    };
  });
  useEffect(() => {
   
    if (signalingMessage && signalingMessage.message.type === 'offer') {
    
      setRemoteOffer(signalingMessage.message.sdp);
    }
  }, [signalingMessage]);
  useEffect(() => {
    if (remoteOffer) {

      createRTCPeerConnection(false);
    }
  }, [remoteOffer]);
  useEffect(() => {
    if (rtcPeerConnection && remoteOffer) {
 
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
        .catch(err => {
          setCalleeError(err);
        });
    }
  }, [rtcPeerConnection, remoteOffer]);

  function initiateAnswer() {
    getLocalMediaStream();
  }

  useEffect(() => {
    if (localMediaStream && rtcPeerConnection && remoteOffer && rtcPeerConnection.signalingState !=='closed') {
      localMediaStream.getVideoTracks().forEach(t => {
        rtcPeerConnection.addTrack(t, localMediaStream);
      });
      setLocalTrackAdded(true);
    }
  }, [localMediaStream, rtcPeerConnection, remoteOffer]);

  useEffect(() => {
    if (
      remoteOffer &&
      rtcPeerConnection &&
      rtcPeerConnection.getReceivers().length > 0
    ) {
      rtcPeerConnection
        .createAnswer()
        .then(answer => {
          return rtcPeerConnection.setLocalDescription(answer);
        })
        .then(() => {
          sendSignalingMessage({
            sdp: rtcPeerConnection.localDescription,
            type: 'answer'
          });
        })
        .catch(err => {
          setCalleeError(err);
        });
    }
  }, [rtcPeerConnection, remoteOffer, localTrackAdded]);

  return { initiateAnswer, calleeError };
}