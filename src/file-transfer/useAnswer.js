/* eslint-disable no-debugger */
import { useEffect, useState } from 'react';

export default function useAnswer({
  createRTCPeerConnection,
  rtcPeerConnection,
  signalingMessage,
  sendSignalingMessage,
  remoteIceCandidates,
  message
}) {
  const [remoteOffer, setRemoteOffer] = useState(null);
  const [answerError, setAnswerError] = useState(null);
  const [remoteFileChunk, setRemoteFileChunk] = useState(null);
  const [remoteFileInfo, setRemoteFileInfo] = useState(null);
  useEffect(() => {
    if (signalingMessage && signalingMessage.type === 'file-offer') {
      debugger; // 1. Answer
      setRemoteOffer(signalingMessage.sdp);
    }
  }, [signalingMessage]);

  useEffect(() => {
    if (remoteOffer) {
      debugger; // 2. Answer
      createRTCPeerConnection(false);
      setRemoteFileInfo(signalingMessage.fileInfo);
    }
  }, [remoteOffer]);

  useEffect(() => {
    if (rtcPeerConnection && remoteOffer) {
      debugger; // 3.Answer
      rtcPeerConnection
        .setRemoteDescription(remoteOffer)
        .then(() => {
          debugger; // 4.Answer
          if (remoteIceCandidates.length > 0) {
            for (const ice in remoteIceCandidates) {
              if (ice) {
                rtcPeerConnection.addIceCandidate(remoteIceCandidates[ice]);
              }
            }
          }
        })
        .then(() => {
          debugger; // 5.Answer
          return rtcPeerConnection.createAnswer();
        })
        .then(answer => {
          debugger; // 6. Answer
          rtcPeerConnection.setLocalDescription(answer);
        })
        .catch(err => {
          debugger; // 6.1 .Answer
          setAnswerError(err);
        });
    }
  }, [rtcPeerConnection, remoteOffer]);

  function sendLocalAnswer() {
    debugger; // 7. Answer
    sendSignalingMessage({
      type: 'file-answer',
      sdp: rtcPeerConnection.localDescription
    });
  }

  useEffect(() => {
    if (message && message instanceof ArrayBuffer) {
      setRemoteFileChunk(message);
    }
  }, [message]);

  return { answerError, sendLocalAnswer, remoteFileChunk, remoteFileInfo };
}
