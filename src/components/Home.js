import React, { useState } from 'react';
import '../styles/Home.css';

const Home = ({ onStart }) => {
  const [countdown, setCountdown] = useState(null);

  const handleStart = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          onStart();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (countdown > 0) {
    return (
      <div className="home-container">
        <h1 className="countdown">{countdown}</h1>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="title-block">
        <span className="title-leaf">🍂</span>
        <h1 className="game-title">Leaf Catcher</h1>
        <span className="title-leaf">🍁</span>
      </div>

      <div className="rules-card">
        <h2 className="rules-heading">How to Play</h2>
        <p className="rules-sub">Move your cursor (or finger) to catch falling leaves with the bucket.</p>

        <div className="leaf-rules">
          <div className="leaf-rule">
            <span className="leaf-icon green-leaf">🍃</span>
            <div className="leaf-info">
              <span className="leaf-label">Green Leaf</span>
              <span className="leaf-points penalty">−1 point</span>
            </div>
            <span className="leaf-tip">Avoid!</span>
          </div>

          <div className="leaf-rule">
            <span className="leaf-icon red-leaf">🍁</span>
            <div className="leaf-info">
              <span className="leaf-label">Red Leaf</span>
              <span className="leaf-points">+1 point</span>
            </div>
            <span className="leaf-tip">Catch it!</span>
          </div>

          <div className="leaf-rule">
            <span className="leaf-icon yellow-leaf">🍂</span>
            <div className="leaf-info">
              <span className="leaf-label">Yellow Leaf</span>
              <span className="leaf-points bonus">+2 points</span>
            </div>
            <span className="leaf-tip">Rare & slow!</span>
          </div>
        </div>
      </div>

      <button className="start-button" onClick={handleStart}>
        Play Now
      </button>
    </div>
  );
};

export default Home;