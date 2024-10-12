import React, { useState, useEffect, useCallback, useRef } from 'react';
import Leaf from './components/Leaf';
import Bucket from './components/Bucket';
import Home from './components/Home';
import './App.css';

const App = () => {
  const [isGameStarted, setIsGameStarted] = useState(false); // New state variable for game status
  const [leaves, setLeaves] = useState([]);
  const [score, setScore] = useState(0);
  const [bucketPosition, setBucketPosition] = useState(50); // Start in the middle (percentage)
  const bucketRef = useRef(null); // Create a ref for the bucket

  // Function to generate random leaves
  const generateLeaf = () => {
    const x = Math.random() * window.innerWidth; // Random horizontal position
    const y = 0; // Start at the top

    // Determine leaf color based on frequency
    let color;
    const randomValue = Math.random();
    if (randomValue < 0.5) {
      color = 'green'; // 50% chance
    } else if (randomValue < 0.8) {
      color = 'red'; // 30% chance
    } else {
      color = 'yellow'; // 20% chance
    }

    // Set speed based on color
    let speed;
    if (color === 'yellow') {
      speed = Math.random() * 1500 + 2000; // Speed between 1500 + 2000ms
    } else if (color === 'red') {
      speed = Math.random() * 1000 + 1500; // Speed between 1500ms and 2500ms
    } else {
      speed = Math.random() * 500 + 1000; // Speed between 500 + 1000ms
    }

    return { id: Date.now(), color, position: { x, y }, speed, caught: false };
  };

// Collision detection function
const detectCollision = useCallback((leaf) => {
  const bucketElement = bucketRef.current; // Use the ref to access the bucket
  if (!bucketElement) return false; // Return false if bucket element is not found

  const bucketRect = bucketElement.getBoundingClientRect();
  const leafRect = {
    left: leaf.position.x,
    right: leaf.position.x + 20, // Assuming leaf width is 20
    top: leaf.position.y,
    bottom: leaf.position.y + 20 // Assuming leaf height is 20
  };

  // Check for collision
  const isCollision =
    leafRect.right > bucketRect.left &&
    leafRect.left < bucketRect.right &&
    leafRect.bottom >= bucketRect.top && // Allow for leaf to touch the top of the bucket
    leafRect.top < bucketRect.bottom; // Ensure it is above the bottom of the bucket

  if (isCollision) {
    // Update score based on the leaf color
    setScore((prevScore) => prevScore + (leaf.color === 'green' ? -1 : leaf.color === 'red' ? 1 : leaf.color === 'yellow' ? 2 : 0));
    return true; // Indicate that a collision occurred
  }

  return false; // No collision
}, [bucketRef]);

  

// Function to update leaf positions
const updateLeavesPosition = useCallback(() => {
  setLeaves((prevLeaves) => {
    const updatedLeaves = prevLeaves.map((leaf) => ({
      ...leaf,
      position: {
        ...leaf.position,
        y: leaf.position.y + (leaf.speed / 500) // Adjust denominator if necessary
      }
    }));

    // Collect leaves that have reached the bottom
    const leavesToRemove = updatedLeaves.filter((leaf) => leaf.position.y > window.innerHeight);

    // Handle removal of leaves after they reach the bottom
    leavesToRemove.forEach((leaf) => {
      setTimeout(() => {
        setLeaves((currentLeaves) => currentLeaves.filter((l) => l.id !== leaf.id));
      }, 2000); // Keep the leaf for 2 seconds at the bottom
    });

    // Check for collisions with the bucket
    return updatedLeaves.filter((leaf) => {
      // Check collision with the bucket
      if (detectCollision(leaf)) {
        return false; // Remove leaf on catch
      }
      return true; // Keep leaf if not caught
    });
  });
}, [detectCollision]);





  

  // Generate leaves periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.7) { // 70% chance to generate a leaf
        setLeaves((prevLeaves) => [...prevLeaves, generateLeaf()]);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  // Update leaf positions every 16ms (approximately every frame)
  useEffect(() => {
    const interval = setInterval(updateLeavesPosition, 16);
    return () => clearInterval(interval);
  }, [updateLeavesPosition]);

// Function to set bucket position based on the mouse or touch position
const setBucketPositionFromEvent = (event) => {
  const bucketWidth = 50; // Assuming the width of the bucket is 50px
  const offsetX = event.clientX || (event.touches[0].clientX); // Get mouse or touch position
  const offsetY = event.clientY || (event.touches[0].clientY); // Get vertical position

  // Calculate new position based on cursor/touch position
  let newPosition = {
      x: offsetX - bucketWidth / 2, // Center the bucket under the cursor
      y: offsetY - bucketWidth / 2, // Center the bucket vertically
  };

  // Ensure the bucket does not go outside the bounds of the screen
  newPosition.x = Math.max(0, Math.min(window.innerWidth - bucketWidth, newPosition.x));
  newPosition.y = Math.max(0, Math.min(window.innerHeight - bucketWidth, newPosition.y));

  setBucketPosition(newPosition);
};

  // Mouse move event for desktop
  const handleMouseMove = useCallback((event) => {
    setBucketPositionFromEvent(event);
  }, []);

  // Touch move event for mobile
  const handleTouchMove = useCallback((event) => {
    setBucketPositionFromEvent(event);
    event.preventDefault(); // Prevent scrolling
  }, []);

  // Add event listeners for mouse and touch
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleMouseMove, handleTouchMove]);


    // Function to start the game
    const startGame = () => {
      setIsGameStarted(true); // Set game started to true
      setLeaves([]); // Reset leaves and score
      setScore(0);
    };


    return (
      <div className="game-container">
          {isGameStarted ? (
              <>
                  <h1>Score: {score}</h1>
                  <Bucket
                      ref={bucketRef}
                      color="brown"
                      position={bucketPosition} // Pass the new position as an object
                  />
                  {leaves.map((leaf) => (
                      <Leaf key={leaf.id} color={leaf.color} position={{ x: leaf.position.x, y: leaf.position.y }} />
                  ))}
              </>
          ) : (
              <Home onStart={startGame} />
          )}
      </div>
  );
};


export default App;
