"use client";

import { useTheme } from "@stellaria/nebula-hooks";
import { ActionIcon, Affix, type OfficialThemeName } from "@stellaria/nebula-web";

const NEXT: Record<OfficialThemeName, OfficialThemeName> = { dark: "light", light: "dark" };

const SUN = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MOON = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
  </svg>
);

export function ThemeFab({ labels }: { labels: Record<OfficialThemeName, string> }) {
  const { themeName, setTheme } = useTheme();
  const current = themeName === "light" ? "light" : "dark";
  const target = NEXT[current];

  return (
    <Affix position={{ bottom: 24, right: 24 }}>
      <ActionIcon
        size="lg"
        r="full"
        variant="glass"
        glass="strong"
        aria-label={labels[target]}
        onPress={() => {
          setTheme(target);
        }}
      >
        {current === "dark" ? SUN : MOON}
      </ActionIcon>
    </Affix>
  );
}
