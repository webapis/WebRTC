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

  function setRemoteIce(sdp) {
    if (rtcPeerConnection && rtcPeerConnection.remoteDescription) {
      rtcPeerConnection.addIceCandidate(sdp);
      // debugger;
    } else {
      // debugger;
      setRemoteIceCandidates(prev => [...prev, signalingMessage.sdp]);
    }
  }
  useEffect(() => {
    if (
      signalingMessage &&
      signalingMessage.type === 'ice' &&
      signalingMessage.sdp
    ) {
      if (rtcPeerConnection && rtcPeerConnection.remoteDescription) {
        rtcPeerConnection.addIceCandidate(signalingMessage.sdp);
      } else {
        debugger;
        setRemoteIceCandidates(prev => [...prev, signalingMessage.sdp]);
      }
    }
  }, [signalingMessage, rtcPeerConnection]);
  function createRTCPeerConnection() {
    const peerCon = new RTCPeerConnection(iceServers);
    peerCon.onicecandidate = function(e) {
      if (e.candidate) {
        //  debugger; // 5.1 Caller
        sendSignalingMessage({ sdp: e.candidate, type: 'ice' });
      }
    };
    peerCon.onconnectionstatechange = () => {
      setConnectionState(peerCon.connectionState);
    };
    peerCon.onsignalingstatechange = () => {
      setSignalingState(peerCon.signalingState);
      if (peerCon.signalingState === 'closed') {
        // debugger;

        peerCon.onicecandidate = null;
        peerCon.onconnectionstatechange = null;
        peerCon.onsignalingstatechange = null;
        peerCon.oniceconnectionstatechange = null;
        peerCon.onicegatheringstatechange = null;
        peerCon.ontrack = null;
        setRtcPeerConnection(null);
      }
    };
    peerCon.oniceconnectionstatechange = () => {
      setIceConnectionState(peerCon.iceConnectionState);
    };
    peerCon.onicegatheringstatechange = () => {
      setIceGatheringState(peerCon.iceGatheringState);
    };
    peerCon.ontrack = e => {
      // debugger; //3.1.Callee  //7.1 Caller
      setRemoteMediaStream(e.streams[0]);
    };

    setRtcPeerConnection(peerCon);
  }
  useEffect(() => {
    if (!rtcPeerConnection) {
      //  debugger;
      resetState();
    }
  }, [rtcPeerConnection]);
  const resetState = () => {
    setRemoteMediaStream(null);
    setSignalingState(null);
    setConnectionState(null);
    setIceConnectionState(null);
    setIceGatheringState(null);
    setRemoteIceCandidates([]);
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
        case 'ice':
          setRemoteIce(signalingMessage.sdp);
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
        break;
      case 'end':
        sendSignalingMessage({ type: 'end' });
        rtcPeerConnection.close();
        break;
      case 'ignore':
        rtcPeerConnection.close();
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
