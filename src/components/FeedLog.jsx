import React from "react";
import { formatStartTime } from "../utils/formatters";
import { roundUpToMinutes } from "../utils/formatters"; // Import the new utility

const FeedLog = ({ feedLog }) => (
  <div className="feed-log">
    <h2>Recent Feeds</h2>
    <ul>
      {feedLog.map((feed, index) => (
        <li key={index}>
          <strong>{formatStartTime(feed.startTime)}, </strong>
          <strong>L:</strong> {roundUpToMinutes(feed.leftDuration)} mins,
          <strong>R:</strong> {roundUpToMinutes(feed.rightDuration)} mins,
          <strong>Total:</strong> {roundUpToMinutes(feed.totalDuration)} mins
        </li>
      ))}
    </ul>
  </div>
);

export default FeedLog;
