import { useState } from "react";

export function useUncontrolled<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): readonly [T, (next: T) => void] {
  const [local, set_local] = useState(value ?? defaultValue);

  const HandleChange = (next: T): void => {
    if (value === undefined) set_local(next);
    onChange?.(next);
  };

  return [value === undefined ? local : value, HandleChange] as const;
}
