import { useEffect, useState } from "react";

export function useUncontrolled<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): readonly [T, (next: T) => void] {
  const [local, set_local] = useState(value ?? defaultValue);

  useEffect(() => {
    if (value !== undefined) set_local(value);
  }, [value]);

  const HandleChange = (next: T): void => {
    if (value === undefined) set_local(next);
    onChange?.(next);
  };

  return [local, HandleChange] as const;
}
