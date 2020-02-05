import React from 'react';
import ParticipantView from './ParticipantView';
import DisplayMediaStream from './DisplayMediaStream';
import './css/style.css';

export default function ClientView({
  name,
  conferenceName,
  participantOne,
  participantTwo,
  localMediaStream,
  sendSignalingMessage,
  signalingMessage
}) {
  function joinConference() {
    sendSignalingMessage({
      message: { participant: name, type: 'joined-conference' }
    });
  }

  return (
    <div className="client-root">
      <h3>{name}</h3>
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
          <DisplayMediaStream mediaStream={localMediaStream} />
        </div>
      </div>
      <div>
        <button type="button" onClick={joinConference}>
          Join Conference
        </button>
        <button type="button" onClick={joinConference}>
          Leave Conference
        </button>
      </div>
    </div>
  );
}
