import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import {
  Box,
  Chip,
  ChipGroup,
  NativeSelect,
  Paper,
  RangeSlider,
  Slider,
  Text,
  Title,
  type SelectOption,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof Slider> = {
  title: "Inputs/Slider",
  component: Slider,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Slider>;

const PAISES: SelectOption[] = [
  { value: "mx", label: "México" },
  { value: "co", label: "Colombia" },
  { value: "ar", label: "Argentina", disabled: true },
  { value: "cl", label: "Chile" },
];

const MARKS = [
  { value: 0, label: "0" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

export const Default: Story = {
  render: () => (
    <Box maw={420} display="flex" direction="column" gap="xl">
      <Slider label="Volumen" defaultValue={40} />
      <RangeSlider label="Rango de precio" defaultValue={{ start: 20, end: 80 }} />
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box maw={420} display="flex" direction="column" gap="xl">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Slider key={size} size={size} label={size} defaultValue={50} />
      ))}
    </Box>
  ),
};

export const Variants: Story = {
  render: () => (
    <Box maw={420} display="flex" direction="column" gap="xl">
      <Slider label="sin variant — track en surface.sunken" defaultValue={50} />
      {(["light", "outline", "ghost"] as const).map((variant) => (
        <Slider key={variant} variant={variant} label={variant} defaultValue={50} />
      ))}
      <Slider label="light + color" variant="light" color="success" defaultValue={70} />
      <RangeSlider
        label="outline en rango"
        variant="outline"
        color="warning"
        defaultValue={{ start: 25, end: 75 }}
      />
    </Box>
  ),
};

export const States: Story = {
  render: () => (
    <Box maw={420} display="flex" direction="column" gap="xl">
      <Slider label="Con marcas" defaultValue={50} marks={MARKS} />
      <Slider label="Con paso de 10" defaultValue={40} step={10} />
      <Slider label="Formateado" defaultValue={35} formatValue={(v) => `${String(v)} %`} />
      <Slider label="Sin valor visible" defaultValue={60} withValue={false} />
      <Slider label="Deshabilitado" defaultValue={30} disabled />
      <Slider label="Con error" defaultValue={10} error="Debe superar 20" />
    </Box>
  ),
};

export const Chips: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="lg" maw={480}>
      <ChipGroup label="Plan (selección única)" defaultValue={["pro"]}>
        <Chip value="free">Gratuito</Chip>
        <Chip value="pro">Profesional</Chip>
        <Chip value="team">Equipo</Chip>
      </ChipGroup>
      <ChipGroup label="Etiquetas (múltiple)" multiple defaultValue={["diseño"]}>
        <Chip value="diseño">Diseño</Chip>
        <Chip value="a11y">Accesibilidad</Chip>
        <Chip value="motion">Motion</Chip>
      </ChipGroup>
      {(["filled", "outline", "light"] as const).map((variant) => (
        <Box key={variant} display="flex" gap="sm" wrap="wrap" align="center">
          <Text fz="caption" c="text.muted" w={64}>
            {variant}
          </Text>
          <Chip variant={variant} defaultChecked>
            Marcado
          </Chip>
          <Chip variant={variant}>Sin marcar</Chip>
          <Chip variant={variant} color="success" defaultChecked>
            success
          </Chip>
          <Chip variant={variant} color="error" defaultChecked>
            error
          </Chip>
        </Box>
      ))}
    </Box>
  ),
};

export const Native: Story = {
  render: () => (
    <Box maw={360} display="flex" direction="column" gap="md">
      <NativeSelect label="País" data={PAISES} defaultValue="mx" />
      <NativeSelect
        label="Con placeholder"
        data={PAISES}
        placeholder="Selecciona un país"
        defaultValue=""
      />
      <NativeSelect
        label="Agrupado"
        groups={[
          { label: "América", options: PAISES.slice(0, 2) },
          { label: "Europa", options: [{ value: "es", label: "España" }] },
        ]}
        defaultValue="mx"
      />
    </Box>
  ),
};

export const Dark: Story = {
  globals: { theme: "dark" },
  render: () => (
    <Box maw={420}>
      <Slider label="Volumen" defaultValue={40} marks={MARKS} />
    </Box>
  ),
};

export const ReducedMotion: Story = {
  globals: { reducedMotion: "reduce" },
  render: () => (
    <Box maw={420}>
      <Slider label="Volumen" defaultValue={40} />
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Paper maw={520} p="lg" radius="lg" withBorder shadow="xs">
      <Title order={3} mb="xs">
        Filtros del catálogo
      </Title>
      <Text component="p" c="text.secondary" fz="body2" mb="md">
        Los tres controles de este bloque cerraban §1.4 del inventario y no aparecían en ningún
        prompt de W3.
      </Text>
      <Box display="flex" direction="column" gap="xl">
        <RangeSlider
          label="Precio"
          defaultValue={{ start: 120, end: 480 }}
          min={0}
          max={600}
          step={10}
          formatValue={(v) => `${String(v)} €`}
        />
        <ChipGroup label="Categorías" multiple defaultValue={["audio"]}>
          <Chip value="audio">Audio</Chip>
          <Chip value="video">Vídeo</Chip>
          <Chip value="foto">Fotografía</Chip>
        </ChipGroup>
        <NativeSelect label="Enviar a" data={PAISES} defaultValue="mx" />
      </Box>
    </Paper>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Box display="flex" direction="column" gap="md">
        <Slider size="sm" label="Volumen" defaultValue={40} />
        <ChipGroup label="Plan" defaultValue={["pro"]} size="sm">
          <Chip value="free">Free</Chip>
          <Chip value="pro">Pro</Chip>
        </ChipGroup>
      </Box>
    </ThemeMatrix>
  ),
};

export const KeyboardStepping: Story = {
  render: () => (
    <Box maw={420}>
      <Slider label="Volumen" defaultValue={40} step={5} />
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole("slider");
    slider.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(slider).toHaveValue("45");
    await userEvent.keyboard("{Home}");
    await expect(slider).toHaveValue("0");
  },
};
