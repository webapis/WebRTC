import { useState, useEffect } from 'react';
import { isString } from '../common/type-checking';

export default function useSender({
  message,
  dataChannel,
  startReadingFileBySlice,
  fileChunk,
  state,
  file
}) {
  const { datachannelState } = state;

  const [uploadProgress, setUploadProgress] = useState(0);
  const [bytesSent, setBytesSent] = useState(0);
  const [cancelled, setCancelled] = useState(false);
  useEffect(() => {
    if (state && state.signalingState === 'closed') {
      setUploadProgress(0);
      setBytesSent(0);
      setCancelled(false);
    }
  }, [state]);
  useEffect(() => {
    if (file && datachannelState === 'open') {
      dataChannel.send(
        JSON.stringify({ name: file.name, size: file.size, type: 'file-info' })
      );
    }
  }, [datachannelState, file]);

  useEffect(() => {
    if (message && isString(message)) {
      const msg = JSON.parse(message);
      if (msg.type === 'file-accepted') {
        startReadingFileBySlice();
      } else if (msg.type === 'file-downloaded') {
        dataChannel.close();
      } else if (msg.type === 'cancelled-recieving-file') {
        setCancelled(true);
      }
    }
  }, [message]);
  useEffect(() => {
    if (cancelled) {
      dataChannel.send(JSON.stringify({ type: 'cancelled-sending-file' }));
    }
  }, [cancelled]);
  useEffect(() => {
    if (fileChunk) {
      dataChannel.send(fileChunk);
      setBytesSent(preState => preState + fileChunk.byteLength);
      if (!cancelled) {
        startReadingFileBySlice();
      }
    }
  }, [fileChunk]);

  useEffect(() => {
    if (bytesSent) {
      const progress = (
        ((bytesSent + fileChunk.byteLength) / file.size) *
        100
      ).toFixed();
      // eslint-disable-next-line radix
      setUploadProgress(Number.parseInt(progress));
    }
  }, [bytesSent]);

  function cancelledSending() {
    setCancelled(true);
  }

  return { uploadProgress, cancelledSending };
}
