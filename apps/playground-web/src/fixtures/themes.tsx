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
  { name: "dark", label: "dark" },
  { name: "light", label: "light" },
  { name: "sober-light", label: "sober-light" },
  { name: "playful", label: "playful" },
];

export type ProductName = "rosette" | "stellaria" | "lagrange";

interface ProductSeed {
  primary: Scale11;
  accent: Scale11;
  from: string;
  to: string;
  tint: string;
  wash: number;
  lift: number;
}

const PRODUCT_SEEDS: Record<ProductName, ProductSeed> = {
  rosette: {
    primary: palettes.rose,
    accent: palettes.pink,
    from: palettes.rose["500"],
    to: palettes.pink["400"],
    tint: palettes.rose["900"],
    wash: 0.009,
    lift: -12,
  },
  stellaria: {
    primary: palettes.blue,
    accent: palettes.cyan,
    from: palettes.blue["500"],
    to: palettes.cyan["400"],
    tint: palettes.blue["800"],
    wash: 0.05,
    lift: -6,
  },
  lagrange: {
    primary: palettes.orange,
    accent: palettes.pink,
    from: palettes.pink["400"],
    to: palettes.orange["300"],
    tint: palettes.orange["200"],
    wash: 0.009,
    lift: 6,
  },
};

const FOCUS_STEP = { dark: "400", light: "600" } as const;
const CHANNEL_MAX = 255;

function Channels(hex: string): [number, number, number] {
  const raw = hex.replace("#", "");
  return [
    Number.parseInt(raw.slice(0, 2), 16),
    Number.parseInt(raw.slice(2, 4), 16),
    Number.parseInt(raw.slice(4, 6), 16),
  ];
}

function Shade(hex: string, seed: ProductSeed, sign: number): string {
  const base = Channels(hex);
  const tint = Channels(seed.tint);
  const mixed = base.map((value, i) => {
    const blended = value * (1 - seed.wash) + (tint[i] as number) * seed.wash;
    return Math.max(0, Math.min(CHANNEL_MAX, Math.round(blended + seed.lift * sign)));
  });
  return `#${mixed.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

function Canvas<T extends Record<string, string>>(surface: T, seed: ProductSeed, sign: number): T {
  return Object.fromEntries(
    Object.entries(surface).map(([role, hex]) => [role, Shade(hex, seed, sign)]),
  ) as T;
}

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
      surface: Canvas(base.colors.surface, seed, dark ? 1 : -1),
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
  const official = officialThemes[(global ?? "dark") as OfficialThemeName] as
    NebulaTheme | undefined;
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
