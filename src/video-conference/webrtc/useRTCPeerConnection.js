import { useState, useEffect } from 'react';

export default function useRTCPeerConnection({
  iceServers,
  sendSignalingMessage,
  signalingMessage,
  remoteParticipant
}) {
  const [rtcPeerConnection, setRtcPeerConnection] = useState(null);
  const [remoteMediaStream, setRemoteMediaStream] = useState(null);
  const [signalingState, setSignalingState] = useState(null);
  const [connectionState, setConnectionState] = useState(null);
  const [iceConnectionState, setIceConnectionState] = useState(null);
  const [iceGatheringState, setIceGatheringState] = useState(null);
  const [remoteIceCandidates, setRemoteIceCandidates] = useState([]);

  function resetState() {
    setRemoteMediaStream(null);
    setSignalingState(null);
    setConnectionState(null);
    setIceConnectionState(null);
    setIceGatheringState(null);
    setRemoteIceCandidates([]);
  }

  function setRemoteIce(sdp) {
    if (rtcPeerConnection && rtcPeerConnection.remoteDescription) {
      rtcPeerConnection.addIceCandidate(sdp);
    } else {
      setRemoteIceCandidates(prev => [...prev, sdp]);
    }
  }

  function createRTCPeerConnection(init) {
    const peerCon = new RTCPeerConnection(iceServers);
    peerCon.initiator = init;
    peerCon.onicecandidate = e => {
      if (e.candidate) {
        sendSignalingMessage({
          message: {
            sdp: e.candidate,
            type: 'ice',
            initiator: peerCon.init,
            target: remoteParticipant
          }
        });
      }
    };
    peerCon.onconnectionstatechange = () => {
      setConnectionState(peerCon.connectionState);
    };
    peerCon.onsignalingstatechange = () => {
      setSignalingState(peerCon.signalingState);
      if (peerCon.signalingState === 'closed') {
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
      setRemoteMediaStream(e.streams[0]);
    };

    setRtcPeerConnection(peerCon);
  }
  useEffect(() => {
    if (!rtcPeerConnection) {
      resetState();
    }
  }, [rtcPeerConnection]);

  useEffect(() => {
    if (signalingMessage && rtcPeerConnection) {
      switch (signalingMessage.message.type) {
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
          setRemoteIce(signalingMessage.message.sdp);
          break;
        default:
      }
    }
  }, [signalingMessage, rtcPeerConnection]);

  function closeConnection(type) {
    switch (type) {
      case 'decline':
        sendSignalingMessage({
          message: { type: 'decline', target: remoteParticipant }
        });
        rtcPeerConnection.close();
        break;
      case 'end':
        sendSignalingMessage({
          message: { type: 'end', target: remoteParticipant }
        });
        rtcPeerConnection.close();
        break;
      case 'ignore':
        rtcPeerConnection.close();
        break;
      case 'cancel':
        sendSignalingMessage({
          message: { type: 'cancel', target: remoteParticipant }
        });
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
