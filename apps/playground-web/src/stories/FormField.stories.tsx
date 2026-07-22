import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Box,
  Button,
  FormField,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  vars,
} from "@stellaria/nebula-web";

const meta: Meta<typeof FormField> = {
  title: "Forms/FormField",
  component: FormField,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof FormField>;

const INPUT_STYLE = {
  boxSizing: "border-box",
  width: "100%",
  minHeight: vars.size.md,
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.md,
  paddingInline: vars.space.md,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.body1,
  lineHeight: vars.font.lineHeight.normal,
  background: vars.color.surface.raised,
  color: vars.color.text.primary,
} satisfies CSSProperties;

export const Default: Story = {
  render: () => (
    <Box maw={360}>
      <FormField label="Correo" description="Nunca lo compartimos con nadie.">
        {(control) => <input {...control} type="email" style={INPUT_STYLE} />}
      </FormField>
    </Box>
  ),
};

export const Required: Story = {
  render: () => (
    <Box maw={360}>
      <FormField label="Nombre" required>
        {(control) => <input {...control} style={INPUT_STYLE} />}
      </FormField>
    </Box>
  ),
};

export const WithError: Story = {
  render: () => (
    <Box maw={360}>
      <FormField
        label="Contraseña"
        description="Mínimo 8 caracteres"
        error="Demasiado corta"
        required
      >
        {(control) => <input {...control} type="password" defaultValue="123" style={INPUT_STYLE} />}
      </FormField>
    </Box>
  ),
};

export const Dark: Story = { ...WithError, globals: { theme: "nebula-dark" } };

export const Composition: Story = {
  render: () => (
    <Paper p="lg" radius="lg" shadow="sm" withBorder maw={480}>
      <Box display="flex" direction="column" gap="lg">
        <Box display="flex" direction="column" gap="xs">
          <Title order={4}>Protege tu cuenta</Title>
          <Text fz="body2" c="text.secondary">
            Usa un correo vigente y una contraseña que no reutilices en otros productos.
          </Text>
        </Box>
        <Box component="form" display="flex" direction="column" gap="md">
          <TextInput label="Correo" description="Usaremos este correo para recuperar tu acceso." />
          <PasswordInput
            label="Contraseña"
            description="Mínimo 8 caracteres"
            error="Incluye al menos un número"
            required
          />
          <Button type="submit">Guardar credenciales</Button>
        </Box>
      </Box>
    </Paper>
  ),
};
