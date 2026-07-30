import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Box,
  ColorSwatch,
  Group,
  Indicator,
  Kbd,
  Paper,
  Spoiler,
  Tag,
  Text,
  ThemeIcon,
  Title,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof Tag> = {
  title: "Data Display/Primitives",
  component: Tag,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Tag>;

const LARGO =
  "Nebula construye la librería completa antes de migrar a sus consumidores. El catálogo cubre " +
  "web y native con una API unificada por componente, y la personalización entre productos " +
  "radicalmente distintos se logra exclusivamente vía temas, nunca con forks. Los contratos viven " +
  "en el paquete de tokens y cada plataforma implementa solo la capa visual.";

export const Tags: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md">
      {(["filled", "outline", "light", "ghost"] as const).map((variant) => (
        <Group key={variant} gap="sm" align="center">
          <Text fz="caption" c="text.muted" w={64}>
            {variant}
          </Text>
          <Tag variant={variant}>Estática</Tag>
          <Tag variant={variant} onRemove={() => undefined}>
            Removible
          </Tag>
          <Tag variant={variant} color="success" onRemove={() => undefined}>
            success
          </Tag>
          <Tag variant={variant} disabled onRemove={() => undefined}>
            Bloqueada
          </Tag>
        </Group>
      ))}
    </Box>
  ),
};

export const Icons: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md">
      {(["filled", "outline", "light", "ghost", "gradient"] as const).map((variant) => (
        <Group key={variant} gap="sm" align="center">
          <Text fz="caption" c="text.muted" w={72}>
            {variant}
          </Text>
          {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
            <ThemeIcon key={size} variant={variant} size={size}>
              ★
            </ThemeIcon>
          ))}
          <ThemeIcon variant={variant} color="warning" radius="full">
            !
          </ThemeIcon>
        </Group>
      ))}
    </Box>
  ),
};

export const Keys: Story = {
  render: () => (
    <Group gap="sm" align="center">
      <Kbd size="xs">Esc</Kbd>
      <Kbd size="sm">Ctrl</Kbd>
      <Kbd>K</Kbd>
      <Kbd size="lg">⇧</Kbd>
      <Kbd size="xl">Enter</Kbd>
    </Group>
  ),
};

export const Swatches: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md">
      <Group gap="sm">
        {(["primary", "accent", "success", "warning", "error", "info"] as const).map((color) => (
          <ColorSwatch key={color} color={color} label={color} size={32} />
        ))}
      </Group>
      <Group gap="sm" align="center">
        <ColorSwatch color="#3f37c9" label="Indigo" size={40} radius="md" />
        <ColorSwatch color="#9d4edd" label="Violeta" size={40} radius="sm" />
        <ColorSwatch color="#22b8cf" label="Elegible" onPress={() => undefined} />
      </Group>
    </Box>
  ),
};

export const Indicators: Story = {
  render: () => (
    <Group gap="xl" align="center">
      <Indicator announce="3 mensajes sin leer" count={3}>
        <Paper p="md" radius="md" withBorder>
          Bandeja
        </Paper>
      </Indicator>
      <Indicator count={150} max={99} color="warning">
        <Paper p="md" radius="md" withBorder>
          Avisos
        </Paper>
      </Indicator>
      <Indicator color="success" size="sm">
        <Paper p="md" radius="md" withBorder>
          En línea
        </Paper>
      </Indicator>
      <Indicator processing color="info">
        <Paper p="md" radius="md" withBorder>
          Sincronizando
        </Paper>
      </Indicator>
      <Indicator count={5} disabled>
        <Paper p="md" radius="md" withBorder>
          Apagado
        </Paper>
      </Indicator>
    </Group>
  ),
};

export const Spoilers: Story = {
  render: () => (
    <Box maw={520} display="flex" direction="column" gap="xl">
      <Spoiler maxHeight={60}>
        <Text component="p">{LARGO}</Text>
      </Spoiler>
      <Spoiler maxHeight={9999}>
        <Text component="p">Este texto no desborda, así que no aparece el conmutador.</Text>
      </Spoiler>
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Paper maw={520} p="xl" radius="lg" withBorder shadow="sm">
      <Group justify="space-between" align="flex-start" mb="md">
        <Group gap="sm" align="center">
          <ThemeIcon variant="light" color="accent" size="lg" radius="md">
            ◆
          </ThemeIcon>
          <Box>
            <Title order={4}>Proveedor 1042</Title>
            <Text fz="caption" c="text.muted">
              Alta el 12 de marzo
            </Text>
          </Box>
        </Group>
        <Indicator count={2} announce="2 incidencias abiertas">
          <ColorSwatch color="success" label="Activo" size={20} />
        </Indicator>
      </Group>
      <Group gap="xs" mb="md">
        <Tag variant="light" color="success">
          Verificado
        </Tag>
        <Tag variant="light" onRemove={() => undefined}>
          Prioritario
        </Tag>
        <Tag variant="outline" color="gray">
          MXN
        </Tag>
      </Group>
      <Spoiler maxHeight={44}>
        <Text component="p" fz="body3" c="text.secondary">
          {LARGO}
        </Text>
      </Spoiler>
      <Text fz="caption" c="text.muted" mt="md">
        Pulsa <Kbd size="xs">Ctrl</Kbd> + <Kbd size="xs">K</Kbd> para buscar
      </Text>
    </Paper>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Group gap="sm" align="center">
        <ThemeIcon variant="light">★</ThemeIcon>
        <Tag variant="light" onRemove={() => undefined}>
          Etiqueta
        </Tag>
        <Kbd>K</Kbd>
        <ColorSwatch color="primary" label="Marca" />
      </Group>
    </ThemeMatrix>
  ),
};
