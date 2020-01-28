import { useState, useEffect } from 'react';

export default function useSender({
  message,
  dataChannel,
  startReadingFileBySlice,
  fileChunk,
  state
}) {
  const { datachannelState } = state;

  const [uploadProgress, setUploadProgress] = useState(0);

  return { uploadProgress };
}
