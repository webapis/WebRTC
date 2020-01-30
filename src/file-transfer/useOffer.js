import { useEffect, useState } from 'react';

export default function useOffer({
  createRTCPeerConnection,
  rtcPeerConnection,
  signalingMessage,
  sendSignalingMessage,
  remoteIceCandidates,
  state
}) {
  const [offerError, setOfferError] = useState(null);
  const [initiator, setInitiator] = useState(false);

  useEffect(() => {
    if (state && state.signalingState === 'closed') {
      setOfferError(null);
      setInitiator(false);
    }
  }, [state]);
  function initiateOffer() {
   //  debugger; // 1. offer
    setInitiator(true);
  }

  useEffect(() => {
    if (initiator) {
    //  debugger; // 2. offer
      createRTCPeerConnection(true);
    }
  }, [initiator]);

  useEffect(() => {
    if (rtcPeerConnection && initiator) {
      //   debugger; // 3.offer
      rtcPeerConnection
        .createOffer()
        .then(offer => {
       //      debugger; // 4.offer
          return rtcPeerConnection.setLocalDescription(offer);
        })
        .then(() => {
         //    debugger; // 5.offer
          sendSignalingMessage({
            type: 'file-offer',
            sdp: rtcPeerConnection.localDescription
          });
        })
        .catch(err => {
        //     debugger; // 6.1.offer
          setOfferError(err);
        });
    }
  }, [rtcPeerConnection]);

  useEffect(() => {
    if (
      rtcPeerConnection &&
      signalingMessage &&
      initiator &&
      signalingMessage.type === 'file-answer'
    ) {
      //  debugger; // 7.offer
      rtcPeerConnection
        .setRemoteDescription(signalingMessage.sdp)
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
         //    debugger; // 7.1.offer
          setOfferError(err);
        });
    }
  }, [signalingMessage, rtcPeerConnection]);

  return { initiateOffer, offerError };
}
