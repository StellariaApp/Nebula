import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  useTheme,
} from "@stellaria/nebula-web";
import { vars } from "@stellaria/nebula-themes/web";
import { palettes, type Scale11 } from "@stellaria/nebula-tokens";

const PALETTE_NAMES = Object.keys(palettes) as (keyof typeof palettes)[];

const SHADES = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
] as const;
const FILL_SHADE = "500";
const SRGB_CUT = 0.03928;

function Luminance(hex: string): number {
  const raw = hex.replace("#", "");
  const channel = (start: number): number => {
    const value = Number.parseInt(raw.slice(start, start + 2), 16) / 255;
    return value <= SRGB_CUT ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

function Ratio(a: number, b: number): number {
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** Contraste contra la tinta que ese relleno elegiria, no contra blanco siempre (ADR-085). */
function AgainstInk(hex: string): string {
  const fill = Luminance(hex);
  const light = Ratio(fill, Luminance("#ffffff"));
  const dark = Ratio(fill, Luminance("#0b0b0b"));
  return light >= dark ? `${light.toFixed(2)} clara` : `${dark.toFixed(2)} oscura`;
}

/** Una rampa 50–950. El paso 500 lleva su contraste contra blanco, que es lo que ancla (ADR-084). */
function Ramp({ name, scale }: { name: string; scale: Scale11 }) {
  return (
    <div style={{ marginBottom: vars.space.md }}>
      <p
        style={{
          margin: 0,
          marginBottom: vars.space.xxs,
          fontFamily: vars.font.family.mono,
          fontSize: vars.font.size.caption,
          color: vars.color.text.muted,
        }}
      >
        {name}
      </p>
      <div style={{ display: "flex", gap: "2px" }}>
        {SHADES.map((shade) => (
          <figure key={shade} style={{ margin: 0, flex: 1, minWidth: 0 }}>
            <div
              aria-hidden="true"
              style={{
                background: scale[shade],
                height: shade === FILL_SHADE ? "56px" : "44px",
                borderRadius: vars.radius.xs,
                border: `1px solid ${vars.color.border.subtle}`,
              }}
            />
            <figcaption
              style={{
                marginTop: vars.space.xxs,
                fontFamily: vars.font.family.mono,
                fontSize: vars.font.size.caption,
                color: shade === FILL_SHADE ? vars.color.text.primary : vars.color.text.muted,
                textAlign: "center",
              }}
            >
              {shade === FILL_SHADE ? `${shade} · ${AgainstInk(scale[shade])}` : shade}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

/** Muestra de color decorativa (aria-hidden) + caption legible sobre la superficie. */
function Swatch({ label, color }: { label: string; color: string }) {
  return (
    <figure style={{ margin: 0 }}>
      <div
        aria-hidden="true"
        style={{
          background: color,
          width: "112px",
          height: "48px",
          borderRadius: vars.radius.sm,
          border: `1px solid ${vars.color.border.subtle}`,
        }}
      />
      <figcaption
        style={{
          color: vars.color.text.secondary,
          fontSize: vars.font.size.body2,
          marginTop: vars.space.xs,
        }}
      >
        {label}
      </figcaption>
    </figure>
  );
}

/**
 * Muestra que TODO se reconfigura por CSS vars al cambiar el tema en la toolbar:
 * los componentes de W1.4+ leerán estos mismos roles. Sin hex crudos.
 */
function ThemingShowcase() {
  return (
    <main
      style={{
        fontFamily: vars.font.family.sans,
        background: vars.color.surface.base,
        color: vars.color.text.primary,
        padding: vars.space.xl,
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: vars.font.size.h1, margin: 0, fontWeight: vars.font.weight.bold }}>
        Nebula theming
      </h1>
      <p style={{ color: vars.color.text.secondary, maxWidth: "60ch" }}>
        Cambia el tema con la toolbar (Tema · Motion · viewport): todo se reconfigura por CSS vars
        sobre la clase del tema, sin recompilar.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: vars.space.md,
          marginTop: vars.space.lg,
        }}
      >
        <Swatch label="primary" color={vars.color.primary["500"]} />
        <Swatch label="accent" color={vars.color.accent["500"]} />
        <Swatch label="surface.raised" color={vars.color.surface.raised} />
        <Swatch label="success" color={vars.color.semantic.success["500"]} />
        <Swatch label="warning" color={vars.color.semantic.warning["500"]} />
        <Swatch label="error" color={vars.color.semantic.error["500"]} />
        <Swatch label="info" color={vars.color.semantic.info["500"]} />
      </div>

      <h2
        style={{
          fontSize: vars.font.size.h3,
          marginTop: vars.space.xl,
          marginBottom: vars.space.xs,
          fontWeight: vars.font.weight.semibold,
        }}
      >
        Escalas de rol
      </h2>
      <p style={{ color: vars.color.text.secondary, maxWidth: "70ch", marginTop: 0 }}>
        Las siete escalas que el tema reasigna. El paso <code>500</code> va marcado con su contraste
        contra blanco: el generador lo resuelve hasta 4.5:1 en todas las familias, así que es el
        peldaño que puede llevar tinta encima (ADR-084).
      </p>
      <RoleRamps />

      <button
        type="button"
        style={{
          marginTop: vars.space.xl,
          background: vars.color.primary["500"],
          color: vars.color.text.onPrimary,
          border: "none",
          borderRadius: vars.radius.md,
          padding: `${vars.space.sm} ${vars.space.lg}`,
          fontSize: vars.font.size.button,
          fontWeight: vars.font.weight.medium,
          cursor: "pointer",
        }}
      >
        Acción primaria
      </button>
    </main>
  );
}

function RoleRamps() {
  const { theme } = useTheme();
  return (
    <>
      <Ramp name="primary" scale={theme.colors.primary} />
      <Ramp name="accent" scale={theme.colors.accent} />
      <Ramp name="gray" scale={theme.colors.gray} />
      <Ramp name="success" scale={theme.colors.semantic.success} />
      <Ramp name="warning" scale={theme.colors.semantic.warning} />
      <Ramp name="error" scale={theme.colors.semantic.error} />
      <Ramp name="info" scale={theme.colors.semantic.info} />
    </>
  );
}

function PaletteSheet() {
  return (
    <main
      style={{
        fontFamily: vars.font.family.sans,
        background: vars.color.surface.base,
        color: vars.color.text.primary,
        padding: vars.space.xl,
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: vars.font.size.h2, margin: 0, fontWeight: vars.font.weight.bold }}>
        Paletas
      </h1>
      <p style={{ color: vars.color.text.secondary, maxWidth: "70ch" }}>
        Generadas por <code>pnpm gen:palette regen</code> en OKLCH. Cada familia declara qué tinta
        lleva su <code>500</code>: las hondas se anclan bajando hasta que blanco alcanza 4.5:1, y
        las claras se quedan altas porque su tinta es oscura y les sobra contraste (ADR-085).
      </p>
      {PALETTE_NAMES.map((name) => (
        <Ramp key={name} name={name} scale={palettes[name]} />
      ))}
    </main>
  );
}

const meta: Meta<typeof ThemingShowcase> = {
  title: "Theming/Overview",
  component: ThemingShowcase,
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof ThemingShowcase>;

export const Overview: Story = {};

/**
 * Las 16 paletas crudas, que NO dependen del tema: el tema elige cuáles usa como
 * `primary`/`accent` y si las voltea, pero la rampa es la misma. Es la lámina para revisar el
 * anclaje del `500` y el tono de cada familia.
 */
export const Paletas: Story = {
  render: () => <PaletteSheet />,
};
