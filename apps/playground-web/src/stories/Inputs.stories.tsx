import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, NumberInput, PasswordInput, SearchInput, Textarea, TextInput } from "@stellaria/nebula-web";

const meta: Meta = {
  title: "Forms/Inputs",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

export const Text: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" maw={360}>
      <TextInput label="Nombre" description="Como aparece en tu perfil" placeholder="Ana García" />
      <TextInput label="Correo" required placeholder="tu@correo.com" />
      <TextInput label="Con error" error="Este campo es obligatorio" defaultValue="" />
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm" maw={360}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <TextInput key={size} size={size} label={`size ${size}`} placeholder={size} />
      ))}
    </Box>
  ),
};

export const Password: Story = {
  render: () => (
    <Box maw={360}>
      <PasswordInput label="Contraseña" description="Mínimo 8 caracteres" defaultValue="secreto123" />
    </Box>
  ),
};

export const Search: Story = {
  render: () => (
    <Box maw={360}>
      <SearchInput label="Buscar" placeholder="Escribe para filtrar…" />
    </Box>
  ),
};

export const Number: Story = {
  render: function NumberStory() {
    const [value, set_value] = useState(3);
    return (
      <Box maw={220}>
        <NumberInput label="Cantidad" value={value} onChange={set_value} min={0} max={10} />
      </Box>
    );
  },
};

export const Multiline: Story = {
  render: () => (
    <Box maw={420}>
      <Textarea label="Comentario" description="Cuéntanos más" rows={4} autosize />
    </Box>
  ),
};

export const Dark: Story = { ...Text, globals: { theme: "nebula-dark" } };
