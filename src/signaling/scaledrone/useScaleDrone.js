/* eslint-disable no-undef */
import { useEffect, useState } from 'react';

export default function useScaleDrone({ channel_id, room_name }) {
  const [drone, setDrone] = useState(null);
  const [signalingMessage, setSignalingMessage] = useState(null);
  const [connecting,setConnecting] =useState(false);
  useEffect(() => {
    if (drone) {
      const rm = drone.subscribe(room_name);
      rm.on('open', error => {
        if (error) {
          return console.error(error);
        }
        setConnecting(false)
        // Connected to room
      });

      rm.on('message', msg => {
        // Received a message sent to the room
        setSignalingMessage(msg);
      });
    }
  }, [drone]);

  function sendSignalingMessage(msg) {
    drone.publish({
      room: room_name,
      message: msg
    });
  }

  function connectToSignalingService() {
      setConnecting(true);
    const drn = new Scaledrone(channel_id);
    drn.on('error', error => {
      console.error('Error with connection:', error);
    });
    drn.on('close', event => {
      console.log('Connection closed:', event);
    });

    setDrone(drn);
  }

  return { signalingMessage, sendSignalingMessage, connectToSignalingService,connecting };
}
