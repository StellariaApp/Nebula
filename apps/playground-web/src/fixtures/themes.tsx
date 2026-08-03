import type { ReactNode } from "react";

import { FlipScale, nebulaDark, nebulaLight, officialThemes } from "@stellaria/nebula-themes";
import { palettes, type NebulaTheme, type Scale11 } from "@stellaria/nebula-tokens";
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

export type ProductName = "rosette" | "stellaria" | "lagrange";

interface ProductSeed {
  primary: Scale11;
  accent: Scale11;
  from: string;
  to: string;
}

const PRODUCT_SEEDS: Record<ProductName, ProductSeed> = {
  rosette: { primary: palettes.rose, accent: palettes.pink, from: "#f43f5e", to: "#fb7185" },
  stellaria: { primary: palettes.blue, accent: palettes.cyan, from: "#0099b3", to: "#22b8cf" },
  lagrange: { primary: palettes.red, accent: palettes.orange, from: "#ed4142", to: "#f08512" },
};

const FOCUS_STEP = { dark: "400", light: "600" } as const;

export function BuildProduct(name: ProductName, scheme: "dark" | "light"): NebulaTheme {
  const seed = PRODUCT_SEEDS[name];
  const base = scheme === "dark" ? nebulaDark : nebulaLight;
  const dark = scheme === "dark";

  return {
    ...base,
    meta: { name: dark ? name : `${name}-light`, scheme, version: "0.1.0" },
    colors: {
      ...base.colors,
      primary: dark ? FlipScale(seed.primary) : seed.primary,
      accent: dark ? FlipScale(seed.accent) : seed.accent,
      border: { ...base.colors.border, focus: seed.primary[FOCUS_STEP[scheme]] },
    },
    effects: {
      ...base.effects,
      gradients: {
        ...base.effects.gradients,
        brand: {
          type: "linear",
          angle: 100,
          stops: [
            { color: seed.from, position: 0 },
            { color: seed.to, position: 100 },
          ],
        },
      },
    },
  };
}

export const PRODUCTS: Record<ProductName, Record<"dark" | "light", NebulaTheme>> = {
  rosette: { dark: BuildProduct("rosette", "dark"), light: BuildProduct("rosette", "light") },
  stellaria: { dark: BuildProduct("stellaria", "dark"), light: BuildProduct("stellaria", "light") },
  lagrange: { dark: BuildProduct("lagrange", "dark"), light: BuildProduct("lagrange", "light") },
};

export const rosette = PRODUCTS.rosette.dark;
export const stellaria = PRODUCTS.stellaria.dark;
export const lagrange = PRODUCTS.lagrange.dark;

export function ProductStage(props: {
  name: ProductName;
  global: string | undefined;
  children: ReactNode;
}): ReactNode {
  const { name, global, children } = props;
  const official = officialThemes[(global ?? "nebula-dark") as OfficialThemeName] as
    | NebulaTheme
    | undefined;
  const theme = PRODUCTS[name][official?.meta.scheme === "light" ? "light" : "dark"];

  return (
    <NebulaProvider key={theme.meta.name} defaultTheme={theme} storage={null}>
      <Box bg="surface.base" c="text.primary">
        {children}
      </Box>
    </NebulaProvider>
  );
}

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
