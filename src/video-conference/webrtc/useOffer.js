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
    if (initiated) {
   
      getLocalMediaStream();
    }
  }, [initiated]);

  useEffect(() => {
    if (localMediaStream && initiated) {
  

      createRTCPeerConnection(true);
    }
  }, [localMediaStream, initiated]);
useEffect(()=>{
  if(rtcPeerConnection && localMediaStream && initiated){

    localMediaStream.getVideoTracks().forEach(t => {
      rtcPeerConnection.addTrack(t, localMediaStream);
    });
  }
},[rtcPeerConnection,localMediaStream, initiated])
  useEffect(() => {
    if (rtcPeerConnection && rtcPeerConnection.getReceivers().length > 0) {
 
      rtcPeerConnection
        .createOffer()
        .then(offer => {
       
          return rtcPeerConnection.setLocalDescription(offer);
        })
        .then(() => {
       
          sendSignalingMessage({
            message: {
              sdp: rtcPeerConnection.localDescription,
              type: 'offer',
              target: remoteParticipant,
              name
            }
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
      signalingMessage.message.target === name &&
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



  return { initiateOffer, callerError };
}
