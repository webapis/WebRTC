import { useState, useEffect } from 'react';

export default function useSignaling({
  target,
  name,
  message,
  sendMessage,
  messageSizeLimit = 0
}) {
  const [error, setError] = useState(null);
  const [partialMessage, setPartialMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [signalingMessage, setSignalingMessage] = useState(null);

  useEffect(() => {
    if (message) {
      if (message.target === name) {
        if (messageSizeLimit > 0) {
          const messageSize = new Blob([JSON.stringify(message)]);
          if (messageSize.size > messageSizeLimit) {
            setPartialMessage(message);
          }
        } else {
          setSignalingMessage(message.msg);
          if (message.msg.type === 'end' || message.msg.type === 'cancel') {
            setMessages([]);
            setPartialMessage(null);
            setError(null);
          }
        }
      }
    }
  }, [message]);

  useEffect(() => {
    if (partialMessage) {
      if (messages.length === 0) {
        setMessages([partialMessage]);
      } else if (messages.length > 0) {
        const msg = messages.find(element => element.id === partialMessage.id);
        let fullContent = null;

        if (msg === undefined) {
          setMessages([partialMessage]);
        } else if (msg && msg.order === 'first') {
          fullContent = msg.content + partialMessage.content;
          setSignalingMessage({ sdp: JSON.parse(fullContent), type: msg.type });
          setMessages(prev => [
            ...prev.filter(e => e.id === partialMessage.id)
          ]);
        } else if (msg && msg.order === 'second') {
          fullContent = partialMessage.content + msg.content;
          setSignalingMessage({ sdp: JSON.parse(fullContent), type: msg.type });
          setMessages(prev => [
            ...prev.filter(e => e.id === partialMessage.id)
          ]);
        }
      }
    }
  }, [partialMessage]);

  function sendSignalingMessage(msg) {
    if (messageSizeLimit > 0) {
      const messageSize = new Blob([JSON.stringify(message)]);
      if (messageSize.size > messageSizeLimit) {
        const fullContent = JSON.stringify(msg);
        const id = new Date().getTime();
        const fisrtPart = {
          content: fullContent.substring(0, fullContent.length / 2),
          id,
          order: 'first',
          target,
          name,
          type: msg.type
        };
        const secondPart = {
          content: fullContent.substring(fullContent.length / 2),
          id,
          order: 'second',
          target,
          name,
          type: msg.type
        };
        sendMessage(fisrtPart);
        sendMessage(secondPart);
      } else {
        sendMessage({ msg, target, name });
      }
    }
  }

  function resetSignalingState() {
    setSignalingMessage(null);
    setError(null);
    setPartialMessage(null);
    setMessages([]);
  }

  return { signalingMessage, resetSignalingState, sendSignalingMessage, error };
}
