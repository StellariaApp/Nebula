import type { Meta, StoryObj } from "@storybook/react-vite";

import { vars } from "@stellaria/nebula-web";

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
        <Swatch label="primary.600" color={vars.color.primary["600"]} />
        <Swatch label="accent.600" color={vars.color.accent["600"]} />
        <Swatch label="surface.raised" color={vars.color.surface.raised} />
        <Swatch label="success.600" color={vars.color.semantic.success["600"]} />
        <Swatch label="warning.600" color={vars.color.semantic.warning["600"]} />
        <Swatch label="error.600" color={vars.color.semantic.error["600"]} />
      </div>

      <button
        type="button"
        style={{
          marginTop: vars.space.xl,
          background: vars.color.primary["600"],
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

const meta: Meta<typeof ThemingShowcase> = {
  title: "Theming/Overview",
  component: ThemingShowcase,
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof ThemingShowcase>;

export const Overview: Story = {};
