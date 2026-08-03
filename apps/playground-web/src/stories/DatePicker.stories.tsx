import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  Box,
  DatePicker,
  DatePickerInput,
  DateRangePicker,
  DateTimePicker,
  Paper,
  Text,
  TimeInput,
  Title,
  type FieldSurface,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof DatePicker> = {
  title: "Inputs/DatePicker",
  component: DatePicker,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

const REFERENCE = "2026-07-15";

export const Default: Story = {
  render: () => (
    <Box maw={320}>
      <DatePicker label="Fecha de alta" defaultValue={REFERENCE} />
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" maw={320}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <DatePicker key={size} size={size} label={size} defaultValue={REFERENCE} />
      ))}
    </Box>
  ),
};

export const Surfaces: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" maw={320}>
      {(["outline", "filled", "underline", "unstyled"] as FieldSurface[]).map((surface) => (
        <DatePicker key={surface} surface={surface} label={surface} defaultValue={REFERENCE} />
      ))}
    </Box>
  ),
};

export const States: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" maw={320}>
      <DatePicker label="Requerido" required defaultValue={REFERENCE} />
      <DatePicker label="Con error" error="Elige una fecha futura" defaultValue="2020-01-01" />
      <DatePicker label="Deshabilitado" disabled defaultValue={REFERENCE} />
      <DatePicker label="Solo lectura" readOnly defaultValue={REFERENCE} />
      <DatePicker
        label="Acotado"
        description="Solo el segundo semestre"
        minValue="2026-07-01"
        maxValue="2026-12-31"
        defaultValue={REFERENCE}
      />
    </Box>
  ),
};

export const Variants: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" maw={360}>
      <DatePicker label="DatePicker · segmentos editables" defaultValue={REFERENCE} />
      <DatePickerInput label="DatePickerInput · valor formateado" defaultValue={REFERENCE} />
      <DateTimePicker label="DateTimePicker" defaultValue="2026-07-15T09:30" />
      <TimeInput label="TimeInput" defaultValue="09:30" />
      <DateRangePicker
        label="DateRangePicker"
        defaultValue={{ start: "2026-07-06", end: "2026-07-17" }}
      />
    </Box>
  ),
};

export const Dark: Story = {
  globals: { theme: "dark" },
  render: () => (
    <Box maw={320}>
      <DatePicker label="Fecha" defaultValue={REFERENCE} />
    </Box>
  ),
};

export const ReducedMotion: Story = {
  globals: { reducedMotion: "reduce" },
  render: () => (
    <Box maw={320}>
      <DatePicker label="Fecha" defaultValue={REFERENCE} />
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Paper maw={480} p="lg" radius="lg" withBorder shadow="xs">
      <Title order={3} mb="xs">
        Solicitud de crédito
      </Title>
      <Text component="p" c="text.secondary" fz="body2" mb="md">
        Las fechas se guardan en ISO 8601 y viajan como string al backend.
      </Text>
      <Box display="flex" direction="column" gap="md">
        <DatePicker
          label="Fecha de nacimiento"
          description="Debes ser mayor de edad"
          maxValue="2008-07-29"
          defaultValue="1994-03-22"
        />
        <DateRangePicker
          label="Periodo de ingresos declarados"
          defaultValue={{ start: "2026-01-01", end: "2026-06-30" }}
        />
        <DateTimePicker label="Cita de firma" defaultValue="2026-08-03T10:00" />
      </Box>
    </Paper>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Box display="flex" direction="column" gap="sm">
        <DatePicker size="sm" label="Fecha" defaultValue={REFERENCE} />
        <TimeInput size="sm" label="Hora" defaultValue="09:30" />
      </Box>
    </ThemeMatrix>
  ),
};

export const OpensCalendarWithKeyboard: Story = {
  render: () => (
    <Box maw={320}>
      <DatePicker label="Fecha" defaultValue={REFERENCE} />
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /Abrir calendario/ });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(async () => {
      await expect(document.querySelector("[role='dialog']")).not.toBeNull();
    });
    await userEvent.keyboard("{Escape}");
  },
};
