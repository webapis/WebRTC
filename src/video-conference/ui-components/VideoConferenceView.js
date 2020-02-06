import React from 'react';
import ClientView from './ClientView';
import './css/style.css';

export default function VideoConferenceView({
  sendSignalingMessage,
  signalingMessage
}) {
  return (
    <div className="video-conference">
      <ClientView
        name="mario"
        sendSignalingMessage={sendSignalingMessage}
        signalingMessage={signalingMessage}
        participantOne="dragos"
        participantTwo="vinos"
      />
      <ClientView
        name="dragos"
        sendSignalingMessage={sendSignalingMessage}
        signalingMessage={signalingMessage}
        participantOne="mario"
        participantTwo="vinos"
      />
      <ClientView
        name="vinos"
        sendSignalingMessage={sendSignalingMessage}
        signalingMessage={signalingMessage}
        participantOne="dragos"
        participantTwo="mario"
      />
    </div>
  );
}
