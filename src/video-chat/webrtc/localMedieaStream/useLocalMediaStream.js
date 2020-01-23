/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import getlocalUserMedia from './getMediaStream';
export default function useLocalMediaStream(mediaConstraints) {
  const [localMediaStream, setLocalMediaStream] = useState(null);

  const [localMediaStreamError, setLocalMediaStreamError] = useState(null);

  function getLocalMediaStream() {
    getlocalUserMedia(mediaConstraints, (error, media) => {
      if (error) {
        debugger;
        setLocalMediaStreamError(error);
      } else {
        debugger; // 1.1. Caller
        setLocalMediaStream(media);
      }
    });
  }
  function removeLocalMediaStream() {
    setLocalMediaStream(null);
  }

  return {
    localMediaStream,
    getLocalMediaStream,
    removeLocalMediaStream,
    localMediaStreamError
  };
}
