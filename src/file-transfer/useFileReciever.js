import { useState, useEffect } from 'react';
import { isString } from '../common/type-checking';

export default function useReciever({ message, dataChannel }) {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [assembledFile, setAssembledFile] = useState(null);
  const [bytesRecieved, setBytesRecieved] = useState(0);
  const [incomingFileData, setIncomingFileData] = useState([]);
  const [remoteFileInfo, setRemoteFileInfo] = useState(null);
  const [recievedFileChunk, setRecievedFileChunk] = useState(null);
  useEffect(() => {
    if (message && isString(message)) {
      const msg = JSON.parse(message);
      if (msg.type === 'file-info') {
        setRemoteFileInfo(msg);
      }
    } else if (message && message instanceof ArrayBuffer) {
      setRecievedFileChunk(message);
    }
  }, [message]);

  useEffect(() => {
    if (recievedFileChunk) {
      setIncomingFileData(prevState => [...prevState, recievedFileChunk]);
    } 
    
  }, [recievedFileChunk]);
  useEffect(() => {
    if (incomingFileData.length > 0) {
      setBytesRecieved(prevState => prevState + recievedFileChunk.byteLength);
    }
  }, [incomingFileData]);
  useEffect(() => {
    if (bytesRecieved > 0) {
      const progress = (
        ((bytesRecieved + recievedFileChunk.byteLength) / remoteFileInfo.size) *
        100
      ).toFixed();
      setDownloadProgress(Number.parseInt(progress, 10));
    }
  }, [bytesRecieved]);

  useEffect(() => {
    if (remoteFileInfo && bytesRecieved === remoteFileInfo.size) {
    
      const assembled = new Blob(incomingFileData, { type: remoteFileInfo.type });

      setAssembledFile(assembled);
    }
  }, [bytesRecieved]);

  function acceptFile() {
    dataChannel.send(JSON.stringify({ type: 'file-accepted' }));
  }

  return { downloadProgress, remoteFileInfo, acceptFile, assembledFile };
}
