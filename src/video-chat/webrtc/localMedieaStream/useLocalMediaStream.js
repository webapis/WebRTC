/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import getlocalUserMedia from './getMediaStream';

export default function useLocalMediaStream({ mediaConstraints, state }) {
  const [localMediaStream, setLocalMediaStream] = useState(null);

  const [localMediaStreamError, setLocalMediaStreamError] = useState(null);
  function resetState() {
    setLocalMediaStream(null);
  }

  useEffect(() => {
    return () => {
      if (state.signalingState === 'closed') {
      
        resetState();
      }
    };
  });
  function getLocalMediaStream() {
    getlocalUserMedia(mediaConstraints, (error, media) => {
      if (error) {
   
        setLocalMediaStreamError(error);
      } else {
    
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
