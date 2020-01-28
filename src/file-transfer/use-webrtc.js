/* eslint-disable no-debugger */
import { useState, useEffect } from 'react';
import iceServers from './ice-servers';
import useAnswer from './useAnswer';
import useOffer from './useOffer';
import useRTCPeerConnection from './useRTCPeerConnection';
import useFileAssembler from './useFileAssembler';

export default function useWebRTC({
  signalingMessage,
  sendSignalingMessage,
  startReadingFileBySlice,
  fileChunk,
  file
}) {
  const [error, setError] = useState(null);
  const {
    createRTCPeerConnection,
    rtcPeerConnection,
    dataChannel,
    dataChannelError,
    message,
    state,
    remoteIceCandidates
  } = useRTCPeerConnection({
    iceServers,
    sendSignalingMessage,
    signalingMessage,
    startReadingFileBySlice
  });
  const {
    answerError,
    sendLocalAnswer,
    remoteFileChunk,
    remoteFileInfo
  } = useAnswer({
    createRTCPeerConnection,
    rtcPeerConnection,
    signalingMessage,
    sendSignalingMessage,
    remoteIceCandidates,
    message
  });
  const { initiateOffer, offerError } = useOffer({
    createRTCPeerConnection,
    rtcPeerConnection,
    signalingMessage,
    sendSignalingMessage,
    message,
    dataChannel,
    localFileChunk: fileChunk,
    remoteIceCandidates,
    file
  });
  const { downloadProgress, assembledFile } = useFileAssembler({
    fileChunk: remoteFileChunk,
    fileInfo: remoteFileInfo
  });

  useEffect(() => {
    if (answerError) {
      setError(answerError);
    } else if (offerError) {
      setError(offerError);
    } else if (dataChannelError) {
      setError(dataChannelError);
    }
  }, [answerError, offerError, dataChannelError]);

  function handleSendMessage(type) {
    switch (type) {
      case 'file-offer':
        debugger;
        initiateOffer();
        break;
      case 'file-answer':
        sendLocalAnswer();
        break;
      case 'file-decline':
        sendSignalingMessage({ type: 'file-decline' });

        break;
      case 'cancelled-recieving-file':
        dataChannel.send(JSON.stringify({ type: 'cancelled-recieving-file' }));
        break;

      default:
    }
  }

  function closeDataChannel() {
    dataChannel.close();
  }

  return {
    handleSendMessage,
    error,
    downloadProgress,
    assembledFile,
    closeDataChannel,
    remoteFileInfo,
    state
  };
}
