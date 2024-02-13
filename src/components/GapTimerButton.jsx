import React from "react";
import { useCurrentTime } from "../utils/hooks";
import { formatTime } from "../utils/formatters";

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

export default GapTimerButton;
