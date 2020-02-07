import React, { useState, useEffect } from 'react';
import ParticipantView from './ParticipantView';
import DisplayMediaStream from './DisplayMediaStream';
import AsyncBtn from './async-btn/AsyncBtn';
import './css/style.css';

export default function ClientView({
  name,
  conferenceName,
  participantOne,
  participantTwo,
  sendSignalingMessage,
  signalingMessage
}) {
  const [localMediaStream, setLocalMediaStream] = useState(null);
  const [joining, setJoining] = useState('');

  function joinConference() {
    setJoining('joining');
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(media => {
        setLocalMediaStream(media);
      });
  }
  function leaveConference() {
    sendSignalingMessage({
      message: { participant: name, type: 'leave-conference' }
    });

    setJoining('');
    setLocalMediaStream(null);
  }

  useEffect(() => {
    if (localMediaStream) {
      sendSignalingMessage({
        message: { participant: name, type: 'joined-conference' }
      });
    }
  }, [localMediaStream]);

  function onPlay() {
    setJoining('joined');
  }
  return (
    <div className="client-root">
      <div className="client">
        <div className="remote-participants">
          <ParticipantView
            sendSignalingMessage={sendSignalingMessage}
            signalingMessage={signalingMessage}
            remoteParticipant={participantOne}
            conferenceName={conferenceName}
            name={name}
          />
          <ParticipantView
            sendSignalingMessage={sendSignalingMessage}
            signalingMessage={signalingMessage}
            remoteParticipant={participantTwo}
            conferenceName={conferenceName}
            name={name}
          />
        </div>
        <div className="local-participant">
          <DisplayMediaStream
            title={name}
            mediaStream={localMediaStream}
            width="150"
            onPlay={onPlay}
          />
        </div>
      </div>
      <div className="btn-container">
        {joining !== 'joined' ? (
          <AsyncBtn
            title="Join"
            onClick={joinConference}
            inProgress={joining === 'joining'}
          />
        ) : (
          <AsyncBtn
            title="Leave"
            onClick={leaveConference}
            inProgress={false}
          />
        )}
      </div>
    </div>
  );
}
