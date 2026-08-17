import type {
  GlassLevel,
  NebulaTheme,
  SemanticScaleName,
  SurfaceRole,
  Variant,
} from "@stellaria/nebula-tokens";

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
  /**
   * El par se mide, y si falla **no tumba el gate**: es una deuda que un ADR acepta por escrito. El
   * valor es la referencia de esa aceptacion, para que nadie pueda declarar deuda sin decir donde.
   *
   * Existe porque la alternativa era peor: un gate permanentemente rojo por un incumplimiento ya
   * decidido ensena a ignorar el gate entero. Y quitar el par —lo que se hizo hasta ahora— deja el
   * defecto sin nadie mirandolo. Asi se mide, se ve y no bloquea.
   *
   * Cuando un par con deuda **pasa**, el CLI lo avisa: la deuda esta pagada y el marcador sobra.
   */
  deuda?: string;
}

const SURFACES = ["base", "raised", "overlay", "sunken", "hover", "active", "hoverActive"] as const;
/**
 * Exhaustiva por tipos: si `GlassLevel` gana un valor y no se anade aqui, esto deja de compilar. La
 * lista era un literal suelto y un nivel nuevo habria viajado sin que ningun par lo midiera.
 */
const EnumValues =
  <Union extends string>() =>
  <const Values extends readonly Union[]>(
    values: [Union] extends [Values[number]] ? Values : never,
  ): Values =>
    values;

const GLASS_LEVELS = EnumValues<GlassLevel>()([
  "veil",
  "band",
  "control",
  "subtle",
  "default",
  "strong",
]);
const FIELD_SURFACES = ["sunken", "base", "raised", "overlay"] as const;
const STATUSES = ["success", "warning", "error", "info"] as const;

/**
 * La cadena de elevacion tal y como ADR-100 la dejo consecutiva en los dos esquemas. Lo que cambia
 * entre esquemas es la direccion, no el orden.
 */
const ELEVATION_LADDER = ["overlay", "base", "raised", "sunken"] as const;

/** ADR-065 §1 para la elevacion y docs/06 §5.1 para la interaccion: la misma magnitud. */
const ELEVATION_STEP = 1.08;

const INTERACTION_STEPS = [
  ["hover", "base"],
  ["hover", "raised"],
  ["active", "base"],
  ["hoverActive", "active"],
] as const satisfies readonly (readonly [SurfaceRole, SurfaceRole])[];

/**
 * SC 1.4.11 pide 3:1 a lo que identifica un componente, y el borde en reposo de un campo lo es
 * (`styles/field.css.ts`, variante por defecto). `subtle` solo separa superficies, asi que se le pide
 * ser perceptible — el mismo 1.15 que ya se exige al filo del cristal.
 */
const BORDER_MINIMA = { default: 3, subtle: 1.15 } as const;

const DEUDA_BORDE = "ADR-161 §2.1 — excepcion aceptada el 2026-08-17";
const DEUDA_ESCALON = "ADR-161 §2.2 — deuda declarada el 2026-08-17";

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
  for (const [role, min] of Object.entries(BORDER_MINIMA)) {
    for (const surface of SURFACES) {
      pairs.push({
        label: `border.${role} / surface.${surface}`,
        fg: (t) => t.colors.border[role as "default" | "subtle"],
        bg: (t) => t.colors.surface[surface],
        min,
        deuda: DEUDA_BORDE,
      });
    }
  }

  for (let i = 1; i < ELEVATION_LADDER.length; i++) {
    const under = ELEVATION_LADDER[i - 1] as SurfaceRole;
    const over = ELEVATION_LADDER[i] as SurfaceRole;
    pairs.push({
      label: `surface.${under} ↔ surface.${over} (escalon de elevacion)`,
      fg: (t) => t.colors.surface[under],
      bg: (t) => t.colors.surface[over],
      min: ELEVATION_STEP,
      deuda: DEUDA_ESCALON,
    });
  }

  for (const [state, under] of INTERACTION_STEPS) {
    pairs.push({
      label: `surface.${state} ↔ surface.${under} (escalon de interaccion)`,
      fg: (t) => t.colors.surface[state],
      bg: (t) => t.colors.surface[under],
      min: ELEVATION_STEP,
      deuda: DEUDA_ESCALON,
    });
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
