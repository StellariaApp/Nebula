import { useEffect, useState } from "react";

/**
 * Patrón controlado/no-controlado: si `value` está definido, el valor lo manda
 * el padre; si es `undefined`, se gestiona estado local con `defaultValue`.
 * `onChange` se llama siempre. Migrado de Stellaria — platform-agnostic.
 */
export function useUncontrolled<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): readonly [T, (next: T) => void] {
  const [local, setLocal] = useState(value ?? defaultValue);

  useEffect(() => {
    if (value !== undefined) setLocal(value);
  }, [value]);

  const handleChange = (next: T): void => {
    if (value === undefined) setLocal(next);
    onChange?.(next);
  };

  return [local, handleChange] as const;
}
