/* eslint-disable no-unused-vars */
import React from 'react';
import WebRTCState from './common/webrtc-connection-state';
import FileTransferView from './file-transfer/ui-components/file-transfer-view';
import useSignaling from './signaling/useSignaling';
import useFileReader from './file-reader/useFileReader';
import useWebRTC from './file-transfer/use-webrtc';
import useUIState from './file-transfer/use-ui-state';
import ErrorMessage from './ErrorMessage';
import './css/style.css';

export default function Client({
  target,
  name,
  message,
  sendMessage,
  messageSizeLimit,
  started,
  setStarted
}) {
  const { signalingMessage, sendSignalingMessage } = useSignaling({
    target,
    name,
    message,
    sendMessage,
    messageSizeLimit
  });
  const {
    handleFileChange,
    file,
    error: readerError,
    readProgress,
    startReadingFileBySlice,
    fileChunk,
    readComplete,
    resetFileReaderState
  } = useFileReader();
  const {
    handleSendMessage,
    error: webRTCError,
    uploadProgress,
    downloadProgress,
    state,
    closeDataChannel,
    assembledFile,
    remoteFileInfo
  } = useWebRTC({
    resetFileReaderState,
    readProgress,
    fileChunk,
    sendSignalingMessage,
    signalingMessage,
    startReadingFileBySlice,
    file
  });
  const { uiState } = useUIState({
    state,
    file,
    readProgress,
    downloadProgress,
    readComplete,
    remoteFileInfo
  });

  if (webRTCError) {
    return <ErrorMessage error={webRTCError} />;
  }
  if (readerError) {
    return <ErrorMessage error={readerError} />;
  }
  return (
    <div className="client">
      <div className="client-top">
        <FileTransferView
          resetFileReaderState={resetFileReaderState}
          remoteFileInfo={remoteFileInfo}
          assembledFile={assembledFile}
          closeDataChannel={closeDataChannel}
          downloadProgress={downloadProgress}
          state={state}
          handleSendMessage={handleSendMessage}
          readProgress={uploadProgress}
          handleFileChange={handleFileChange}
          uiState={uiState}
        />
      </div>
      <div className="client-bottom">
        <WebRTCState
          datachannelState={state.datachannelState}
          signalingState={state.signalingState}
          connectionState={state.connectionState}
          iceConnectionState={state.iceConnectionState}
          iceGatheringState={state.iceGatheringState}
        />
      </div>
    </div>
  );
}
