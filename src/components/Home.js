import React, { useState } from 'react';
import '../styles/Home.css';

const Home = ({ onStart }) => {
  const [phase, setPhase] = useState('welcome'); // 'welcome' | 'countdown'
  const [countdown, setCountdown] = useState(3);

  const handleStart = () => {
    setPhase('countdown');
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

  // Countdown screen
  if (phase === 'countdown') {
    return (
      <div className="home-container">
        <p className="get-ready">Get ready!</p>
        <h1 className="countdown" key={countdown}>{countdown}</h1>
      </div>
    );
  }

  // Welcome + rules screen
  return (
    <div className="home-container">
      <div className="title-block">
        <span className="title-leaf">🍂</span>
        <h1 className="game-title">Leaf Catcher</h1>
        <span className="title-leaf">🍁</span>
      </div>

      <p className="welcome-sub">Catch the falling leaves — but choose wisely!</p>

      <div className="rules-card">
        <h2 className="rules-heading">How to Play</h2>
        <p className="rules-sub">Move your cursor (or finger) to catch falling leaves with the bucket.</p>

        <div className="leaf-rules">
          <div className="leaf-rule">
            <span className="leaf-icon">🍃</span>
            <div className="leaf-info">
              <span className="leaf-label">Green Leaf</span>
              <span className="leaf-points penalty">−1 point</span>
            </div>
            <span className="leaf-tip">Avoid!</span>
          </div>

          <div className="leaf-rule">
            <span className="leaf-icon">🍁</span>
            <div className="leaf-info">
              <span className="leaf-label">Red Leaf</span>
              <span className="leaf-points">+1 point</span>
            </div>
            <span className="leaf-tip">Catch it!</span>
          </div>

          <div className="leaf-rule">
            <span className="leaf-icon">🍂</span>
            <div className="leaf-info">
              <span className="leaf-label">Yellow Leaf</span>
              <span className="leaf-points bonus">+2 points</span>
            </div>
            <span className="leaf-tip">Rare &amp; slow!</span>
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