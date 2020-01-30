/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';
import FileSelectorView from '../../file-reader/ui-components/file-selector-view';
import CircularPercentageBar from './CircularPercentageBar';
import './css/style.css';

export default function FileTransferView({
  handleSendMessage,
  uiState,
  handleFileChange,
  downloadProgress,
  closeDataChannel,
  assembledFile,
  remoteFileInfo,
  readProgress
}) {
  const {
    fileSelected,
    remoteOfferRecieved,
    sendingFile,
    recievingFile,
    sendingComplete,
    recievingComplete,
    haveLocalOffer
  } = uiState;
  const [haveLocalAnswer, setHaveLocalAnswer] = useState(false);
  const fileLinkRef = useRef(null);

  useEffect(() => {
    if (uiState.signalingState === 'have-local-answer') {
      setHaveLocalAnswer(true);
    } else {
      setHaveLocalAnswer(false);
    }
  }, [uiState]);

  useEffect(() => {
    if (assembledFile && remoteFileInfo && fileLinkRef.current) {
      fileLinkRef.current.href = URL.createObjectURL(assembledFile);
      fileLinkRef.current.download = remoteFileInfo.name;
    }
  }, [assembledFile, remoteFileInfo, fileLinkRef]);

  function sendOffer() {
    handleSendMessage('file-offer');
  }

  function sendAnswer() {
    setHaveLocalAnswer(true);
    handleSendMessage('file-answer');
  }

  function sendDecline() {
    handleSendMessage('file-decline');
  }

  function sendCancelSending() {
    handleSendMessage('cancelled-sending-file');
  }

  function sendCancelRecieving() {
    setHaveLocalAnswer(false);
    handleSendMessage('cancelled-recieving-file');
  }
  function downloadFile() {
    setHaveLocalAnswer(false);
    handleSendMessage('file-downloaded');
  }
  if (recievingFile) {
    return (
      <div className="file-transfer">
        <div>
          <CircularPercentageBar percent={downloadProgress} />
        </div>
        <div className="btn-container">
          <button type="button" onClick={sendCancelRecieving}>
            Cancel Recieving
          </button>
        </div>
      </div>
    );
  }

  if (sendingFile) {
    return (
      <div className="file-transfer">
        <CircularPercentageBar percent={readProgress} />

        <div className="btn-container">
          <button type="button" onClick={sendCancelSending}>
            Cancel Sending
          </button>
        </div>
      </div>
    );
  }

  if (recievingComplete) {
    return (
      <div className="file-transfer">
        <div>Recieving Complete</div>
        <div>
          <a href="/" ref={fileLinkRef} onClick={downloadFile}>
            Download file
          </a>
        </div>
      </div>
    );
  }

  if (sendingComplete) {
    return (
      <div className="file-transfer">
        <div>Sending Complete</div>
        <div>
          <button type="button" onClick={closeDataChannel}>
            Ok
          </button>
        </div>
      </div>
    );
  }
  if (remoteOfferRecieved) {
    return (
      <div className="file-transfer">
        <div className="btn-container">
          <button type="button" disabled={haveLocalAnswer} onClick={sendAnswer}>
            Accept
          </button>
          <button
            type="button"
            disabled={haveLocalAnswer}
            onClick={sendDecline}
          >
            Decline
          </button>
        </div>
      </div>
    );
  }

  if (!fileSelected) {
    return <FileSelectorView handleFileChange={handleFileChange} />;
  }

  return (
    <div className="file-transfer">
      <div className="btn-container">
        <button type="button" disabled={haveLocalOffer} onClick={sendOffer}>
          {haveLocalOffer ? 'Connecting....':' Send File' }
        </button>
        <button hidden={haveLocalOffer} type="button" disabled={haveLocalOffer} onClick={sendOffer}>
          Cancel
        </button>
      </div>
    </div>
  );
}
