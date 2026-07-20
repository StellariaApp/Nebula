import { useCallback, useEffect, useRef, useState } from "react";

export function useDebounce<T>(value: T, delay = 500): T {
  const [debounced_value, set_debounced_value] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      set_debounced_value(value);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debounced_value;
}

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay = 500,
): (...args: Args) => void {
  const timer_ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callback_ref = useRef(callback);

  useEffect(() => {
    callback_ref.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timer_ref.current) clearTimeout(timer_ref.current);
    };
  }, []);

  return useCallback(
    (...args: Args) => {
      if (timer_ref.current) clearTimeout(timer_ref.current);
      timer_ref.current = setTimeout(() => {
        callback_ref.current(...args);
      }, delay);
    },
    [delay],
  );
}
