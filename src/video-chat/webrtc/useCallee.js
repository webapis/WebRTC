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
        //  debugger;
        resetState();
      }
    };
  });
  useEffect(() => {
    if (signalingMessage && signalingMessage.type === 'offer') {
      debugger; //1.Callee
      setRemoteOffer(signalingMessage.sdp.sdp);
    }
  }, [signalingMessage]);
  useEffect(() => {
    if (remoteOffer) {
      debugger; //1.1 Caller
      createRTCPeerConnection(false);
    }
  }, [remoteOffer]);
  useEffect(() => {
    if (rtcPeerConnection && remoteOffer) {
      debugger; //2.Callee
      rtcPeerConnection
        .setRemoteDescription(remoteOffer)
        .then(() => {
          debugger; //3.Callee
          if (remoteIceCandidates.length > 0) {
            for (let ice in remoteIceCandidates) {
              if (ice) {
                rtcPeerConnection.addIceCandidate(remoteIceCandidates[ice]);
              }
            }
          }
        })
        .catch(err => {
          debugger; //3.2
          setCalleeError(err);
        });
    }
  }, [rtcPeerConnection, remoteOffer]);

  function initiateAnswer() {
    debugger; //4. Callee
    getLocalMediaStream();
  }

  useEffect(() => {
    if (localMediaStream && rtcPeerConnection && remoteOffer) {
      debugger; //5. Callee
      localMediaStream.getVideoTracks().forEach(t => {
        debugger;
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
      debugger; // 6.Callee;

      rtcPeerConnection
        .createAnswer()
        .then(answer => {
          debugger; // 7.Callee
         return rtcPeerConnection.setLocalDescription(answer);
       
        })
        .then(()=>{
          debugger; // 8. Callee
          sendSignalingMessage({
            sdp: rtcPeerConnection.localDescription,
            type: 'answer'
          });
        })
        .catch(err => {
          debugger; // 8.1 Callee
          setCalleeError(err);
        });
    }
  }, [rtcPeerConnection, remoteOffer, localTrackAdded]);

  return { initiateAnswer, calleeError };
}
