import { useEffect, useState } from 'react';

export default function useSender({
  rtcPeerConnection,
  createRTCPeerConnection
}) {
  function initiateOffer() {
    debugger; // 1. Offerer
    createRTCPeerConnection();
  }

  useEffect(() => {
      
  }, [rtcPeerConnection]);
  return { initiateOffer };
}
