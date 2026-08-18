import type { ReactNode } from "react";

import { ThemeScheme, type SeedName } from "@stellaria/nebula-themes";
import type { ColorScheme, NebulaTheme } from "@stellaria/nebula-tokens";
import {
  Box,
  NebulaProvider,
  SimpleGrid,
  Text,
} from "@stellaria/nebula-web";

export const MATRIX_A11Y = {
  a11y: { rules: { "landmark-unique": { enabled: false } } },
};

export const DEFAULT_THEMES: { name: ColorScheme; label: string }[] = [
  { name: "dark", label: "dark" },
  { name: "light", label: "light" },
];

export const roseta = ThemeScheme("roseta", "dark");
export const zenit = ThemeScheme("zenit", "dark");
export const apolo = ThemeScheme("apolo", "dark");

export function ProductStage(props: {
  name: SeedName;
  global: string | undefined;
  children: ReactNode;
}): ReactNode {
  const { name, global, children } = props;
  const scheme: ColorScheme = global === "light" ? "light" : "dark";
  const theme = ThemeScheme(name, scheme);

  return (
    <NebulaProvider key={`${theme.meta.name}-${scheme}`} defaultTheme={theme} storage={null}>
      <Box bg="surface.base" c="text.primary">
        {children}
      </Box>
    </NebulaProvider>
  );
}

export function ThemePanel(props: {
  theme: ColorScheme | NebulaTheme;
  label: string;
  children: ReactNode;
}): ReactNode {
  const { theme, label, children } = props;
  return (
    <NebulaProvider defaultTheme={theme} storage={null}>
      <Box r="md" overflow="hidden" bg="surface.base" c="text.primary">
        <Text
          component="p"
          fz="caption"
          fw="semibold"
          ff="mono"
          tt="uppercase"
          ls="wide"
          c="text.muted"
          px="md"
          py="sm"
          bg="surface.sunken"
        >
          {label}
        </Text>
        <Box p="md">{children}</Box>
      </Box>
    </NebulaProvider>
  );
}

export function ThemeMatrix(props: {
  children: ReactNode;
  extra?: { theme: NebulaTheme; label: string }[] | undefined;
}): ReactNode {
  const { children, extra = [] } = props;
  return (
    <SimpleGrid cols={{ base: 1, tablet: 2, desktop: 4 }} spacing="md">
      {DEFAULT_THEMES.map((t) => (
        <ThemePanel key={t.name} theme={t.name} label={t.label}>
          {children}
        </ThemePanel>
      ))}
      {extra.map((t) => (
        <ThemePanel key={t.label} theme={t.theme} label={t.label}>
          {children}
        </ThemePanel>
      ))}
    </SimpleGrid>
  );
}
