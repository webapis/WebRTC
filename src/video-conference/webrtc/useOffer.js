/* eslint-disable no-restricted-syntax */
import { useEffect, useState } from 'react';

export default function useOffer({
  state,
  signalingMessage,
  sendSignalingMessage,
  createRTCPeerConnection,
  rtcPeerConnection,
  getLocalMediaStream,
  localMediaStream,
  remoteIceCandidates,
  remoteParticipant,
  name
}) {
  const [callerError, setCallerError] = useState(false);
  const [initiated, setInitiated] = useState(false);

  function resetState() {
    setInitiated(false);
    setCallerError(null);
  }

  function initiateOffer() {
    setInitiated(true);
  }
  useEffect(() => {
    if (
      remoteParticipant &&
      signalingMessage &&
      signalingMessage.message &&
      signalingMessage.message.type === 'joined-conference' &&
      signalingMessage.message.participant === remoteParticipant
    ) {
      debugger; // 1. Offer

      initiateOffer();
    }
  }, [signalingMessage, remoteParticipant]);

  useEffect(() => {
    if (initiated) {
      debugger; //2. Offer
      getLocalMediaStream();
    }
  }, [initiated]);

  useEffect(() => {
    if (localMediaStream && initiated) {
      debugger; // 3. Offer

      createRTCPeerConnection(true);
    }
  }, [localMediaStream, initiated]);
useEffect(()=>{
  if(rtcPeerConnection && localMediaStream && initiated){
    debugger; // 3.1
    localMediaStream.getVideoTracks().forEach(t => {
      rtcPeerConnection.addTrack(t, localMediaStream);
    });
  }
},[rtcPeerConnection,localMediaStream, initiated])
  useEffect(() => {
    if (rtcPeerConnection && rtcPeerConnection.getReceivers().length > 0) {
      debugger; // 4 Offer
      rtcPeerConnection
        .createOffer()
        .then(offer => {
          debugger; // 5. Offer
          return rtcPeerConnection.setLocalDescription(offer);
        })
        .then(() => {
          debugger; // 6. Offer
          sendSignalingMessage({
            message: {
              sdp: rtcPeerConnection.localDescription,
              type: 'offer',
              target: remoteParticipant
            }
          });
        })
        .catch(err => {
          debugger; // 6.1. Offer
          setCallerError(err);
        });
    }
  }, [rtcPeerConnection]);

  useEffect(() => {
    if (
      signalingMessage &&
      signalingMessage.message.target === name &&
      signalingMessage.message.type === 'answer' &&
      rtcPeerConnection
    ) {
      debugger; // 7. Offer
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
          setCallerError(err); // 7.1. Caller
        });
    }
  }, [signalingMessage, rtcPeerConnection]);
  useEffect(() => {
    return () => {
      if (state.signalingState === 'closed') {
        resetState();
      }
    };
  });

  // useEffect(() => {
  //   if (
  //     rtcPeerConnection &&
  //     localMediaStream &&
  //     initiated &&
  //     rtcPeerConnection.signalingState !== 'closed'
  //   ) {
  //     localMediaStream.getVideoTracks().forEach(t => {
  //       rtcPeerConnection.addTrack(t, localMediaStream);
  //     });
  //   }
  // }, [rtcPeerConnection, localMediaStream]);

  return { initiateOffer, callerError };
}
