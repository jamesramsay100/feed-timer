import "./App.css";

import TimerButton from "./components/TimerButton";
import GapTimerButton from "./components/GapTimerButton";
import FeedLog from "./components/FeedLog";

import { useTimeSinceLastFeed, usePersistedState } from "./utils/hooks";

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
