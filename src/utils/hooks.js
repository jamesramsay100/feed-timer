import { useState, useEffect } from "react";

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

export { useCurrentTime, usePersistedState, useTimeSinceLastFeed };
