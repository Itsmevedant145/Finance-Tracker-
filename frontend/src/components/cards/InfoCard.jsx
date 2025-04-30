// InfoCard.js (or .jsx/.tsx)
import React from 'react';
import './InfoCard.css'; // Assuming you're using a CSS file

export const InfoCard = ({ icon, label, value, themeClass = '' }) => {
  return (
    <div className={`info-card ${themeClass}`}>
      <div className="icon-wrapper">{icon}</div>
      <div className="info-content">
        <span className="info-label">{label}</span>
        <span className="info-value">{value}</span>
      </div>
    </div>
  );
};
