/* eslint-disable camelcase */
/* eslint-disable no-undef */
import { useEffect, useState } from 'react';

export default function useScaleDrone({ channel_id, room_name }) {
  const [drone, setDrone] = useState(null);
  const [signalingError, setSignalingError] = useState(null);
  const [message, setMessage] = useState(null);
  const [connectionState, setConnectionState] = useState('');

  useEffect(() => {
    if (drone) {
      const rm = drone.subscribe(room_name);
      rm.on('open', err => {
        if (err) {
          debugger;
          setSignalingError(err);
        }

        setConnectionState('connected');
        // Connected to room
      });

      rm.on('message', msg => {
        debugger;
        // Received a message sent to the room
        setMessage(msg.data);
      });
    }
  }, [drone]);

  function sendMessage(msg) {
    drone.publish({
      room: room_name,
      message: msg
    });
  }

  function connectToService() {
    debugger;
    setConnectionState('connecting');
    const drn = new Scaledrone(channel_id);
    drn.on('error', err => {
      debugger;
      setSignalingError(err);
    });
    drn.on('close', () => {
      debugger;
      setConnectionState('');
    });

    setDrone(drn);
  }

  return {
    signalingError,
    connectionState,
    messageSizeLimit: 4000,
    sendMessage,
    message,
    connectToService
  };
}
