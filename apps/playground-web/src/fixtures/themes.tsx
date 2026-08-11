import type { ReactNode } from "react";

import {
  BuildProduct,
  PRODUCTS,
  type ProductName,
} from "@stellaria/nebula-demos/themes/products";
import { officialThemes } from "@stellaria/nebula-themes";
import type { NebulaTheme } from "@stellaria/nebula-tokens";
import {
  Box,
  NebulaProvider,
  SimpleGrid,
  Text,
  type OfficialThemeName,
} from "@stellaria/nebula-web";

export { BuildProduct, PRODUCTS };
export type { ProductName };

export const MATRIX_A11Y = {
  a11y: { rules: { "landmark-unique": { enabled: false } } },
};

export const OFFICIAL_THEMES: { name: OfficialThemeName; label: string }[] = [
  { name: "dark", label: "dark" },
  { name: "light", label: "light" },
];

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
