import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fieldAtom, formAtom, useField, useForm, type FieldAtom } from "form-atoms";
import { z } from "zod";

import type { FieldStatus, NebulaField } from "@stellaria/nebula-tokens";
import {
  Box,
  Button,
  Checkbox,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@stellaria/nebula-web";

const meta: Meta = {
  title: "Forms/Form (form-atoms + Zod)",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

function ClearOnChange(schema: z.ZodType) {
  return ({ value, event }: { value: unknown; event: string }): string[] => {
    if (event === "change") return [];
    const parsed = schema.safeParse(value);
    return parsed.success ? [] : parsed.error.issues.map((issue) => issue.message);
  };
}

const nameField = fieldAtom({
  value: "",
  validate: ClearOnChange(z.string().min(2, "Mínimo 2 caracteres")),
});
const emailField = fieldAtom({
  value: "",
  validate: ClearOnChange(z.string().email("Correo no válido")),
});
const passwordField = fieldAtom({
  value: "",
  validate: ClearOnChange(z.string().min(8, "Mínimo 8 caracteres")),
});
const termsField = fieldAtom({
  value: false,
  validate: ClearOnChange(z.literal(true, { message: "Debes aceptar los términos" })),
});

const signupForm = formAtom({
  name: nameField,
  email: emailField,
  password: passwordField,
  terms: termsField,
});

function ToStatus(status: string): FieldStatus {
  if (status === "validating") return "validating";
  if (status === "invalid") return "invalid";
  if (status === "valid") return "valid";
  return "idle";
}

function useNebulaField<T>(atom: FieldAtom<T>): NebulaField<T> {
  const { state, actions } = useField(atom);
  return {
    value: state.value,
    setValue: (next) => actions.setValue(next),
    status: ToStatus(state.validateStatus),
    error: state.errors[0],
    touched: state.touched,
  };
}

function SignupForm(): React.ReactElement {
  const name = useNebulaField(nameField);
  const email = useNebulaField(emailField);
  const password = useNebulaField(passwordField);
  const terms = useNebulaField(termsField);
  const form = useForm(signupForm);
  const [done, set_done] = useState(false);

  return (
    <Box
      component="form"
      display="flex"
      direction="column"
      gap="md"
      maw={380}
      onSubmit={form.submit(() => {
        set_done(true);
      })}
    >
      <Title order={4}>Crear cuenta</Title>
      <TextInput label="Nombre" field={name} required placeholder="Ana García" />
      <TextInput label="Correo" field={email} required placeholder="tu@correo.com" />
      <PasswordInput label="Contraseña" field={password} required />
      <Checkbox
        label="Acepto los términos"
        checked={terms.value}
        onChange={(checked) => terms.setValue(checked)}
        error={terms.touched && terms.status === "invalid"}
      />
      <Button type="submit">Registrarme</Button>
      {done ? <Text c="success.600">¡Cuenta creada correctamente!</Text> : null}
    </Box>
  );
}

/**
 * Formulario real: form-atoms + Zod validan; los inputs leen el estado por el contrato
 * `NebulaField` (ADR-005). El error aparece al enviar (o al salir del campo) y se limpia
 * en cuanto el usuario escribe: `ClearOnChange` devuelve `[]` para el evento `change`,
 * el field pasa a `valid` y la burbuja se desmonta sola.
 */
export const Signup: Story = {
  render: () => <SignupForm />,
};

export const Dark: Story = {
  render: () => <SignupForm />,
  globals: { theme: "dark" },
};
