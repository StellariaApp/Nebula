import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import {
  Box,
  ColorInput,
  ColorPicker,
  Fieldset,
  FileInput,
  JsonInput,
  Paper,
  PinInput,
  Rating,
  TagsInput,
  Text,
  Title,
  type FieldSurface,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof PinInput> = {
  title: "Inputs/Pickers",
  component: PinInput,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof PinInput>;

const SWATCHES = ["#3f37c9", "#9d4edd", "#22b8cf", "#f43f5e", "#22c55e"];

export const Default: Story = {
  render: () => (
    <Box maw={360} display="flex" direction="column" gap="md">
      <PinInput label="Código de verificación" length={6} />
      <Rating label="Valoración" defaultValue={4} />
      <TagsInput label="Etiquetas" defaultValue={["react", "a11y"]} />
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" maw={420}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Rating key={size} size={size} label={size} defaultValue={3} />
      ))}
    </Box>
  ),
};

export const Surfaces: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" maw={360}>
      {(["outline", "filled", "underline", "unstyled"] as FieldSurface[]).map((surface) => (
        <TagsInput
          key={surface}
          surface={surface}
          label={surface}
          defaultValue={["nebula"]}
        />
      ))}
    </Box>
  ),
};

export const States: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" maw={420}>
      <PinInput label="Con error" length={4} error="Código incorrecto" defaultValue="12" />
      <PinInput label="Enmascarado" length={4} mask defaultValue="1234" />
      <Rating label="Solo lectura" value={3.5} readOnly fractions={2} />
      <Rating label="Deshabilitado" defaultValue={2} disabled />
      <TagsInput label="Con máximo" description="Máximo 3" maxTags={3} defaultValue={["a", "b"]} />
      <FileInput label="Deshabilitado" disabled />
    </Box>
  ),
};

export const Files: Story = {
  render: () => (
    <Box maw={420} display="flex" direction="column" gap="md">
      <FileInput label="Contrato" description="PDF hasta 5 MB" accept="application/pdf" />
      <FileInput label="Galería" accept="image/*" multiple />
    </Box>
  ),
};

export const Color: Story = {
  render: () => (
    <Box display="flex" gap="xl" wrap="wrap">
      <Box maw={280} display="flex" direction="column" gap="md">
        <ColorInput label="Color de marca" defaultValue="#3f37c9" swatches={SWATCHES} />
        <ColorInput label="Con alpha" format="hexa" withAlpha defaultValue="#9d4eddff" />
        <ColorInput label="Sin picker" withPicker={false} defaultValue="#22b8cf" />
      </Box>
      <Box maw={240}>
        <Text component="p" fz="caption" c="text.muted" mb="sm">
          ColorPicker suelto
        </Text>
        <ColorPicker label="Color" defaultValue="#3f37c9" swatches={SWATCHES} />
      </Box>
    </Box>
  ),
};

export const Json: Story = {
  render: () => (
    <Box maw={480}>
      <JsonInput
        label="Configuración"
        description="Se formatea al salir del campo"
        defaultValue='{"theme":"nebula-dark","dense":false}'
        rows={6}
      />
    </Box>
  ),
};

export const Dark: Story = {
  globals: { theme: "nebula-dark" },
  render: () => (
    <Box maw={360} display="flex" direction="column" gap="md">
      <PinInput label="Código" length={4} defaultValue="12" />
      <Rating label="Valoración" defaultValue={4} />
    </Box>
  ),
};

export const ReducedMotion: Story = {
  globals: { reducedMotion: "reduce" },
  render: () => (
    <Box maw={360}>
      <Rating label="Valoración" defaultValue={4} />
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Paper maw={520} p="lg" radius="lg" withBorder shadow="xs">
      <Title order={3} mb="xs">
        Publicar recurso
      </Title>
      <Text component="p" c="text.secondary" fz="body2" mb="md">
        Un formulario real: agrupación semántica, campos con ritmo consistente y un solo efecto
        dominante en la región.
      </Text>
      <Box display="flex" direction="column" gap="md">
        <Fieldset legend="Metadatos" description="Visible en el catálogo público">
          <Box display="flex" direction="column" gap="md">
            <TagsInput
              label="Etiquetas"
              description="Enter o coma para separar"
              defaultValue={["diseño", "sistema"]}
            />
            <ColorInput label="Color de portada" defaultValue="#9d4edd" swatches={SWATCHES} />
          </Box>
        </Fieldset>
        <Fieldset legend="Archivos" variant="filled">
          <FileInput label="Portada" accept="image/*" />
        </Fieldset>
        <Rating label="Calidad estimada" defaultValue={4} />
      </Box>
    </Paper>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Box display="flex" direction="column" gap="sm">
        <PinInput size="sm" label="Código" length={4} defaultValue="12" />
        <Rating size="sm" label="Valoración" defaultValue={4} />
      </Box>
    </ThemeMatrix>
  ),
};

export const PinKeyboard: Story = {
  render: () => (
    <Box maw={320}>
      <PinInput label="Código" length={4} />
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cells = canvas.getAllByRole("textbox");
    (cells[0] as HTMLElement).focus();
    await userEvent.keyboard("12");
    await expect(cells[2]).toHaveFocus();
    await userEvent.keyboard("{Backspace}");
    await expect(cells[1]).toHaveFocus();
  },
};
