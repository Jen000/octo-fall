import React, { forwardRef } from 'react';

const Bucket = forwardRef(({ color, position }, ref) => {
  // Map colors to image paths
  const bucketImages = {
    brown: '/assets/brown-bucket.png',
  };

  return (
    <div
      ref={ref} // Assign ref here
      style={{
        position: 'absolute',
        bottom: '10px',
        left: `${position}%`,
        width: '50px',
        height: '50px',
        backgroundImage: `url(${bucketImages[color]})`, // Set the background image
        backgroundSize: 'contain', // Ensures the image fits within the div
        backgroundRepeat: 'no-repeat', // Prevents repeating the image
      }}
    />
  );
});

export default Bucket;
