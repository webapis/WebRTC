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
      }
    }
  }, [message]);

  useEffect(() => {
    if (fileChunk) {

      dataChannel.send(fileChunk);
      setBytesSent(preState => preState + fileChunk.byteLength);

      startReadingFileBySlice();
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
  return { uploadProgress };
}
