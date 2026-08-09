import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Box, Calendar, Paper, RangeCalendar, Text, Title } from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof Calendar> = {
  title: "Inputs/Calendar",
  component: Calendar,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Calendar>;

const REFERENCE = "2026-07-15";

export const Default: Story = {
  render: () => <Calendar label="Fecha de la cita" defaultValue={REFERENCE} />,
};

export const Sizes: Story = {
  render: () => (
    <Box display="flex" gap="xl" wrap="wrap">
      {(["xs", "md", "xl"] as const).map((size) => (
        <Box key={size}>
          <Text component="p" fz="caption" c="text.muted" mb="sm">
            {size}
          </Text>
          <Calendar size={size} label={`Calendario ${size}`} defaultValue={REFERENCE} />
        </Box>
      ))}
    </Box>
  ),
};

export const States: Story = {
  render: () => (
    <Box display="flex" gap="xl" wrap="wrap">
      <Box>
        <Text component="p" fz="caption" c="text.muted" mb="sm">
          Con rango permitido
        </Text>
        <Calendar
          label="Rango acotado"
          defaultValue={REFERENCE}
          minValue="2026-07-06"
          maxValue="2026-07-24"
        />
      </Box>
      <Box>
        <Text component="p" fz="caption" c="text.muted" mb="sm">
          Fines de semana no disponibles
        </Text>
        <Calendar
          label="Solo laborables"
          defaultValue={REFERENCE}
          isDateUnavailable={(iso) => {
            const day = new Date(`${iso}T00:00:00`).getDay();
            return day === 0 || day === 6;
          }}
        />
      </Box>
      <Box>
        <Text component="p" fz="caption" c="text.muted" mb="sm">
          Deshabilitado
        </Text>
        <Calendar label="No editable" defaultValue={REFERENCE} disabled />
      </Box>
    </Box>
  ),
};

export const Range: Story = {
  render: () => (
    <RangeCalendar
      label="Periodo de facturación"
      defaultValue={{ start: "2026-07-06", end: "2026-07-17" }}
    />
  ),
};

export const TwoMonths: Story = {
  render: () => (
    <RangeCalendar
      label="Estancia"
      visibleMonths={2}
      defaultValue={{ start: "2026-07-28", end: "2026-08-04" }}
    />
  ),
};

export const Locales: Story = {
  render: () => (
    <Box display="flex" gap="xl" wrap="wrap">
      {(
        [
          { locale: "es-ES", label: "es-ES · la semana empieza en lunes" },
          { locale: "en-US", label: "en-US · la semana empieza en domingo" },
        ] as const
      ).map((entry) => (
        <Box key={entry.locale}>
          <Text component="p" fz="caption" c="text.muted" mb="sm">
            {entry.label}
          </Text>
          <Calendar label={entry.locale} locale={entry.locale} defaultValue={REFERENCE} />
        </Box>
      ))}
    </Box>
  ),
};

export const Dark: Story = {
  globals: { theme: "dark" },
  render: () => <Calendar label="Fecha" defaultValue={REFERENCE} />,
};

export const ReducedMotion: Story = {
  globals: { reducedMotion: "reduce" },
  render: () => <Calendar label="Fecha" defaultValue={REFERENCE} />,
};

export const Composition: Story = {
  render: () => (
    <Paper maw={420} p="lg" r="lg" withBorder shadow="xs">
      <Title order={3} mb="xs">
        Reprogramar visita
      </Title>
      <Text component="p" c="text.secondary" fz="body2" mb="md">
        Elige el nuevo día. Los fines de semana no hay atención presencial.
      </Text>
      <Calendar
        label="Nueva fecha"
        defaultValue={REFERENCE}
        minValue="2026-07-01"
        isDateUnavailable={(iso) => {
          const day = new Date(`${iso}T00:00:00`).getDay();
          return day === 0 || day === 6;
        }}
      />
    </Paper>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Calendar size="sm" label="Fecha" defaultValue={REFERENCE} />
    </ThemeMatrix>
  ),
};

export const KeyboardNavigation: Story = {
  render: () => <Calendar label="Fecha" defaultValue={REFERENCE} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cells = canvas.getAllByRole("button").filter((n) => n.textContent === "15");
    const start = cells[0] as HTMLElement;
    start.focus();
    await userEvent.keyboard("{ArrowRight}");
    const next = canvas.getAllByRole("button").filter((n) => n.textContent === "16")[0];
    await expect(next).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    const week = canvas.getAllByRole("button").filter((n) => n.textContent === "23")[0];
    await expect(week).toHaveFocus();
  },
};
