import { useEffect, useState } from 'react';

export default function useRTCPeerConnection({
  iceServers,
  signalingMessage,
  sendSignalingMessage
}) {
  const [rtcPeerConnection, setRTCPeerConnection] = useState(null);
  const [dataChannel, setDatachannel] = useState(null);
  const [remoteIceCandidates, setRemoteIceCandidates] = useState([]);
  const [signalingState, setSignalingState] = useState(null);
  const [connectionState, setConnectionState] = useState(null);
  const [iceGatheringState, setIceGatheringState] = useState(null);
  const [iceConnectionState, setIceConnectionState] = useState(null);
  const [datachannelError, setDatachannelError] = useState(null);
  const [message, setMessage] = useState(null);
  function createRTCPeerConnection(initiator) {
    let peerCon = new RTCPeerConnection(iceServers);
    peerCon.onicecandidate = function(e) {
      if (e.candidate) {
        sendSignalingMessage({ sdp: e.candidate, type: 'ice' });
      }
    };
    peerCon.onconnectionstatechange = () => {
      setConnectionState(peerCon.connectionState);
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

    if (initiator) {
      let channel = peerCon.createDataChannel('chat');

      channel.onmessage = event => {
        setMessage(JSON.parse(event.data));
      };

      channel.onerror = err => {
        setDatachannelError(err);
      };
      setDatachannel(channel);
    } else {
      peerCon.ondatachannel = event => {
        let channel = event.channel;

        channel.onmessage = event => {
          setMessage(JSON.parse(event.data));
        };

        channel.onerror = err => {
          setDatachannelError(err);
        };
        setDatachannel(channel);
      };
    }
    setRTCPeerConnection(peerCon);
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
        setRemoteIceCandidates(prev => [...prev, signalingMessage.sdp]);
      }
    }
  }, [signalingMessage, rtcPeerConnection]);

  return {
    remoteIceCandidates,
    createRTCPeerConnection,
    rtcPeerConnection,
    state: {
      signalingState,
      connectionState,
      iceConnectionState,
      iceGatheringState
    },
    datachannelError,
    dataChannel,
    message
  };
}
