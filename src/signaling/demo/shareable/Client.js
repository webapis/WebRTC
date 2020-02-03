import React, { useState, useEffect } from 'react';
import useSignaling from '../../useSignaling';

export default function Client({
  target,
  name,
  message,
  sendMessage,
  messageSizeLimit
}) {
  const { signalingMessage, sendSignalingMessage } = useSignaling({
    target,
    name,
    message,
    sendMessage,
    messageSizeLimit
  });
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (messages.length > 0) {
      debugger;
    }
  }, [messages]);

  useEffect(() => {
    if (signalingMessage) {
      debugger;
      if (messages.length === 0) {
        setMessages([signalingMessage]);
      }
      if (messages.length > 0) {
        setMessages(prev => [...prev, signalingMessage]);
      }
    }
  }, [signalingMessage]);

  function handleChange(e) {
    const { value } = e.target;
    setText(value);
  }

  function handleSendMessage() {
    sendSignalingMessage({ message: text });
  }

  return (
    <div className="client">
      <div>{name}</div>
      <div className="messages">
        {messages.length > 0 &&
          messages.map(m => {
            return (
              <div>
                <div>{m && m.name && m.name}</div>
                <div>{m && m.message}</div>
              </div>
            );
          })}
      </div>
      <input type="text" onChange={handleChange} value={text} name="message" />
      <button type="button" onClick={handleSendMessage}>
        Send Message
      </button>
    </div>
  );
}
