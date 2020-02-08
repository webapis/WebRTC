import { useState, useEffect } from 'react';
import useScaleDrone from './useScaleDrone';
export default function ConnectToScaleDrone() {
  const {} = useScaleDrone({ channel_id: 'kgrfnwzdUtSa0se7', room_name: 'signaling_room' });
}
