/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useEffect } from 'react';
import './css/style.css';

export default function DisplayMediaStream({
  mediaStream,
  width,
  title,
  onPlay
}) {
  const videoRef = useRef(null);
  function onLoadedData() {
    const state = videoRef.current.readyState;
    if (state === 4 && onPlay) {
      onPlay();
    }
  }
  useEffect(() => {
    if (videoRef.current && mediaStream !== null) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream, videoRef]);

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      {mediaStream && (
        <video
          onLoadedData={onLoadedData}
          width={width}
          autoPlay
          ref={videoRef}
        />
      )}

      <div
        style={{
          position: 'absolute',
          top: 2,
          fontSize: 16,
          backgroundColor: '#e8eaf6',
          opacity: '0.5'
        }}
      >
        {title}
      </div>
    </div>
  );
}
