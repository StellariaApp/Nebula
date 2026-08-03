import type { ReactNode } from "react";

import { FlipScale, nebulaDark } from "@stellaria/nebula-themes";
import { palettes, type NebulaTheme } from "@stellaria/nebula-tokens";
import {
  Box,
  NebulaProvider,
  SimpleGrid,
  Text,
  type OfficialThemeName,
} from "@stellaria/nebula-web";

export const MATRIX_A11Y = {
  a11y: { rules: { "landmark-unique": { enabled: false } } },
};

export const OFFICIAL_THEMES: { name: OfficialThemeName; label: string }[] = [
  { name: "nebula-dark", label: "nebula-dark" },
  { name: "nebula-light", label: "nebula-light" },
  { name: "sober-light", label: "sober-light" },
  { name: "playful", label: "playful" },
];

const ROSETTE_PRIMARY = "#f43f5e";
const ROSETTE_BRIGHT = "#fb7185";

export const rosette = {
  ...nebulaDark,
  meta: { name: "rosette", scheme: "dark", version: "0.1.0" },
  colors: {
    ...nebulaDark.colors,
    primary: FlipScale(palettes.rose),
    accent: FlipScale(palettes.pink),
    border: { ...nebulaDark.colors.border, focus: palettes.rose["400"] },
  },
  effects: {
    ...nebulaDark.effects,
    gradients: {
      ...nebulaDark.effects.gradients,
      brand: {
        type: "linear",
        angle: 100,
        stops: [
          { color: ROSETTE_PRIMARY, position: 0 },
          { color: ROSETTE_BRIGHT, position: 100 },
        ],
      },
    },
  },
} satisfies NebulaTheme;

const STELLARIA_PRIMARY = "#0099b3";
const STELLARIA_BRIGHT = "#22b8cf";

export const stellaria = {
  ...nebulaDark,
  meta: { name: "stellaria", scheme: "dark", version: "0.1.0" },
  colors: {
    ...nebulaDark.colors,
    primary: FlipScale(palettes.blue),
    accent: FlipScale(palettes.cyan),
    border: { ...nebulaDark.colors.border, focus: palettes.blue["400"] },
  },
  effects: {
    ...nebulaDark.effects,
    gradients: {
      ...nebulaDark.effects.gradients,
      brand: {
        type: "linear",
        angle: 100,
        stops: [
          { color: STELLARIA_PRIMARY, position: 0 },
          { color: STELLARIA_BRIGHT, position: 100 },
        ],
      },
    },
  },
} satisfies NebulaTheme;

const LAGRANGE_PRIMARY = "#ed4142";
const LAGRANGE_BRIGHT = "#f08512";

export const lagrange = {
  ...nebulaDark,
  meta: { name: "lagrange", scheme: "dark", version: "0.1.0" },
  colors: {
    ...nebulaDark.colors,
    primary: FlipScale(palettes.red),
    accent: FlipScale(palettes.orange),
    border: { ...nebulaDark.colors.border, focus: palettes.red["400"] },
  },
  effects: {
    ...nebulaDark.effects,
    gradients: {
      ...nebulaDark.effects.gradients,
      brand: {
        type: "linear",
        angle: 100,
        stops: [
          { color: LAGRANGE_PRIMARY, position: 0 },
          { color: LAGRANGE_BRIGHT, position: 100 },
        ],
      },
    },
  },
} satisfies NebulaTheme;

export function ThemePanel(props: {
  theme: OfficialThemeName | NebulaTheme;
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
      {OFFICIAL_THEMES.map((t) => (
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
