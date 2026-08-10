// src/hooks/useCountdown.ts
import { useEffect, useRef, useState } from "react";

export const useCountdown = () => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const start = (seconds: number) => setSecondsLeft(seconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [secondsLeft]);

  return { secondsLeft, isRunning: secondsLeft > 0, start };
};
