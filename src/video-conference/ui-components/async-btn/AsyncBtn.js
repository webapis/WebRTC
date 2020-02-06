import React from 'react';
import Progress from './Progress';
import './css/style.css'
export default function AsyncBtn({ inProgress, title, onClick }) {
  if (inProgress)
    return (
      <button type="button" className="async-btn">
        <Progress inProgress={inProgress} />
      </button>
    );
  return (
    <button type="button" className="async-btn" onClick={onClick}>
      {title}
    </button>
  );
}
