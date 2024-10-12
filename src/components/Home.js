import React, { useState } from 'react';
import '../styles/Home.css';

const Home = ({ onStart }) => {
  const [countdown, setCountdown] = useState(3);

  const handleStart = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          onStart(); // Start the game when countdown ends
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="home-container">
      {countdown > 0 ? (
        <h1 className="countdown">{countdown}</h1>
      ) : (
        <h1 className="welcome">Welcome to the Leaf Catcher Game!</h1>
      )}
      <button className="start-button" onClick={handleStart}>
        {countdown > 0 ? "Start" : "Start Game"}
      </button>
    </div>
  );
};

export default Home;
