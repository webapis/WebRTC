import { useState, useEffect } from 'react';

export default function useUIState({
  state,
  file,
  readProgress,
  downloadProgress,
  readComplete,
  remoteFileInfo
}) {
  const { signalingState } = state;
  const [sendingFile, setSendingFile] = useState(false);
  const [recievingFile, setRecievingFile] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [remoteOfferRecieved, setRemoteOfferRecived] = useState(false);
  const [sendingComplete, setSendingComplete] = useState(false);
  const [recievingComplete, setRecievingComplete] = useState(false);
  const [haveLocalOffer, setHaveLocalOffer] = useState(false);

  useEffect(() => {
    if (file) {
      setFileSelected(true);
    } else {
      setFileSelected(false);
    }
  }, [file]);

  useEffect(()=>{
    if (remoteFileInfo) {

      setRemoteOfferRecived(true);
    }
  },[remoteFileInfo])
  useEffect(() => {
  
    if (signalingState === 'have-local-offer') {
      setHaveLocalOffer(true);
    }
    if (signalingState === 'closed') {
      setSendingFile(false);
      setRecievingFile(false);
      setFileSelected(false);
      setRemoteOfferRecived(false);
      setSendingComplete(false);
      setRecievingComplete(false);
      setHaveLocalOffer(false);
    }
  }, [signalingState]);

  useEffect(() => {
    if (readProgress > 0 && !readComplete) {
      setSendingFile(true);
    }
    if (readProgress === 100 && readComplete) {
      setSendingComplete(true);
      setSendingFile(false);
    }
  }, [readProgress, readComplete]);

  useEffect(() => {
    if (downloadProgress > 0) {
      setRecievingFile(true);
    }

    if (downloadProgress === 100) {
      setRecievingFile(false);
      setRecievingComplete(true);
    }
  }, [downloadProgress]);

  return {
    uiState: {
      sendingFile,
      recievingFile,
      fileSelected,
      remoteOfferRecieved,
      sendingComplete,
      recievingComplete,
      haveLocalOffer
    }
  };
}
