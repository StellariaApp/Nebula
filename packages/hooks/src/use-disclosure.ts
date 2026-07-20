import { useCallback, useState } from "react";

export interface UseDisclosureReturn {
  opened: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useDisclosure(initialState = false): UseDisclosureReturn {
  const [opened, set_opened] = useState(initialState);

  const open = useCallback(() => {
    set_opened(true);
  }, []);
  const close = useCallback(() => {
    set_opened(false);
  }, []);
  const toggle = useCallback(() => {
    set_opened((prev) => !prev);
  }, []);

  return { opened, open, close, toggle };
}
