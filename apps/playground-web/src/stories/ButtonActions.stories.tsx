import type { Meta, StoryObj } from "@storybook/react-vite";

import { CreateIcons } from "@stellaria/nebula-icons";
import { CommonPack } from "@stellaria/nebula-icons/packs";
import {
  ActionIcon,
  Box,
  Button,
  ButtonClose,
  ButtonCopy,
  ButtonGroup,
  FileButton,
  Paper,
  Text,
  UnstyledButton,
} from "@stellaria/nebula-web";

const { Icon } = CreateIcons({ ...CommonPack });

const meta: Meta = {
  title: "Actions/Buttons extra",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

export const Unstyled: Story = {
  render: () => (
    <UnstyledButton>
      <Text>Botón sin estilo (base para controles propios, foco visible por teclado)</Text>
    </UnstyledButton>
  ),
};

export const Close: Story = {
  render: () => (
    <Paper p="md" withBorder radius="md" style={{ position: "relative" }}>
      <ButtonClose style={{ position: "absolute", top: 8, right: 8 }} />
      <Text>Panel con un ButtonClose (aria-label &quot;Cerrar&quot; por defecto).</Text>
    </Paper>
  ),
};

export const Copy: Story = {
  render: () => (
    <Box display="flex" align="center" gap="sm">
      <Text component="code">npm i @stellaria/nebula-web</Text>
      <ButtonCopy value="npm i @stellaria/nebula-web" />
    </Box>
  ),
};

export const Group: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md">
      <ButtonGroup>
        <Button variant="outline">Uno</Button>
        <Button variant="outline">Dos</Button>
        <Button variant="outline">Tres</Button>
      </ButtonGroup>
      <ButtonGroup>
        <ActionIcon variant="outline" aria-label="inicio">
          <Icon name="home" />
        </ActionIcon>
        <ActionIcon variant="outline" aria-label="buscar">
          <Icon name="search" />
        </ActionIcon>
        <ActionIcon variant="outline" aria-label="ajustes">
          <Icon name="settings" />
        </ActionIcon>
      </ButtonGroup>
    </Box>
  ),
};

export const File: Story = {
  render: () => (
    <FileButton onChange={() => undefined} accept="image/*">
      {(control) => (
        <Button variant="light" onClick={control.onClick}>
          Subir imagen
        </Button>
      )}
    </FileButton>
  ),
};

export const Dark: Story = { ...Group, globals: { theme: "dark" } };
