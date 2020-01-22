import { useEffect, useState, useCallback } from 'react';
import iceServers from './ice-servers';
import useFileAssembler from './useFileAssembler';

export default function useWebRTC({
  signalingMessage,
  sendSignalingMessage,
  startReadingFileBySlice,
  fileChunk,
  file
}) {
  const [pc, setPc] = useState(null);
  const [error, setError] = useState(null);
  const [remoteIceCandidates, setRemoteIceCandidates] = useState([]);
  const [remoteOffer, setRemoteOffer] = useState(null);
  const [remoteFileInfo, setRemoteFileInfo] = useState(null);
  const [initiator, setInitiator] = useState(false);
  const [datachannel, setDatachannel] = useState(null);
  const [signalingState, setSignalingState] = useState(null);
  const [connectionState, setConnectionState] = useState(null);
  const [iceConnectionState, setIceConnectionState] = useState(null);
  const [iceGatheringState, setIceGatheringState] = useState(null);
  const [remoteFileChunk, setRemoteFileChunk] = useState(null);
  const [datachannelState, setDatachannelState] = useState('');
  const [cancelledSending, setCancelledSending] = useState(false);
  const { downloadProgress, assembledFile } = useFileAssembler({
    fileChunk: remoteFileChunk,
    fileInfo: remoteFileInfo
  });

  const resetState = useCallback(() => {
    if (pc) {
      pc.onicecandidate = null;
      pc.onconnectionstatechange = null;
      pc.onsignalingstatechange = null;
      pc.oniceconnectionstatechange = null;
      pc.onicegatheringstatechange = null;
      pc.ontrack = null;
      pc.ondatachannel = null;
    }
    setError(null);
    setRemoteIceCandidates([]);
    setRemoteOffer(null);
    setRemoteFileInfo(null);
    setInitiator(false);
    setDatachannel(null);
    setSignalingState(null);
    setConnectionState(null);
    setIceConnectionState(null);
    setIceGatheringState(null);
    setRemoteFileChunk(null);
    setDatachannelState(null);
    setCancelledSending(false);
    setPc(null);
  });

  function remoteIceRecieved(ice) {
    if (pc && pc.remoteDescription) {
      pc.addIceCandidate(ice);
    } else {
      setRemoteIceCandidates(prev => [...prev, ice]);
    }
  }

  function remoteAnswerRecieved(answer) {
    if (pc.setLocalDescription && pc.remoteDescription === null) {
      pc.setRemoteDescription(answer)
        .then(() => {
          if (remoteIceCandidates.length > 0) {
            for (const ice in remoteIceCandidates) {
              if (ice) {
                pc.addIceCandidate(remoteIceCandidates[ice]);
              }
            }
          }
        })
        .catch(err => {
          setError(err);
        });
    }
  }

  function createRTCPeerConnection() {
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
        resetState();
      }
    };
    peerCon.oniceconnectionstatechange = () => {
      setIceConnectionState(peerCon.iceConnectionState);
    };
    peerCon.onicegatheringstatechange = () => {
      setIceGatheringState(peerCon.iceGatheringState);
    };
    setPc(peerCon);
  }

  function sendFileChunk() {
    if (!cancelledSending) {
      try {
        datachannel.send(fileChunk);
        startReadingFileBySlice({ readNext: true });
      } catch (err) {
        setError(err);
      }
    } else {
      startReadingFileBySlice({ readNext: false });
      datachannel.close();
    }
  }
  useEffect(() => {
    if (fileChunk) {
      sendFileChunk();
    }
  }, [fileChunk]);

  useEffect(() => {
    if (pc && initiator) {
      const channel = pc.createDataChannel('chat');
      channel.onclose = () => {
        setDatachannelState('closed');

        pc.close();
      };
      channel.onopen = () => {
        startReadingFileBySlice({ readNext: true });
        setDatachannelState('open');
      };
      channel.onmessage = event => {
        if (event.data.constructor === String) {
          const msg = JSON.parse(event.data);
          switch (msg.type) {
            case 'cancelled-recieving-file':
              setCancelledSending(true);
              break;
            default:
          }
        }
      };
      channel.onerror = err => {
        setError(err);
      };
      setDatachannel(channel);
    }
  }, [pc, initiator]);

  useEffect(() => {
    if (pc && datachannel && initiator) {
      pc.createOffer()
        .then(localOffer => {
          if (!pc.localDescription) pc.setLocalDescription(localOffer);
        })
        .then(() => {
          const fileInfo = {
            size: file.size,
            name: file.name,
            type: file.type
          };
          sendSignalingMessage({
            type: 'file-offer',
            sdp: pc.localDescription,
            fileInfo
          });
        })
        .catch(err => {
          setError(err);
        });
    }
  }, [datachannel, pc, initiator]);

  useEffect(() => {
    if (pc && remoteOffer) {
      pc.ondatachannel = event => {
        const { channel } = event;
        channel.onmessage = e => {
          if (e.data instanceof ArrayBuffer) {
            setRemoteFileChunk(e.data);
          }
        };
        channel.onclose = () => {
          setDatachannelState('closed');
          setRemoteFileChunk(null);
          pc.close();
        };
        channel.onopen = () => {
          setDatachannelState('open');
        };
        channel.onerror = err => {
          setError(err);
        };
        setDatachannel(channel);
      };
      pc.setRemoteDescription(remoteOffer)
        .then(() => {
          return pc.createAnswer();
        })
        .then(localAnswer => {
          pc.setLocalDescription(localAnswer);
        })
        .then(() => {
          if (remoteIceCandidates.length > 0) {
            for (const ice in remoteIceCandidates) {
              if (ice) {
                pc.addIceCandidate(remoteIceCandidates[ice]);
              }
            }
          }
        })
        .catch(err => {
          setError(err);
        });
    }
  }, [pc, remoteOffer]);

  useEffect(() => {
    if (signalingMessage) {
      switch (signalingMessage.type) {
        case 'file-offer':
          createRTCPeerConnection(iceServers);
          setRemoteOffer(signalingMessage.sdp);
          setRemoteFileInfo(signalingMessage.fileInfo);
          break;
        case 'file-answer':
          remoteAnswerRecieved(signalingMessage.sdp);
          break;
        case 'file-decline':
          break;
        case 'ice':
          remoteIceRecieved(signalingMessage.sdp);
          break;
        default:
      }
    }
  }, [signalingMessage]);

  function createLocalOffer() {
    createRTCPeerConnection();
    setInitiator(true);
  }

  function sendLocalAnswer() {
    sendSignalingMessage({ type: 'file-answer', sdp: pc.localDescription });
  }

  function handleSendMessage(type) {
    switch (type) {
      case 'file-offer':
        createLocalOffer();
        break;
      case 'file-answer':
        sendLocalAnswer();
        break;
      case 'file-decline':
        sendSignalingMessage({ type: 'file-decline' });
        pc.close();
        break;
      case 'cancelled-recieving-file':
        datachannel.send(JSON.stringify({ type: 'cancelled-recieving-file' }));
        break;
      case 'cancelled-sending-file':
        setCancelledSending(true);
        break;
      default:
    }
  }

  function closeDataChannel() {
    datachannel.close();
  }

  return {
    handleSendMessage,
    state: {
      iceConnectionState,
      iceGatheringState,
      connectionState,
      signalingState,
      datachannelState
    },
    error,
    downloadProgress,
    assembledFile,
    closeDataChannel,
    remoteFileInfo
  };
}
