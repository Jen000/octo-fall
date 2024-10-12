// src/components/Leaf.js
import React from 'react';

const Leaf = ({ color, position }) => {
  // Map colors to image paths
  const leafImages = {
    red: '/assets/red-leaf.png',
    yellow: '/assets/yellow-leaf.png',
    green: '/assets/left-green-leaf.png',
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        width: '40px', // Adjust the width as needed
        height: '40px', // Adjust the height as needed
        backgroundImage: `url(${leafImages[color]})`, // Set the background image
        backgroundSize: 'contain', // Ensures the image fits within the div
        backgroundRepeat: 'no-repeat', // Prevents repeating the image
      }}
    />
  );
};

export default Leaf;
