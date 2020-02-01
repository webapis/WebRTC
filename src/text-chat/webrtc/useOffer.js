import { useEffect, useState } from 'react';

export default function useOffer({
  rtcPeerConnection,
  createRTCPeerConnection,
  sendSignalingMessage,
  signalingMessage,
  remoteIceCandidates
}) {
  const [initiator, setInitiator] = useState(false);
  const [offerError, setOfferError] = useState(null);
  function initiateOffer() {
    setInitiator(true);
  }

  useEffect(() => {
    if (initiator) {

        createRTCPeerConnection(true);
    }
  }, [initiator]);

  useEffect(() => {
    if (initiator && rtcPeerConnection) {
      rtcPeerConnection
        .createOffer()
        .then(offer => {
        return  rtcPeerConnection.setLocalDescription(offer);
        })
        .then(() => {
          sendSignalingMessage({
            type: 'offer',
            sdp: rtcPeerConnection.localDescription
          });
        })
        .catch(err => {
          setOfferError(err);
        });
    }
  }, [rtcPeerConnection, initiator]);

  useEffect(() => {
    if (
      signalingMessage &&
      signalingMessage.type === 'answer' &&
      signalingMessage.sdp.sdp
    ) {
      rtcPeerConnection
        .setRemoteDescription(signalingMessage.sdp.sdp)
        .then(() => {
          if (remoteIceCandidates.length > 0) {
            for (let ice in remoteIceCandidates) {
              if (ice) {
                rtcPeerConnection.addIceCandidate(remoteIceCandidates[ice]);
              }
            }
          }
        })

        .catch(err => {
          setOfferError(err);
        });
    }
  }, [signalingMessage]);

  return { initiateOffer, offerError };
}
