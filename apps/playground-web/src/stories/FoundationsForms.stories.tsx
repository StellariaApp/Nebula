import type { Meta, StoryObj } from "@storybook/react-vite";

import type { Size } from "@stellaria/nebula-tokens";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Paper,
  Select,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix, rosette } from "../fixtures/themes.js";

const meta: Meta = {
  title: "Foundations/Visual QA/Forms",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

const countries = [
  { value: "mx", label: "México" },
  { value: "co", label: "Colombia" },
  { value: "es", label: "España" },
];

function Label(props: { children: React.ReactNode }): React.ReactElement {
  return (
    <Text component="p" fz="caption" ff="mono" tt="uppercase" ls="wide" c="text.muted" mb="sm">
      {props.children}
    </Text>
  );
}

/** Anatomía del campo: label → ayuda → control → error, con el ritmo 2/8/4 de ADR-024 §4. */
export const Anatomy: Story = {
  render: () => (
    <Flex direction="column" gapy="lg" p="lg" bg="surface.base" style={{ maxWidth: "44ch" }}>
      <TextInput label="Razón social" defaultValue="Stellaria Software SA de CV" />
      <TextInput
        label="RFC"
        description="12 caracteres para persona moral, 13 para persona física."
        defaultValue="STE240101AB1"
      />
      <TextInput
        label="Correo de facturación"
        description="Recibirá el CFDI de cada cobro."
        error="Escribe un correo válido."
        defaultValue="facturacion@"
        required
      />
      <TextInput
        label="Cuenta CLABE"
        description="Solo lectura."
        defaultValue="012180000000000000"
        disabled
      />
    </Flex>
  ),
};

/** Densidad: el mismo formulario en control md (default) y sm (data-dense). */
export const Density: Story = {
  render: () => (
    <Flex gapx="xl" wrap="wrap" p="lg" bg="surface.base">
      {(["md", "sm"] as Size[]).map((size) => (
        <Box key={size} style={{ minWidth: "32ch", flex: 1 }}>
          <Label>{size === "md" ? "md · default de producto" : "sm · data-dense"}</Label>
          <Flex direction="column" gapy="md">
            <TextInput label="Nombre" size={size} defaultValue="Ana Rivera" />
            <TextInput label="Correo" size={size} defaultValue="ana@stellaria.app" />
            <Select label="País" size={size} data={countries} defaultValue="mx" />
          </Flex>
        </Box>
      ))}
    </Flex>
  ),
};

/** Grupos: campo→campo md/lg, grupo→grupo xl. El espacio expresa la relación. */
export const Groups: Story = {
  render: () => (
    <Box p="lg" bg="surface.base">
      <Paper withBorder radius="md" p="lg" style={{ maxWidth: "52ch" }}>
        <Flex direction="column" gapy="xl">
          <Flex direction="column" gapy="md">
            <Title order={5}>Datos fiscales</Title>
            <TextInput label="Razón social" defaultValue="Stellaria Software SA de CV" />
            <TextInput label="RFC" defaultValue="STE240101AB1" />
            <Select label="País" data={countries} defaultValue="mx" />
          </Flex>

          <Flex direction="column" gapy="md">
            <Title order={5}>Preferencias</Title>
            <Textarea
              label="Nota para la factura"
              description="Aparece en el campo de observaciones del CFDI."
              rows={3}
            />
            <Flex direction="column" gapy="sm">
              <Checkbox label="Enviar copia al equipo de finanzas" defaultChecked />
              <Switch label="Facturación automática cada mes" defaultChecked />
            </Flex>
          </Flex>

          <Divider />

          <Flex gapx="sm" justify="flex-end">
            <Button variant="ghost">Descartar</Button>
            <Button>Guardar</Button>
          </Flex>
        </Flex>
      </Paper>
    </Box>
  ),
};

export const Composition: Story = { ...Groups };

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix extra={[{ theme: rosette, label: "rosette (producto)" }]}>
      <Flex direction="column" gapy="md">
        <TextInput label="Correo" defaultValue="ana@stellaria.app" />
        <TextInput label="RFC" error="Formato inválido." defaultValue="STE24" />
        <Checkbox label="Recibir avisos" defaultChecked />
      </Flex>
    </ThemeMatrix>
  ),
};

export const Dark: Story = { ...Groups, globals: { theme: "nebula-dark" } };

export const ReducedMotion: Story = { ...Groups, globals: { reducedMotion: "reduce" } };
