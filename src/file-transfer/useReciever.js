import { useState, useEffect } from 'react';

function isString (value) {
    return typeof value === 'string' || value instanceof String;
    }

export default function useReciever({ message }) {
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    debugger;
    if (message && isString(message)) {
      debugger;
      const msg = JSON.parse(message);
      if (msg.type === 'file-info') {
        debugger;
      }
    }
  }, [message]);

  return { downloadProgress };
}
