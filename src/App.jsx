import React, { useState, useEffect } from "react";
import "./App.css";

// A custom hook to format time in mm:ss
const useFormattedTime = (seconds) => {
  const [formattedTime, setFormattedTime] = useState("00:00");
  useEffect(() => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    const paddedMinutes = minutes.toString().padStart(2, "0");
    const paddedSeconds = secondsLeft.toString().padStart(2, "0");
    setFormattedTime(`${paddedMinutes}:${paddedSeconds}`);
  }, [seconds]);
  return formattedTime;
};

// A custom hook to get the current time in milliseconds
const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return currentTime;
};

// A component to render a button with a timer
const TimerButton = ({ side, active, startTime, totalTime, onClick }) => {
  const currentTime = useCurrentTime();
  const elapsed = active ? Math.floor((currentTime - startTime) / 1000) : 0;
  const formattedTime = useFormattedTime(totalTime + elapsed);
  return (
    <button
      className={`timer-button ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="side">{side}</div>
      <div className="time">{formattedTime}</div>
    </button>
  );
};

// The main component of the app
const App = () => {
  // The state variables for the left and right buttons
  const [leftActive, setLeftActive] = useState(false);
  const [leftStartTime, setLeftStartTime] = useState(0);
  const [leftTotalTime, setLeftTotalTime] = useState(0);

  const [rightActive, setRightActive] = useState(false);
  const [rightStartTime, setRightStartTime] = useState(0);
  const [rightTotalTime, setRightTotalTime] = useState(0);

  // The state variable for the last feed time
  const [lastFeedTime, setLastFeedTime] = useState(null);

  // The handler for the left button click
  const handleLeftClick = () => {
    const currentTime = Date.now();
    if (leftActive) {
      // Stop the left timer and update the total time
      setLeftActive(false);
      setLeftTotalTime(
        (prev) => prev + Math.floor((currentTime - leftStartTime) / 1000)
      );
    } else {
      // Start the left timer and stop the right timer if active
      setLeftActive(true);
      setLeftStartTime(currentTime);
      if (rightActive) {
        setRightActive(false);
        setRightTotalTime(
          (prev) => prev + Math.floor((currentTime - rightStartTime) / 1000)
        );
      }
      // Update the last feed time
      setLastFeedTime(currentTime);
    }
  };

  // The handler for the right button click
  const handleRightClick = () => {
    const currentTime = Date.now();
    if (rightActive) {
      // Stop the right timer and update the total time
      setRightActive(false);
      setRightTotalTime(
        (prev) => prev + Math.floor((currentTime - rightStartTime) / 1000)
      );
    } else {
      // Start the right timer and stop the left timer if active
      setRightActive(true);
      setRightStartTime(currentTime);
      if (leftActive) {
        setLeftActive(false);
        setLeftTotalTime(
          (prev) => prev + Math.floor((currentTime - leftStartTime) / 1000)
        );
      }
      // Update the last feed time
      setLastFeedTime(currentTime);
    }
  };

  // The formatted time since last feed
  const timeSinceLastFeed = useFormattedTime(
    lastFeedTime ? Math.floor((Date.now() - lastFeedTime) / 1000) : 0
  );

  return (
    <div className="app">
      <div className="timer-buttons">
        <TimerButton
          side="Left"
          active={leftActive}
          startTime={leftStartTime}
          totalTime={leftTotalTime}
          onClick={handleLeftClick}
        />
        <TimerButton
          side="Right"
          active={rightActive}
          startTime={rightStartTime}
          totalTime={rightTotalTime}
          onClick={handleRightClick}
        />
      </div>
      <div className="last-feed">
        <span>Time since last feed:</span>
        <span>{timeSinceLastFeed}</span>
      </div>
    </div>
  );
};

export default App;
