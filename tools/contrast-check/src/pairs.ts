import type { NebulaTheme, SemanticScaleName, Variant } from "@stellaria/nebula-tokens";

import {
  Composite,
  GradientInk,
  OnColor,
  ResolveBackground,
  ResolveRef,
  SEMANTIC_SCALES,
  ShiftRef,
} from "./resolve.ts";

export interface ContrastPair {
  label: string;
  fg: (theme: NebulaTheme) => string;
  bg: (theme: NebulaTheme) => string;
  min: number;
  /** El par no aplica a este tema concreto: no se evalúa ni cuenta como PASS. */
  skip?: (theme: NebulaTheme) => boolean;
}

const SURFACES = ["base", "raised", "overlay", "sunken", "hover", "active", "hoverActive"] as const;
const GLASS_LEVELS = ["band", "control", "subtle", "default", "strong"] as const;
const FIELD_SURFACES = ["sunken", "base", "raised", "overlay"] as const;
const STATUSES = ["success", "warning", "error", "info"] as const;

const VARIANTS: readonly Variant[] = [
  "filled",
  "outline",
  "light",
  "glass",
  "ghost",
  "glow",
  "gradient",
  "unstyled",
];

const ON_FILL = "text.onPrimary";

function FillHex(
  theme: NebulaTheme,
  background: string,
  scale: SemanticScaleName,
): string | undefined {
  const [group, key, alpha] = background.split(".");
  if (group !== "scale" || key === undefined || alpha !== undefined) return undefined;
  return ResolveRef(theme, `scale.${key}`, scale, theme.colors.surface.base) ?? undefined;
}

function VariantForeground(theme: NebulaTheme, variant: Variant, scale: string): string {
  const recipe = theme.variantMap[variant];
  if (recipe.foreground === ON_FILL) {
    const gradient = GradientInk(theme, recipe.background);
    if (gradient !== undefined) return gradient;
    const fill = FillHex(theme, recipe.background, scale as SemanticScaleName);
    if (fill !== undefined) return OnColor(fill, theme.ink.floor);
  }
  return (
    ResolveRef(theme, recipe.foreground, scale as never, theme.colors.surface.base) ??
    theme.colors.text.primary
  );
}

function BuildVariantPairs(): ContrastPair[] {
  const pairs: ContrastPair[] = [];

  for (const variant of VARIANTS) {
    if (variant === "unstyled") continue;

    for (const scale of SEMANTIC_SCALES) {
      pairs.push({
        label: `variantMap.${variant} · ${scale} (texto)`,
        fg: (t) => VariantForeground(t, variant, scale),
        bg: (t) =>
          ResolveBackground(
            t,
            variant,
            t.variantMap[variant],
            scale,
            VariantForeground(t, variant, scale),
          )?.bg ?? t.colors.surface.base,
        min: 4.5,
      });

      pairs.push({
        label: `variantMap.${variant} · ${scale} (texto:hover)`,
        skip: (t) => !t.variantMap[variant].background.startsWith("scale."),
        fg: (t) => VariantForeground(t, variant, scale),
        bg: (t) => {
          const recipe = t.variantMap[variant];
          const fill = FillHex(t, recipe.background, scale);
          const darker = t.meta.scheme === "dark" ? -1 : 1;
          const deepen =
            fill !== undefined && OnColor(fill, t.ink.floor) === "#0b0b0b" ? -darker : darker;
          const hovered = { ...recipe, background: ShiftRef(recipe.background, deepen) };
          return (
            ResolveBackground(t, variant, hovered, scale, VariantForeground(t, variant, scale))
              ?.bg ?? t.colors.surface.base
          );
        },
        min: 4.5,
      });

      pairs.push({
        label: `variantMap.${variant} · ${scale} (borde)`,
        skip: (t) => !t.variantMap[variant].border.startsWith("scale."),
        fg: (t) =>
          ResolveRef(t, t.variantMap[variant].border, scale, t.colors.surface.base) ??
          t.colors.surface.base,
        bg: (t) => t.colors.surface.base,
        min: 3,
      });
    }
  }

  return pairs;
}

export function BuildPairs(): ContrastPair[] {
  const pairs: ContrastPair[] = [];

  for (const role of ["primary", "secondary", "muted"] as const) {
    for (const surface of SURFACES) {
      pairs.push({
        label: `text.${role} / surface.${surface}`,
        fg: (t) => t.colors.text[role],
        bg: (t) => t.colors.surface[surface],
        min: 4.5,
      });
    }
  }

  for (const surface of FIELD_SURFACES) {
    pairs.push({
      label: `text.placeholder / surface.${surface} (fondo de campo)`,
      fg: (t) => t.colors.text.placeholder,
      bg: (t) => t.colors.surface[surface],
      min: 4.5,
    });
  }

  pairs.push({
    label: "text.disabled / surface.disabled (suelo, exento de AA)",
    fg: (t) => t.colors.text.disabled,
    bg: (t) => t.colors.surface.disabled,
    min: 1.5,
  });

  pairs.push({
    label: "text.inverted / gray.900 (superficie invertida)",
    fg: (t) => t.colors.text.inverted,
    bg: (t) => t.colors.gray["900"],
    min: 4.5,
  });

  for (const status of STATUSES) {
    pairs.push({
      label: `semantic.${status}.700 (texto) / surface.base`,
      fg: (t) => t.colors.semantic[status]["700"],
      bg: (t) => t.colors.surface.base,
      min: 4.5,
    });
  }

  for (const surface of SURFACES) {
    pairs.push(
      {
        label: `border.strong / surface.${surface} (UI)`,
        fg: (t) => t.colors.border.strong,
        bg: (t) => t.colors.surface[surface],
        min: 3,
      },
      {
        label: `border.focus / surface.${surface} (focus ≥3:1)`,
        fg: (t) => t.colors.border.focus,
        bg: (t) => t.colors.surface[surface],
        min: 3,
      },
    );
  }
  pairs.push({
    label: "primary.600 (UI filled) / surface.base",
    fg: (t) => t.colors.primary["600"],
    bg: (t) => t.colors.surface.base,
    min: 3,
  });

  for (const level of GLASS_LEVELS) {
    for (const surface of SURFACES) {
      pairs.push({
        label: `glass.${level} (filo) / surface.${surface}`,
        skip: (t) => !t.effects.glass.enabled,
        fg: (t) => t.effects.glass.surface[level].borderColor,
        bg: (t) => Composite(t.effects.glass.surface[level].background, t.colors.surface[surface]),
        min: 1.15,
      });
    }
  }

  pairs.push(...BuildVariantPairs());

  return pairs;
}
