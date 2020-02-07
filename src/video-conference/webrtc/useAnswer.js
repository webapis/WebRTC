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
      signalingMessage.message.name===remoteParticipant &&
      signalingMessage.message.type === 'offer'
    ) {
   
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
        .then(() => {
     
          initiateAnswer();
        })
        .catch(err => {
      
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
  
      rtcPeerConnection
        .createAnswer()
        .then(answer => {
    
          return rtcPeerConnection.setLocalDescription(answer);
        })
        .then(() => {
     
          sendSignalingMessage({
            message: {
              sdp: rtcPeerConnection.localDescription,
              type: 'answer',
              target: remoteParticipant
            }
          });
        })
        .catch(err => {
   
          setCalleeError(err);
        });
    }
  }, [rtcPeerConnection, remoteOffer, localTrackAdded]);

  return { initiateAnswer, calleeError };
}
