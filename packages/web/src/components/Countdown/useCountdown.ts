import { useEffect, useRef, useState } from "react";

import type { CountdownParts } from "./Countdown.types.js";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function SplitRemaining(total: number): CountdownParts {
  const safe = Math.max(0, total);
  return {
    days: Math.floor(safe / DAY),
    hours: Math.floor((safe % DAY) / HOUR),
    minutes: Math.floor((safe % HOUR) / MINUTE),
    seconds: Math.floor((safe % MINUTE) / SECOND),
    total: safe,
  };
}

export function useCountdown(to: string, onComplete: (() => void) | undefined): CountdownParts {
  const target = Date.parse(to);
  const [now, set_now] = useState(() => Date.now());
  const fired = useRef(false);

  useEffect(() => {
    fired.current = false;
    set_now(Date.now());
  }, [to]);

  useEffect(() => {
    if (Number.isNaN(target)) return;
    const timer = window.setInterval(() => {
      set_now(Date.now());
    }, SECOND);
    return () => {
      window.clearInterval(timer);
    };
  }, [target]);

  const total = Number.isNaN(target) ? 0 : target - now;

  useEffect(() => {
    if (fired.current || total > 0) return;
    fired.current = true;
    onComplete?.();
  }, [total, onComplete]);

  return SplitRemaining(total);
}
