import { useCallback, useState } from "react";

export interface UseDisclosureReturn {
  opened: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Estado booleano abierto/cerrado con acciones estables (modales, drawers,
 * disclosure). Migrado de Stellaria — platform-agnostic (solo React).
 */
export function useDisclosure(initialState = false): UseDisclosureReturn {
  const [opened, setOpened] = useState(initialState);

  const open = useCallback(() => {
    setOpened(true);
  }, []);
  const close = useCallback(() => {
    setOpened(false);
  }, []);
  const toggle = useCallback(() => {
    setOpened((prev) => !prev);
  }, []);

  return { opened, open, close, toggle };
}
