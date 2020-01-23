import { useEffect, useState } from 'react';

export default function useCallee({
    signalingMessage,
  sendSignalingMessage,
  rtcPeerConnection,
  createRTCPeerConnection,
  remoteIceCandidates,
  getLocalMediaStream,
  localMediaStream
}) {
  const [calleeError, setCalleeError] = useState(null);
  const [remoteOffer,setRemoteOffer]= useState(null);
  useEffect(() => {
    if (signalingMessage && signalingMessage.type==='offer') {
      debugger; //1.Callee
      setRemoteOffer(signalingMessage.sdp.sdp)
    }
  }, [signalingMessage]);
  useEffect(()=>{
      if(remoteOffer){
          debugger; //1.1 Caller
          createRTCPeerConnection()
      }
  },[remoteOffer])
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
          debugger; //3.1
          setCalleeError(err);
        });
    }
  }, [rtcPeerConnection,remoteOffer]);

  function initiateAnswer() {
    debugger; //4. Callee
    getLocalMediaStream();
  }

  useEffect(() => {
    if (localMediaStream && rtcPeerConnection && remoteOffer) {
      debugger; //5. Callee
      localMediaStream.getVideoTracks().forEach(t => {
        rtcPeerConnection.addTrack(t, localMediaStream);
      });
    }
  }, [localMediaStream,rtcPeerConnection, remoteOffer]);

  useEffect(() => {
    if (remoteOffer&& rtcPeerConnection && rtcPeerConnection.getReceivers().length) {
      debugger; // 6.Callee;

      rtcPeerConnection
        .createAnswer()
        .then(answer => {
          debugger; // 7.Callee
          rtcPeerConnection.setLocalDescription(answer);
        })
        .then(() => {
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
  }, [rtcPeerConnection, remoteOffer]);

  return { initiateAnswer, calleeError };
}
