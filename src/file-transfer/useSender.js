import { useState, useEffect } from 'react';

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

  useEffect(() => {
    if (file && datachannelState === 'open') {
      debugger;
      dataChannel.send(JSON.stringify({ name: file.name, size: file.size,type:'file-info' }));
    }
  }, [datachannelState, file]);

  return { uploadProgress };
}
