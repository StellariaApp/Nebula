import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Box,
  Dropzone,
  FlagImageUrl,
  InputCurrency,
  InputDial,
  InputPhone,
  Paper,
  Signature,
  Text,
  Title,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof InputPhone> = {
  title: "Inputs/Composed",
  component: InputPhone,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof InputPhone>;

export const Phone: Story = {
  render: () => (
    <Box maw={420} display="flex" direction="column" gap="lg">
      <InputPhone label="Teléfono" defaultDialValue="MX" placeholder="55 1234 5678" />
      <InputPhone
        label="Con error"
        defaultDialValue="CO"
        defaultValue="12"
        error="Faltan dígitos"
        errorDisplay="text"
      />
      <InputPhone label="Deshabilitado" defaultDialValue="AR" defaultValue="1123456789" disabled />
    </Box>
  ),
};

export const Dial: Story = {
  render: () => (
    <Box maw={420} display="flex" direction="column" gap="lg">
      <InputDial label="Prefijo (busca por país)" defaultValue="MX" />
      <InputDial
        label="Con bandera del CDN"
        defaultValue="ES"
        renderFlag={(code) => (
          <img src={FlagImageUrl(code)} alt="" width={20} height={15} style={{ borderRadius: 2 }} />
        )}
      />
      <InputDial label="Dataset acotado" data={[{ code: "MX", dial: "+52" }, { code: "US", dial: "+1" }]} />
    </Box>
  ),
};

export const Currency: Story = {
  render: () => (
    <Box maw={420} display="flex" direction="column" gap="lg">
      <InputCurrency label="Importe (MXN)" currency="MXN" locale="es-MX" defaultValue={1234.5} />
      <InputCurrency label="Amount (USD)" currency="USD" locale="en-US" defaultValue={99} />
      <InputCurrency label="Importe (EUR)" currency="EUR" locale="es-ES" defaultValue={2500} />
      <InputCurrency label="Sin decimales" currency="CLP" locale="es-CL" precision={0} defaultValue={45000} />
    </Box>
  ),
};

export const Sign: Story = {
  render: () => (
    <Box maw={480}>
      <Signature label="Firma del titular" />
    </Box>
  ),
};

export const Files: Story = {
  render: () => (
    <Box maw={480} display="flex" direction="column" gap="xl">
      <Dropzone label="Documentos" kind="pdf" />
      <Dropzone label="Fotos (con vista previa)" kind="image" />
    </Box>
  ),
};

export const Composition: Story = {
  render: function Render() {
    const [amount, set_amount] = useState(0);
    return (
      <Paper maw={560} p="xl" radius="lg" withBorder shadow="sm">
        <Title order={3} mb="xs">
          Alta de proveedor
        </Title>
        <Text component="p" c="text.secondary" mb="lg">
          Los tres campos compuestos de W3.2 sobre el mismo contrato de campo.
        </Text>
        <Box display="flex" direction="column" gap="lg">
          <InputPhone label="Teléfono de contacto" defaultDialValue="MX" required />
          <InputCurrency
            label="Cupo autorizado"
            currency="MXN"
            locale="es-MX"
            value={amount}
            onChange={set_amount}
            min={0}
          />
          <Dropzone label="Constancia fiscal" kind="pdf" multiple={false} />
          <Signature label="Firma" height={140} />
        </Box>
      </Paper>
    );
  },
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Box display="flex" direction="column" gap="md">
        <InputPhone label="Teléfono" defaultDialValue="MX" />
        <InputCurrency label="Importe" currency="MXN" locale="es-MX" defaultValue={1200} />
      </Box>
    </ThemeMatrix>
  ),
};
