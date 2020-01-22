import { useState, useEffect } from 'react';

export default function PusherSignaling({ currentUser, roomId, target, name }) {
  const [signalingMessage, setSignalingMessage] = useState(null);
  const [error, setError] = useState(null);
  const [partialMessage, setPartialMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (currentUser) {
      currentUser.subscribeToRoomMultipart({
        roomId,
        hooks: {
          onMessage: m => {
            const msg = JSON.parse(m.parts[0].payload.content);

            if (msg.target === name) {
              if (msg.type === 'offer' || msg.type === 'answer') {
                setPartialMessage(msg);
              } else {
                setSignalingMessage(msg.msg);
                if (msg.msg.type === 'end' || msg.msg.type === 'cancel') {
                  setMessages([]);
                  setPartialMessage(null);
                  setError(null);
                }
              }
            }
          }
        },
        messageLimit: 0
      });
    }
  }, [currentUser, name, roomId]);

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
    if (
      msg !== null &&
      msg !== undefined &&
      (msg.type === 'offer' || msg.type === 'answer')
    ) {
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

      currentUser
        .sendSimpleMessage({
          text: JSON.stringify(fisrtPart),
          roomId: currentUser.rooms[0].id
        })
        .then(() =>
          currentUser.sendSimpleMessage({
            text: JSON.stringify(secondPart),
            roomId: currentUser.rooms[0].id
          })
        )
        .catch(e => {
          setError(e);
        });
    } else {
      currentUser
        .sendSimpleMessage({
          text: JSON.stringify({ msg, target, name }),
          roomId: currentUser.rooms[0].id
        })
        .then(() => {
          if (msg.type === 'end') {
            setMessages([]);
            setPartialMessage(null);
            setError(null);
          }
        })
        .catch(e => {
          setError(e);
        });
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
