
import { useState, useEffect } from 'react';
import iceServers from './ice-servers';
import useAnswer from './useAnswer';
import useOffer from './useOffer';
import useRTCPeerConnection from './useRTCPeerConnection';
import useSender from './useFileSender';
import useReciever from './useFileReciever';

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
  const { answerError } = useAnswer({
    state,
    createRTCPeerConnection,
    rtcPeerConnection,
    signalingMessage,
    sendSignalingMessage,
    remoteIceCandidates,
    message
  });
  const { initiateOffer, offerError } = useOffer({
    state,
    createRTCPeerConnection,
    rtcPeerConnection,
    signalingMessage,
    sendSignalingMessage,
    message,
    dataChannel,
    remoteIceCandidates,
    file
  });
  const {
    downloadProgress,
    remoteFileInfo,
    acceptFile,
    assembledFile
  } = useReciever({ state, message, dataChannel });
  const { uploadProgress, cancelledSending } = useSender({
    message,
    dataChannel,
    startReadingFileBySlice,
    state,
    file,
    fileChunk
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
        initiateOffer();
        break;
      case 'file-answer':

        acceptFile();
        break;
      case 'file-decline':
        sendSignalingMessage({ type: 'file-decline' });
        break;
      case 'cancelled-recieving-file':
        dataChannel.send(JSON.stringify({ type: 'cancelled-recieving-file' }));
        break;
      case 'cancelled-sending-file':
  
        cancelledSending();
        break;
      case 'file-downloaded':
      
        dataChannel.send(JSON.stringify({ type: 'file-downloaded' }));
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
    uploadProgress,
    downloadProgress,
    closeDataChannel,
    remoteFileInfo,
    state,
    assembledFile
  };
}
