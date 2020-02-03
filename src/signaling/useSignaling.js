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
        if (message.order !== undefined) {
          setPartialMessage(message);
        } else {
          setSignalingMessage(message);
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
          setSignalingMessage({
            message: JSON.parse(fullContent),
            name: msg.name,
            target: msg.target
          });
          setMessages(prev => [
            ...prev.filter(e => e.id === partialMessage.id)
          ]);
        } else if (msg && msg.order === 'second') {
          fullContent = partialMessage.content + msg.content;
          setSignalingMessage({
            message: JSON.parse(fullContent),
            name: msg.name,
            target: msg.target
          });

          setMessages(prev => [
            ...prev.filter(e => e.id === partialMessage.id)
          ]);
        }
      }
    }
  }, [partialMessage]);

  function sendSignalingMessage(msg) {
    if (messageSizeLimit > 0) {
      const messageSize = new Blob([JSON.stringify(msg)]);
      if (messageSize.size > messageSizeLimit) {
        const fullContent = JSON.stringify(msg);
        const id = new Date().getTime();
        const fisrtPart = {
          content: fullContent.substring(0, fullContent.length / 2),
          id,
          order: 'first',
          target,
          name
        };
        const secondPart = {
          content: fullContent.substring(fullContent.length / 2),
          id,
          order: 'second',
          target,
          name
        };

        sendMessage(fisrtPart);
        sendMessage(secondPart);
      } else {
      
        sendMessage({ ...msg, target, name });
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
