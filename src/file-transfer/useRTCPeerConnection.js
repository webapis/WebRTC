import { useState, useEffect } from 'react';

export default function useRTCPeerConnection({
  iceServers,
  sendSignalingMessage,
  signalingMessage,
  startReadingFileBySlice
}) {
  const [rtcPeerConnection, setRTCPeerConnection] = useState(null);
  const [connectionState, setConnectionState] = useState(null);
  const [signalingState, setSignalingState] = useState(null);
  const [iceConnectionState, setIceConnectionState] = useState(null);
  const [iceGatheringState, setIceGatheringState] = useState(null);
  const [datachannelState, setDatachannelState] = useState(null);
  const [dataChannelError, setDataChannelError] = useState(null);
  const [dataChannel, setDataChannel] = useState(null);
  const [remoteIceCandidates, setRemoteIceCandidates] = useState([]);

  const [message, setMessage] = useState(null);

  //   const resetState = () => {
  //     if (pc) {
  //       pc.onicecandidate = null;
  //       pc.onconnectionstatechange = null;
  //       pc.onsignalingstatechange = null;
  //       pc.oniceconnectionstatechange = null;
  //       pc.onicegatheringstatechange = null;
  //       pc.ontrack = null;
  //       pc.ondatachannel = null;
  //     }
  //     setError(null);
  //     setRemoteIceCandidates([]);
  //     setRemoteOffer(null);
  //     setRemoteFileInfo(null);
  //     setInitiator(false);
  //     setDatachannel(null);
  //     setSignalingState(null);
  //     setConnectionState(null);
  //     setIceConnectionState(null);
  //     setIceGatheringState(null);
  //     setRemoteFileChunk(null);
  //     setDatachannelState(null);
  //     setCancelledSending(false);
  //     setPc(null);
  //   }

  function createRTCPeerConnection(initiator) {
    const peerCon = new RTCPeerConnection(iceServers);
    peerCon.onicecandidate = e => {
      if (e.candidate) {
        sendSignalingMessage({ sdp: e.candidate, type: 'ice' });
      }
    };
    peerCon.onconnectionstatechange = () => {
      setConnectionState(peerCon.connectionState);
    };
    peerCon.onsignalingstatechange = () => {
      setSignalingState(peerCon.signalingState);
      if (peerCon.signalingState === 'closed') {
        //  resetState();
      }
    };
    peerCon.oniceconnectionstatechange = () => {
      setIceConnectionState(peerCon.iceConnectionState);
    };
    peerCon.onicegatheringstatechange = () => {
      setIceGatheringState(peerCon.iceGatheringState);
    };
    if (initiator) {
      const channel = peerCon.createDataChannel('chat');
      channel.onclose = () => {
        setDatachannelState('closed');

        peerCon.close();
      };
      channel.onopen = () => {
        setDatachannelState('open');
        // startReadingFileBySlice({ readNext: true });
        setDatachannelState('open');
      };
      channel.onmessage = event => {
        setMessage(event.data);
      };
      channel.onerror = err => {
        setDatachannelState('closed');
        setDataChannelError(err);
      };
      channel.onclose = () => {
        setDatachannelState('closed');
        setMessage(null);
        //  peerCon.close();
      };

      setDataChannel(channel);
    } else {
      peerCon.ondatachannel = event => {
        const { channel } = event;
        channel.onmessage = e => {
          setMessage(e.data);
        };
        channel.onclose = () => {
          setDatachannelState('closed');
          setMessage(null);
          peerCon.close();
        };
        channel.onopen = () => {
          setDatachannelState('open');
        };
        channel.onerror = err => {
          setDataChannelError(err);
        };
        setDataChannel(channel);
      };
    }

    setRTCPeerConnection(peerCon);
  }

  useEffect(() => {
    if (signalingMessage && signalingMessage.type === 'ice') {
      if (rtcPeerConnection && rtcPeerConnection.remoteDescription) {
        rtcPeerConnection.addIceCandidate(signalingMessage.sdp);
      } else {
        setRemoteIceCandidates(prev => [...prev, signalingMessage.sdp]);
      }
    }
  }, [signalingMessage, rtcPeerConnection]);

  return {
    rtcPeerConnection,
    createRTCPeerConnection,
    dataChannel,
    dataChannelError,
    remoteIceCandidates,
    message,
    state: {
      connectionState,
      iceConnectionState,
      iceGatheringState,
      signalingState,
      datachannelState
    }
  };
}
