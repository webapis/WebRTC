import { useState, useEffect } from 'react';

export default function useRTCPeerConnection({
  iceServers,
  sendSignalingMessage,
  signalingMessage
}) {
  const [rtcPeerConnection, setRtcPeerConnection] = useState(null);
  const [remoteMediaStream, setRemoteMediaStream] = useState(null);
  const [signalingState, setSignalingState] = useState(null);
  const [connectionState, setConnectionState] = useState(null);
  const [iceConnectionState, setIceConnectionState] = useState(null);
  const [iceGatheringState, setIceGatheringState] = useState(null);

  const [remoteIceCandidates, setRemoteIceCandidates] = useState([]);

  // useEffect(() => {
  //     if (signalingState === 'closed') {
  //       resetState();
  //     }
  //   }, [signalingState]);

  //   useEffect(() => {
  //     if (iceConnectionState === 'disconnected') {
  //       resetState();
  //     }
  //   }, [iceConnectionState]);
  //   useEffect(() => {
  //     if (connectionState === 'failed') {
  //       resetState();
  //     }
  //   }, [connectionState]);
  useEffect(() => {
    if (signalingMessage && signalingMessage.type === 'ice') {
      if (rtcPeerConnection && rtcPeerConnection.remoteDescription) {
        rtcPeerConnection.addIceCandidate(signalingMessage.sdp.sdp);
      } else {
        setRemoteIceCandidates(prev => [...prev, signalingMessage.sdp]);
      }
    }
  }, [signalingMessage, rtcPeerConnection]);
  function createRTCPeerConnection() {
    const peerCon = new RTCPeerConnection(iceServers);
    peerCon.onicecandidate = function(e) {
      if (e.candidate) {
        sendSignalingMessage({ sdp: e.candidate, type: 'ice' });
      }
    };
    peerCon.onconnectionstatechange = () => {
      setConnectionState(peerCon.connectionState);
      if (peerCon.signalingState === 'closed') {
        resetState();
      }
    };
    peerCon.onsignalingstatechange = () => {
      setSignalingState(peerCon.signalingState);
    };
    peerCon.oniceconnectionstatechange = () => {
      setIceConnectionState(peerCon.iceConnectionState);
    };
    peerCon.onicegatheringstatechange = () => {
      setIceGatheringState(peerCon.iceGatheringState);
    };
    peerCon.ontrack = e => {
      debugger;
      setRemoteMediaStream(e.streams[0]);
    };

    setRtcPeerConnection(peerCon);
  }

  const resetState = () => {
    if (rtcPeerConnection) {
      rtcPeerConnection.onicecandidate = null;
      rtcPeerConnection.onconnectionstatechange = null;
      rtcPeerConnection.onsignalingstatechange = null;
      rtcPeerConnection.oniceconnectionstatechange = null;
      rtcPeerConnection.onicegatheringstatechange = null;
      rtcPeerConnection.ontrack = null;
      setRtcPeerConnection(null);
    }
    // setError(null);
    // setRemoteOffer(null);
    // setCaller(false);
    // setRemoteIceCandidates([]);
    // setLocalMediaStream(null);
    // setCaller(false);
    // setRemoteOffer(null);
    setSignalingState(null);
    setConnectionState(null);
    setIceConnectionState(null);
    setIceGatheringState(null);
    setRemoteMediaStream(null);
  };

  useEffect(() => {
    if (signalingMessage) {
      switch (signalingMessage.type) {
        case 'end':
          rtcPeerConnection.close();
          break;
        case 'decline':
          rtcPeerConnection.close();
          break;
        case 'ignore':
          rtcPeerConnection.close();
          break;
        case 'cancel':
          rtcPeerConnection.close();

          break;
        default:
      }
    }
  }, [signalingMessage]);

  function closeConnection(type) {
    switch (type) {
      case 'decline':
        sendSignalingMessage({ type: 'decline' });
        rtcPeerConnection.close();
        //   resetState();
        break;
      case 'end':
        sendSignalingMessage({ type: 'end' });
        rtcPeerConnection.close();

        break;
      case 'ignore':
        rtcPeerConnection.close();
        //   resetState();
        break;
      case 'cancel':
        sendSignalingMessage({ type: 'cancel' });
        rtcPeerConnection.close();

        break;
      default:
    }
  }
  return {
    createRTCPeerConnection,
    rtcPeerConnection,
    remoteMediaStream,
    state: {
      signalingState,
      connectionState,
      iceGatheringState,
      iceConnectionState
    },
    remoteIceCandidates,
    closeConnection
  };
}
