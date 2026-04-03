import React, { useState, useEffect, useCallback, useRef } from 'react';
import Leaf from './components/Leaf';
import Bucket from './components/Bucket';
import Home from './components/Home';
import './App.css';

const BUCKET_SIZE = 50;

const App = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [score, setScore] = useState(0);
  // FIX: Initialize as an object {x, y}, not a number (50).
  // Previously, bucketPosition started as 50 (a number), then got set to {x, y}
  // on first mouse move — causing a crash/flash on game start.
  const [bucketPosition, setBucketPosition] = useState({
    x: window.innerWidth / 2 - BUCKET_SIZE / 2,
    y: window.innerHeight - BUCKET_SIZE - 30,
  });
  const bucketRef = useRef(null);

  const generateLeaf = () => {
    const x = Math.random() * (window.innerWidth - 50);
    const y = 0;
    const size = 5; // vw

    let color;
    const randomValue = Math.random();
    if (randomValue < 0.5) {
      color = 'green';
    } else if (randomValue < 0.8) {
      color = 'red';
    } else {
      color = 'yellow';
    }

    // FIX: speed is now pixels-per-frame (called every 16ms), not milliseconds.
    // Previously speed was e.g. 2000–3500 and divided by 500, giving 4–7px/frame
    // for yellow — way too fast and inconsistent. Now speed is a clean px/frame value.
    let speed;
    if (color === 'yellow') {
      speed = 1.5 + Math.random() * 1; // 1.5–2.5 px/frame (slowest, worth 2pts)
    } else if (color === 'red') {
      speed = 2.5 + Math.random() * 1.5; // 2.5–4 px/frame
    } else {
      speed = 3.5 + Math.random() * 2; // 3.5–5.5 px/frame (fastest, penalizes)
    }

    return { id: Date.now() + Math.random(), color, position: { x, y }, size, speed, caught: false };
  };

  const detectCollision = useCallback((leaf) => {
    const bucketElement = bucketRef.current;
    if (!bucketElement) return false;

    const bucketRect = bucketElement.getBoundingClientRect();
    const leafSizePx = leaf.size * window.innerWidth / 100;

    const leafRect = {
      left: leaf.position.x,
      right: leaf.position.x + leafSizePx,
      top: leaf.position.y,
      bottom: leaf.position.y + leafSizePx,
    };

    const isCollision =
      leafRect.right > bucketRect.left &&
      leafRect.left < bucketRect.right &&
      leafRect.bottom >= bucketRect.top &&
      leafRect.top < bucketRect.bottom;

    if (isCollision) {
      setScore((prevScore) =>
        prevScore + (leaf.color === 'green' ? -1 : leaf.color === 'red' ? 1 : 2)
      );
      return true;
    }
    return false;
  }, []);

  const updateLeavesPosition = useCallback(() => {
    setLeaves((prevLeaves) => {
      return prevLeaves
        .map((leaf) => ({
          ...leaf,
          position: {
            ...leaf.position,
            // FIX: speed is now a direct px/frame value — simple and predictable
            y: leaf.position.y + leaf.speed,
          },
        }))
        .filter((leaf) => {
          if (detectCollision(leaf)) return false; // caught
          if (leaf.position.y > window.innerHeight) return false; // off screen
          return true;
        });
    });
  }, [detectCollision]);

  // Generate leaves periodically
  useEffect(() => {
    if (!isGameStarted) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.7) {
        setLeaves((prevLeaves) => [...prevLeaves, generateLeaf()]);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameStarted]);

  // Update leaf positions every ~16ms
  useEffect(() => {
    if (!isGameStarted) return;
    const interval = setInterval(updateLeavesPosition, 16);
    return () => clearInterval(interval);
  }, [updateLeavesPosition, isGameStarted]);

  const setBucketPositionFromEvent = useCallback((event) => {
    const offsetX = event.clientX ?? event.touches?.[0]?.clientX;
    const offsetY = event.clientY ?? event.touches?.[0]?.clientY;
    if (offsetX == null) return;

    const newX = Math.max(0, Math.min(window.innerWidth - BUCKET_SIZE, offsetX - BUCKET_SIZE / 2));
    const newY = Math.max(0, Math.min(window.innerHeight - BUCKET_SIZE, offsetY - BUCKET_SIZE / 2));

    setBucketPosition({ x: newX, y: newY });
  }, []);

  const handleMouseMove = useCallback((event) => {
    setBucketPositionFromEvent(event);
  }, [setBucketPositionFromEvent]);

  const handleTouchMove = useCallback((event) => {
    setBucketPositionFromEvent(event);
    event.preventDefault();
  }, [setBucketPositionFromEvent]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleMouseMove, handleTouchMove]);

  const startGame = () => {
    setIsGameStarted(true);
    setLeaves([]);
    setScore(0);
  };

  return (
    <div className="game-container">
      {isGameStarted ? (
        <>
          <h1>Score: {score}</h1>
          <Bucket ref={bucketRef} color="brown" position={bucketPosition} />
          {leaves.map((leaf) => (
            <Leaf key={leaf.id} color={leaf.color} position={leaf.position} />
          ))}
        </>
      ) : (
        <Home onStart={startGame} />
      )}
    </div>
  );
};

export default App;