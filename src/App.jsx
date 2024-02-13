import React, { useState, useEffect } from "react";
import "./App.css";

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = seconds % 60;

  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = secondsLeft.toString().padStart(2, "0");

  return hours > 0
    ? `${paddedHours}:${paddedMinutes}:${paddedSeconds}`
    : `${paddedMinutes}:${paddedSeconds}`;
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

const usePersistedState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    const persistedValue = localStorage.getItem(key);
    return persistedValue !== null ? JSON.parse(persistedValue) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
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
  const formattedTime = formatTime(totalTime + elapsed);
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
  const formattedTime = formatTime(totalTime + elapsed);
  return (
    <button className={`timer-button ${active ? "active" : ""}`}>
      <div className="side">Gap :</div>
      <div className="time">{formattedTime}</div>
    </button>
  );
};

const FeedLog = ({ feedLog }) => (
  <div className="feed-log">
    <h2>Recent Feeds</h2>
    <ul>
      {feedLog.map((feed, index) => (
        <li key={index}>
          <strong>{formatStartTime(feed.startTime)}, </strong>
          <strong>L:</strong> {feed.leftDuration} mins, <strong>R:</strong>{" "}
          {feed.rightDuration} mins, <strong>Total:</strong>{" "}
          {feed.totalDuration} mins
        </li>
      ))}
    </ul>
  </div>
);

const formatStartTime = (startTime) => {
  const date = new Date(startTime);
  const day = date.toLocaleDateString(undefined, { weekday: "short" });
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day} ${time}`;
};

const App = () => {
  const [leftActive, setLeftActive] = usePersistedState("leftActive", false);
  const [leftStartTime, setLeftStartTime] = usePersistedState(
    "leftStartTime",
    0,
  );
  const [leftTotalTime, setLeftTotalTime] = usePersistedState(
    "leftTotalTime",
    0,
  );

  const [rightActive, setRightActive] = usePersistedState("rightActive", false);
  const [rightStartTime, setRightStartTime] = usePersistedState(
    "rightStartTime",
    0,
  );
  const [rightTotalTime, setRightTotalTime] = usePersistedState(
    "rightTotalTime",
    0,
  );

  const [gapActive, setGapActive] = usePersistedState("gapActive", false);
  const [gapStartTime, setGapStartTime] = usePersistedState("gapStartTime", 0);
  const [gapTotalTime, setGapTotalTime] = usePersistedState("gapTotalTime", 0);

  const [lastFeedTime, setLastFeedTime] = usePersistedState(
    "lastFeedTime",
    null,
  );
  const [feedLog, setFeedLog] = usePersistedState("feedLog", []);

  const timeSinceLastFeed = useTimeSinceLastFeed(lastFeedTime);

  const handleLeftClick = () => {
    const currentTime = Date.now();
    if (leftActive) {
      // stopping LH
      setLeftActive(false);
      const leftDuration = Math.floor((currentTime - leftStartTime) / 1000);
      const rightDuration = Math.floor((leftStartTime - rightStartTime) / 1000);
      setLeftTotalTime((prev) => prev + leftDuration);
      setGapActive(true);
      setGapStartTime(currentTime);
      setFeedLog((prevLog) => [
        ...prevLog,
        {
          startTime: leftStartTime,
          leftDuration,
          rightDuration,
          totalDuration: leftDuration + rightDuration,
        },
      ]);
    } else {
      // starting LH
      setGapActive(false);
      setGapTotalTime(0);
      setLeftTotalTime(0);
      setRightTotalTime(0);
      setLeftActive(true);
      setLeftStartTime(currentTime); // Reset startTime when starting the timer
      if (rightActive) {
        // stopping RH and starting LH
        setRightActive(false);
        const rightDuration = Math.floor((currentTime - rightStartTime) / 1000);
        setRightTotalTime((prev) => prev + rightDuration);
      } else {
        setRightStartTime(currentTime);
      }
      setLastFeedTime(currentTime);
    }
  };

  const handleRightClick = () => {
    const currentTime = Date.now();
    if (rightActive) {
      // stopping RH
      setRightActive(false);
      const rightDuration = Math.floor((currentTime - rightStartTime) / 1000);
      const leftDuration = Math.floor((rightStartTime - leftStartTime) / 1000);
      setRightTotalTime((prev) => prev + rightDuration);
      setGapActive(true);
      setGapStartTime(currentTime);
      setFeedLog((prevLog) => [
        ...prevLog,
        {
          startTime: rightStartTime,
          leftDuration,
          rightDuration,
          totalDuration: rightDuration + leftDuration,
        },
      ]);
    } else {
      // starting RH
      setGapActive(false);
      setGapTotalTime(0);
      setRightTotalTime(0);
      setLeftTotalTime(0);
      setRightActive(true);
      setRightStartTime(currentTime); // Reset startTime when starting the timer
      if (leftActive) {
        // stopping LH and starting RH
        setLeftActive(false);
        const leftDuration = Math.floor((currentTime - leftStartTime) / 1000);
        setLeftTotalTime((prev) => prev + leftDuration);
      } else {
        setLeftStartTime(currentTime);
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
      <div className="timer-buttons">
        <GapTimerButton
          active={gapActive}
          startTime={gapStartTime}
          totalTime={gapTotalTime}
        />
      </div>
      <FeedLog feedLog={feedLog.slice(0).reverse().slice(0, 9)} />
    </div>
  );
};

export default App;
