import React from "react";
import { formatStartTime } from "../utils/formatters";

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

export default FeedLog;
