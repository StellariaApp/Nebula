import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Box, MonthPicker, Paper, Text, Title, YearPicker } from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof MonthPicker> = {
  title: "Inputs/MonthPicker",
  component: MonthPicker,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof MonthPicker>;

export const Default: Story = {
  render: () => (
    <Box maw={280}>
      <MonthPicker label="Mes de corte" defaultValue="2026-07" />
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box display="flex" gap="lg" wrap="wrap">
      {(["xs", "md", "xl"] as const).map((size) => (
        <Box key={size} maw={280}>
          <Text component="p" fz="caption" c="text.muted" mb="sm">
            {size}
          </Text>
          <MonthPicker size={size} label={`Mes ${size}`} defaultValue="2026-07" />
        </Box>
      ))}
    </Box>
  ),
};

export const States: Story = {
  render: () => (
    <Box display="flex" gap="lg" wrap="wrap">
      <Box maw={280}>
        <Text component="p" fz="caption" c="text.muted" mb="sm">
          Acotado a un semestre
        </Text>
        <MonthPicker
          label="Mes acotado"
          defaultValue="2026-07"
          minValue="2026-03"
          maxValue="2026-09"
        />
      </Box>
      <Box maw={280}>
        <Text component="p" fz="caption" c="text.muted" mb="sm">
          Deshabilitado
        </Text>
        <MonthPicker label="Mes bloqueado" defaultValue="2026-07" disabled />
      </Box>
    </Box>
  ),
};

export const Years: Story = {
  render: () => (
    <Box maw={280}>
      <YearPicker label="Ejercicio fiscal" defaultValue="2026" />
    </Box>
  ),
};

export const Locales: Story = {
  render: () => (
    <Box display="flex" gap="lg" wrap="wrap">
      {(["es-ES", "en-US"] as const).map((locale) => (
        <Box key={locale} maw={280}>
          <Text component="p" fz="caption" c="text.muted" mb="sm">
            {locale}
          </Text>
          <MonthPicker label={locale} locale={locale} defaultValue="2026-07" />
        </Box>
      ))}
    </Box>
  ),
};

export const Dark: Story = {
  globals: { theme: "nebula-dark" },
  render: () => (
    <Box maw={280}>
      <MonthPicker label="Mes" defaultValue="2026-07" />
    </Box>
  ),
};

export const ReducedMotion: Story = {
  globals: { reducedMotion: "reduce" },
  render: () => (
    <Box maw={280}>
      <MonthPicker label="Mes" defaultValue="2026-07" />
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Paper maw={620} p="lg" radius="lg" withBorder shadow="xs">
      <Title order={3} mb="xs">
        Periodo del informe
      </Title>
      <Text component="p" c="text.secondary" fz="body2" mb="md">
        El mes emite <code>YYYY-MM</code> y el año <code>YYYY</code>; ninguno arrastra la cadena de
        fechas de React Aria.
      </Text>
      <Box display="flex" gap="lg" wrap="wrap">
        <Box maw={260}>
          <MonthPicker label="Mes" defaultValue="2026-07" />
        </Box>
        <Box maw={260}>
          <YearPicker label="Año" defaultValue="2026" />
        </Box>
      </Box>
    </Paper>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <MonthPicker size="sm" label="Mes" defaultValue="2026-07" />
    </ThemeMatrix>
  ),
};

export const KeyboardNavigation: Story = {
  render: () => (
    <Box maw={280}>
      <MonthPicker label="Mes" defaultValue="2026-01" />
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const options = canvas.getAllByRole("option");
    (options[0] as HTMLElement).focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(options[1]).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(options[4]).toHaveFocus();
  },
};
