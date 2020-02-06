import React, { useEffect, useState } from 'react';
import './css/style.css';

const ProgressCircle = ({ selected }) => (
  <div
    style={{
      height: 2,
      width: 3,
      padding: 2,
      borderRadius: 25,
      margin: 3,
      textAlign: 'center',
      backgroundColor: selected ? '#5c6bc0' : '#e8eaf6'
    }}
  />
);

export default function ProgressLoader({ inProgress }) {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (inProgress) {
        if (selected === 0) {
          setSelected(1);
        } else if (selected === 1) {
          setSelected(2);
        } else if (selected === 2) {
          setSelected(0);
        }
      }
    }, 150);
    return () => {
      clearInterval(interval);
    };
  }, [selected, inProgress]);

  return (
    <div className="call-animation">
      <ProgressCircle selected={selected === 2} />
      <ProgressCircle selected={selected === 1} />
      <ProgressCircle selected={selected === 0} />
    </div>
  );
}
