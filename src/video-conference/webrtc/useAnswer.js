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
  localMediaStream,
  remoteParticipant,
  name
}) {
  const [calleeError, setCalleeError] = useState(null);
  const [remoteOffer, setRemoteOffer] = useState(null);
  const [localTrackAdded, setLocalTrackAdded] = useState(false);
  function initiateAnswer() {
    getLocalMediaStream();
  }
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
    if (
      signalingMessage &&
      signalingMessage.message.target === name &&
      signalingMessage.message.type === 'offer'
    ) {
      debugger; // 1 Answer
      setRemoteOffer(signalingMessage.message.sdp);
    }
  }, [signalingMessage]);
  useEffect(() => {
    if (remoteOffer) {
      debugger; // 2 Answer
      createRTCPeerConnection(false);
    }
  }, [remoteOffer]);
  useEffect(() => {
    if (rtcPeerConnection && remoteOffer) {
      debugger; // 3 Answer
      rtcPeerConnection
        .setRemoteDescription(remoteOffer)
        .then(() => {
          if (remoteIceCandidates.length > 0) {
            debugger; // 4 Answer
            for (const ice in remoteIceCandidates) {
              if (ice) {
                rtcPeerConnection.addIceCandidate(remoteIceCandidates[ice]);
              }
            }
          }
        })
        .then(() => {
          debugger; // 5 Answer
          initiateAnswer();
        })
        .catch(err => {
          debugger; // 5.1 Answer
          setCalleeError(err);
        });
    }
  }, [rtcPeerConnection, remoteOffer]);

  useEffect(() => {
    if (
      localMediaStream &&
      rtcPeerConnection &&
      remoteOffer &&
      rtcPeerConnection.signalingState !== 'closed'
    ) {
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
      debugger; // 6 Answer
      rtcPeerConnection
        .createAnswer()
        .then(answer => {
          debugger; // 7 Answer
          return rtcPeerConnection.setLocalDescription(answer);
        })
        .then(() => {
          debugger; // 8 Answer
          sendSignalingMessage({
            message: {
              sdp: rtcPeerConnection.localDescription,
              type: 'answer',
              target: remoteParticipant
            }
          });
        })
        .catch(err => {
          debugger; // 8.1 Answer
          setCalleeError(err);
        });
    }
  }, [rtcPeerConnection, remoteOffer, localTrackAdded]);

  return { initiateAnswer, calleeError };
}
