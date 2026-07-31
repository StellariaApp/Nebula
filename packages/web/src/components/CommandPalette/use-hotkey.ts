import { useEffect } from "react";

interface Combo {
  mod: boolean;
  shift: boolean;
  alt: boolean;
  key: string;
}

export function ParseHotkey(raw: string): Combo {
  const parts = raw.toLowerCase().split("+");
  return {
    mod: parts.includes("mod") || parts.includes("ctrl") || parts.includes("cmd"),
    shift: parts.includes("shift"),
    alt: parts.includes("alt"),
    key: parts.at(-1) ?? "",
  };
}

export function Matches(event: KeyboardEvent, combo: Combo): boolean {
  if (event.key.toLowerCase() !== combo.key) return false;
  if (combo.mod !== (event.metaKey || event.ctrlKey)) return false;
  if (combo.shift !== event.shiftKey) return false;
  return combo.alt === event.altKey;
}

export function useHotkey(hotkey: string | false, onTrigger: () => void): void {
  useEffect(() => {
    if (hotkey === false) return;
    const combo = ParseHotkey(hotkey);

    const Handle = (event: KeyboardEvent): void => {
      if (!Matches(event, combo)) return;
      event.preventDefault();
      onTrigger();
    };

    document.addEventListener("keydown", Handle);
    return () => {
      document.removeEventListener("keydown", Handle);
    };
  }, [hotkey, onTrigger]);
}
