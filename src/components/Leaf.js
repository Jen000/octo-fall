// src/components/Leaf.js
import React from 'react';

const Leaf = ({ color, position }) => {
  // Map colors to image paths
  const leafImages = {
    red: process.env.PUBLIC_URL + '/assets/red-leaf.png',
    yellow: process.env.PUBLIC_URL + '/assets/yellow-leaf.png',
    green: process.env.PUBLIC_URL + '/assets/left-green-leaf.png',
  };

  return (
    <div
      className="leaf"
      style={{
      top: position.y,
      left: position.x,
      backgroundImage: `url(${leafImages[color]})`,
      }}
    />
  );
};

export default Leaf;
