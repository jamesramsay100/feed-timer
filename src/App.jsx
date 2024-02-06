import React, { useState, useEffect } from "react";
import "./App.css";

const useFormattedTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = secondsLeft.toString().padStart(2, "0");
  return `${paddedMinutes}:${paddedSeconds}`;
};

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

const useTimeSinceLastFeed = (lastFeedTime) => {
  const currentTime = useCurrentTime();
  const [timeSinceLastFeed, setTimeSinceLastFeed] = useState(0);

  useEffect(() => {
    if (lastFeedTime) {
      const interval = setInterval(() => {
        const elapsedTime = Math.floor((currentTime - lastFeedTime) / 1000);
        setTimeSinceLastFeed(elapsedTime);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentTime, lastFeedTime]);

  return timeSinceLastFeed;
};

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

const GapTimerButton = ({ active, startTime, totalTime }) => {
  const currentTime = useCurrentTime();
  const elapsed = active ? Math.floor((currentTime - startTime) / 1000) : 0;
  const formattedTime = useFormattedTime(totalTime + elapsed);
  return (
    <button className={`timer-button ${active ? "active" : ""}`}>
      <div className="side">Gap :</div>
      <div className="time">{formattedTime}</div>
    </button>
  );
};

const App = () => {
  const [leftActive, setLeftActive] = useState(false);
  const [leftStartTime, setLeftStartTime] = useState(0);
  const [leftTotalTime, setLeftTotalTime] = useState(0);

  const [rightActive, setRightActive] = useState(false);
  const [rightStartTime, setRightStartTime] = useState(0);
  const [rightTotalTime, setRightTotalTime] = useState(0);

  const [gapActive, setGapActive] = useState(false);
  const [gapStartTime, setGapStartTime] = useState(0);
  const [gapTotalTime, setGapTotalTime] = useState(0);

  const [lastFeedTime, setLastFeedTime] = useState(null);
  const timeSinceLastFeed = useTimeSinceLastFeed(lastFeedTime);

  const handleLeftClick = () => {
    const currentTime = Date.now();
    if (leftActive) {
      // stopping LH
      setLeftActive(false);
      setLeftTotalTime(
        (prev) => prev + Math.floor((currentTime - leftStartTime) / 1000),
      );
      setGapActive(true);
      setGapStartTime(currentTime);
    } else {
      setGapActive(false);
      setGapTotalTime(0);
      setLeftActive(true);
      setLeftStartTime(currentTime);
      if (rightActive) {
        setRightActive(false);
        setRightTotalTime(
          (prev) => prev + Math.floor((currentTime - rightStartTime) / 1000),
        );
      }
      setLastFeedTime(currentTime);
    }
  };

  const handleRightClick = () => {
    const currentTime = Date.now();
    if (rightActive) {
      setRightActive(false);
      setRightTotalTime(
        (prev) => prev + Math.floor((currentTime - rightStartTime) / 1000),
      );
      setGapActive(true);
      setGapStartTime(currentTime);
    } else {
      setGapActive(false);
      setGapTotalTime(0);
      setRightActive(true);
      setRightStartTime(currentTime);
      if (leftActive) {
        setLeftActive(false);
        setLeftTotalTime(
          (prev) => prev + Math.floor((currentTime - leftStartTime) / 1000),
        );
      }
      setLastFeedTime(currentTime);
    }
  };

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
      <GapTimerButton
        active={gapActive}
        startTime={gapStartTime}
        totalTime={gapTotalTime}
      />
    </div>
  );
};

export default App;
