import { useEffect, useState } from 'react';

export default function useCaller({
  signalingMessage,
  sendSignalingMessage,
  createRTCPeerConnection,
  rtcPeerConnection,
  getLocalMediaStream,
  localMediaStream,
  remoteIceCandidates
}) {
  const [callerError, setCallerError] = useState(null);
  
  function initiateOffer() {
    debugger; // 1.Caller
    getLocalMediaStream();
  }

  useEffect(() => {
    if (localMediaStream) {
      debugger; //2. Caller
      createRTCPeerConnection();
    }
  }, [localMediaStream]);

  useEffect(() => {
    if (rtcPeerConnection && localMediaStream) {
      debugger; //3.Caller
      localMediaStream.getVideoTracks().forEach(t => {
        rtcPeerConnection.addTrack(t, localMediaStream);
      });
    }
  }, [rtcPeerConnection,localMediaStream]);

  useEffect(() => {
    if (rtcPeerConnection && rtcPeerConnection.getReceivers().length > 0) {
      debugger; //4.Caller
      rtcPeerConnection
        .createOffer()
        .then(offer => {
          debugger; //5.Caller
          rtcPeerConnection.setLocalDescription(offer);
        })
        .then(() => {
          debugger; // 6. Caller
          sendSignalingMessage({
            sdp: rtcPeerConnection.localDescription,
            type: 'offer'
          });
        })
        .catch(err => {
          debugger; //6.1 Caller
          setCallerError(err);
        });
    }
  }, [rtcPeerConnection]);

  useEffect(() => {
    if (signalingMessage && signalingMessage.type == 'answer') {
      debugger; // 7. Caller
      rtcPeerConnection
        .setRemoteDescription(signalingMessage.sdp.sdp)
        .then(() => {
          debugger; //8.Caller
          if (remoteIceCandidates.length > 0) {
            for (let ice in remoteIceCandidates) {
              if (ice) {
                rtcPeerConnection.addIceCandidate(remoteIceCandidates[ice]);
              }
            }
          }
        })
        .catch(err => {
          setCallerError(err); //8.1. Caller
        });
    }
  }, [signalingMessage]);

  return { initiateOffer, callerError };
}
