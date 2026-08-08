"use client";

import { useTheme } from "@stellaria/nebula-hooks";
import { Button, type OfficialThemeName } from "@stellaria/nebula-web";

const NEXT: Record<OfficialThemeName, OfficialThemeName> = { dark: "light", light: "dark" };

export function SchemeSwitch({ label }: { label: string }) {
  const { themeName, setTheme } = useTheme();
  const target = NEXT[themeName as OfficialThemeName] ?? "dark";

  return (
    <Button
      size="sm"
      variant="ghost"
      aria-label={label}
      onPress={() => {
        setTheme(target);
      }}
    >
      {themeName === "dark" ? "☾" : "☀"}
    </Button>
  );
}
