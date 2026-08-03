import type { Meta, StoryObj } from "@storybook/react-vite";

import type { NebulaField } from "@stellaria/nebula-tokens";
import type { FieldErrorPosition } from "@stellaria/nebula-web";
import { Box, FieldError, NumberInput, Text, TextInput } from "@stellaria/nebula-web";

const POSITIONS: FieldErrorPosition[] = [
  "top-left",
  "top",
  "top-right",
  "bottom-left",
  "bottom",
  "bottom-right",
];

const meta: Meta = {
  title: "Forms/FieldError",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

const VALIDATING_FIELD: NebulaField<string> = {
  value: "abc",
  setValue: () => undefined,
  status: "validating",
  error: undefined,
  touched: true,
};

/** Por defecto los inputs muestran el error como burbuja flotante (patrón fonicredito). */
export const Tooltip: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="xl" maw={360} pt="xl">
      <TextInput
        label="Correo"
        defaultValue="no-es-un-correo"
        error="Formato de correo no válido"
      />
      <NumberInput label="Edad" value={200} error="Debe ser menor que 120" max={120} />
    </Box>
  ),
};

/** `errorDisplay="text"` vuelve al error inline debajo del campo. */
export const InlineText: Story = {
  render: () => (
    <Box maw={360}>
      <TextInput
        label="Correo"
        defaultValue="no-es-un-correo"
        error="Formato de correo no válido"
        errorDisplay="text"
      />
    </Box>
  ),
};

/** Estado de validación: burbuja "Validando…" en color info tras un breve retardo. */
export const Validating: Story = {
  render: () => (
    <Box maw={320} pt="xl">
      <FieldError field={VALIDATING_FIELD}>
        <Text
          p="sm"
          bg="surface.raised"
          bdc="border.default"
          r="md"
          style={{ borderWidth: 1, borderStyle: "solid" }}
        >
          Comprobando disponibilidad…
        </Text>
      </FieldError>
    </Box>
  ),
};

/** Las 6 posiciones (`position`), con la burbuja anclada por `inset`/`margin`. */
export const Positions: Story = {
  render: () => (
    <Box
      display="grid"
      style={{ gridTemplateColumns: "repeat(3, 1fr)", rowGap: 88, columnGap: 32 }}
      py="xxxl"
      px="xl"
    >
      {POSITIONS.map((position) => (
        <FieldError key={position} error={position} position={position}>
          <Text
            ta="center"
            p="sm"
            bg="surface.raised"
            bdc="border.default"
            r="md"
            style={{ borderWidth: 1, borderStyle: "solid" }}
          >
            {position}
          </Text>
        </FieldError>
      ))}
    </Box>
  ),
};

export const Dark: Story = { ...Tooltip, globals: { theme: "dark" } };

/** Con reduced-motion la burbuja aparece sin transición. */
export const ReducedMotion: Story = {
  ...Tooltip,
  globals: { reducedMotion: "reduce" },
};
