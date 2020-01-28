/* eslint-disable no-debugger */
import { useEffect, useState } from 'react';

export default function useOffer({
  createRTCPeerConnection,
  rtcPeerConnection,
  signalingMessage,
  sendSignalingMessage,
  remoteIceCandidates,
  startReadingFileBySlice,
  file,
  message,
  dataChannel,
  localFileChunk
}) {
  const [offerError, setOfferError] = useState(null);
  const [cancelledSending, setCancelledSending] = useState(null);
  const [initiator, setInitiator] = useState(false);

  function initiateOffer() {
    debugger; // 1. offer
    setInitiator(true);
  }

  useEffect(() => {
    if (initiator) {
      debugger; // 2. offer
      createRTCPeerConnection(true);
    }
  }, [initiator]);

  useEffect(() => {
    if (rtcPeerConnection && initiator) {
      debugger; // 3.offer
      rtcPeerConnection
        .createOffer()
        .then(offer => {
          debugger; // 4.offer
          return rtcPeerConnection.setLocalDescription(offer);
        })
        .then(() => {
          debugger; // 5.offer
          const fileInfo = {
            size: file.size,
            name: file.name,
            type: file.type
          };
          sendSignalingMessage({
            type: 'file-offer',
            sdp: rtcPeerConnection.localDescription,
            fileInfo
          });
        })
        .catch(err => {
          debugger; // 6.1.offer
          setOfferError(err);
        });
    }
  }, [rtcPeerConnection]);

  useEffect(() => {
    if (
      rtcPeerConnection &&
      signalingMessage &&
      signalingMessage.type === 'file-answer'
    ) {
      debugger; // 7.offer
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
          debugger; // 7.1.offer
          setOfferError(err);
        });
    }
  }, [signalingMessage, rtcPeerConnection]);

  useEffect(() => {
    if (
      message &&
      message.constructor === String &&
      message.type &&
      message.type === 'cancelled-recieving-file'
    ) {
      setCancelledSending(true);
    }
  }, [message]);

  // function sendFileChunk() {
  //   if (!cancelledSending) {
  //     try {
  //       dataChannel.send(localFileChunk);
  //       startReadingFileBySlice({ readNext: true });
  //     } catch (err) {
  //       setOfferError(err);
  //     }
  //   } else {
  //     startReadingFileBySlice({ readNext: false });
  //     dataChannel.close();
  //   }
  // }

  // useEffect(() => {
  //   if (localFileChunk) {
  //   //  sendFileChunk();
  //   }
  // }, [localFileChunk]);

  return { initiateOffer, offerError };
}
