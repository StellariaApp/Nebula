import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState, type ReactElement, type ReactNode } from "react";

import { CreateIcons, type IconComponentProps } from "@stellaria/nebula-icons";
import { CommonPack } from "@stellaria/nebula-icons/packs";
import {
  ActionIcon,
  AppShell,
  AspectRatio,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  GlassSurface,
  GradientText,
  Group,
  Progress,
  Segment,
  SimpleGrid,
  Slider,
  StarField,
  Text,
  Textarea,
  Title,
  Tooltip,
  VisuallyHidden,
} from "@stellaria/nebula-web";

import { ProductStage } from "../fixtures/themes.js";

const Stroke = (path: ReactNode) => {
  function Glyph({ size = 16, ...rest }: IconComponentProps): ReactElement {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...rest}
      >
        {path}
      </svg>
    );
  }
  return Glyph;
};

const { Icon } = CreateIcons({
  ...CommonPack,
  spark: Stroke(<path d="M12 3v6m0 6v6m-9-9h6m6 0h6M6 6l3 3m6 6 3 3m0-12-3 3m-6 6-3 3" />),
  compass: Stroke(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-2 5-5 2 2-5z" />
    </>,
  ),
  chat: Stroke(<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.5A8 8 0 1 1 21 12z" />),
  layers: Stroke(<path d="m12 3 9 5-9 5-9-5 9-5Zm9 9-9 5-9-5" />),
  feed: Stroke(
    <>
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="14" width="18" height="6" rx="2" />
    </>,
  ),
  users: Stroke(
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6m1 8a6 6 0 0 0-2-4.5" />
    </>,
  ),
  brain: Stroke(
    <>
      <path d="M9 5a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8A3 3 0 0 0 8 19h1V5Z" />
      <path d="M15 5a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8A3 3 0 0 1 16 19h-1V5Z" />
    </>,
  ),
  wand: Stroke(<path d="m3 21 12-12M14 4l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" />),
  pin: Stroke(<path d="M12 21v-6m-4-9h8l-1 6H9L8 6Zm-1 0h10" />),
  image: Stroke(
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="m4 18 5-5 4 4 3-3 4 4" />
    </>,
  ),
  lock: Stroke(
    <>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>,
  ),
  grid: Stroke(<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />),
});

type IconName = Parameters<typeof Icon>[0]["name"];

/* ── El carril: mismo orden que ourdream, con los grupos declarados ───────────── */

const NAV = [
  {
    title: "Crear",
    links: [
      { icon: "spark" as IconName, label: "Generar", href: "#generar", active: true },
      { icon: "chat" as IconName, label: "Chat", href: "#chat" },
      { icon: "layers" as IconName, label: "Mi IA", href: "#mi-ia" },
    ],
  },
  {
    title: "Descubrir",
    links: [
      { icon: "compass" as IconName, label: "Explorar", href: "#explorar" },
      { icon: "feed" as IconName, label: "Feed", href: "#feed" },
      { icon: "users" as IconName, label: "Comunidad", href: "#comunidad" },
    ],
  },
];

function Rail(): ReactElement {
  return (
    <AppShell.Sidebar.Body>
      {NAV.map((group) => (
        <AppShell.Links key={group.title} title={group.title}>
          {group.links.map((link) => (
            <AppShell.Link
              key={link.href}
              href={link.href}
              active={link.active}
              label={<AppShell.Label>{link.label}</AppShell.Label>}
              leftSection={<Icon name={link.icon} />}
            />
          ))}
        </AppShell.Links>
      ))}
    </AppShell.Sidebar.Body>
  );
}

/* ── Preajustes: lo que en ourdream son cuatro cajas mudas ────────────────────── */

const PRESETS = [
  { key: "sujeto", label: "Sujeto", value: "Lauren Bennett", required: true },
  { key: "pose", label: "Pose", value: undefined, required: false },
  { key: "atuendo", label: "Atuendo", value: undefined, required: false },
  { key: "escena", label: "Escena", value: undefined, required: false },
] as const;

function PresetTile({
  label,
  value,
  required,
}: {
  label: string;
  value?: string | undefined;
  required: boolean;
}): ReactElement {
  const filled = value !== undefined;
  return (
    <Card withBorder radius="lg" p="sm">
      <AspectRatio ratio={3 / 4}>
        <Flex direction="column" align="center" justify="center" gap="xs" h="100%">
          <Box c={filled ? "primary.600" : "text.muted"} display="flex">
            <Icon name={filled ? "user" : "plus"} size={22} />
          </Box>
          <Text fz="caption" fw="semibold" ta="center" truncate>
            {value ?? label}
          </Text>
          {filled ? null : (
            <Text fz="caption" c="text.muted">
              {required ? "obligatorio" : "opcional"}
            </Text>
          )}
        </Flex>
      </AspectRatio>
    </Card>
  );
}

/* ── El panel de composición ──────────────────────────────────────────────────── */

function ComposePanel(): ReactElement {
  const [count, set_count] = useState(2);

  return (
    <GlassSurface level="subtle" radius="lg" withBorder p="md">
      <Segment
        defaultValue="imagen"
        fullWidth
        aria-label="Qué generar"
      >
        <Segment.Control>
          <Segment.Control.Item value="imagen">Imagen</Segment.Control.Item>
          <Segment.Control.Item value="video">Vídeo</Segment.Control.Item>
        </Segment.Control>
      </Segment>

      <Title order={2} fz="caption" tt="uppercase" ls="wide" c="text.muted" mt="md" mb="xs">
        Preajustes
      </Title>
      <SimpleGrid cols={2} spacing="sm">
        {PRESETS.map((preset) => (
          <PresetTile
            key={preset.key}
            label={preset.label}
            value={preset.value}
            required={preset.required}
          />
        ))}
      </SimpleGrid>

      <Title order={2} fz="caption" tt="uppercase" ls="wide" c="text.muted" mt="md" mb="xs">
        Descripción
      </Title>
      <Textarea
        aria-label="Descripción de la escena"
        placeholder="Describe la escena. Los preajustes de arriba ya cuentan quién, cómo y dónde."
        rows={3}
      />

      <Divider my="md" />

      <Flex align="center" justify="space-between" gap="sm">
        <Text fz="caption" c="text.muted">
          Imágenes por tanda
        </Text>
        <Text fz="body3" fw="semibold">
          {count}
        </Text>
      </Flex>
      <Slider
        value={count}
        onChange={set_count}
        min={1}
        max={4}
        step={1}
        aria-label="Imágenes por tanda"
      />

      <Flex align="center" justify="space-between" mt="md" gap="sm">
        <Text fz="caption" c="text.muted">
          Coste estimado
        </Text>
        <Badge variant="light">{count * 5} créditos</Badge>
      </Flex>

      <Button fullWidth mt="sm" rightSection={<Icon name="spark" />}>
        Generar
      </Button>
    </GlassSurface>
  );
}

/* ── El lienzo de resultados ──────────────────────────────────────────────────── */

const RESULTS = [
  { key: "a", state: "listo" },
  { key: "b", state: "listo" },
  { key: "c", state: "generando" },
  { key: "d", state: "generando" },
  { key: "e", state: "bloqueado" },
  { key: "f", state: "bloqueado" },
] as const;

const STATE_LABEL = {
  listo: "Listo",
  generando: "Generando",
  bloqueado: "Requiere plan",
} as const;

function ResultTile({ state }: { state: keyof typeof STATE_LABEL }): ReactElement {
  return (
    <Card withBorder radius="lg" p="none" overflow="hidden">
      <AspectRatio ratio={3 / 4}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          gap="sm"
          h="100%"
          bg="surface.sunken"
        >
          {state === "generando" ? (
            <>
              <Progress value={62} size="xs" w="60%" label="Progreso de la generación" />
              <Text fz="caption" c="text.muted">
                {STATE_LABEL[state]}
              </Text>
            </>
          ) : (
            <>
              <Box c={state === "bloqueado" ? "text.muted" : "primary.600"} display="flex">
                <Icon name={state === "bloqueado" ? "lock" : "image"} size={24} />
              </Box>
              <Text fz="caption" c="text.muted">
                {STATE_LABEL[state]}
              </Text>
            </>
          )}
        </Flex>
      </AspectRatio>
    </Card>
  );
}

function Canvas(): ReactElement {
  return (
    <Box display="flex" direction="column" gap="md">
      <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
        <Segment
          defaultValue="todo"
          size="sm"
          aria-label="Filtrar resultados"
        >
          <Segment.Control>
            <Segment.Control.Item value="todo">Todo</Segment.Control.Item>
            <Segment.Control.Item value="imagenes">Imágenes</Segment.Control.Item>
            <Segment.Control.Item value="videos">Vídeos</Segment.Control.Item>
            <Segment.Control.Item value="favoritos">Me gusta</Segment.Control.Item>
          </Segment.Control>
        </Segment>
        <Group gap="xs">
          <Tooltip
            label="Vista en rejilla"
            trigger={
              <ActionIcon variant="glass" size="sm" aria-label="Vista en rejilla">
                <Icon name="grid" />
              </ActionIcon>
            }
          />
          <Tooltip
            label="Gestionar la galería"
            trigger={
              <ActionIcon variant="glass" size="sm" aria-label="Gestionar la galería">
                <Icon name="edit" />
              </ActionIcon>
            }
          />
        </Group>
      </Flex>

      <SimpleGrid cols={{ base: 2, tablet: 3 }} spacing="md">
        {RESULTS.map((item) => (
          <ResultTile key={item.key} state={item.state} />
        ))}
      </SimpleGrid>
    </Box>
  );
}

/* ── El contexto: lo que en ourdream vive en otra página ──────────────────────── */

function ContextPanel(): ReactElement {
  return (
    <GlassSurface level="subtle" radius="lg" withBorder p="md">
      <Flex align="center" gap="sm">
        <Avatar name="Lauren Bennett" size="sm" radius="full" />
        <Box miw={0} style={{ flex: 1 }}>
          <Text fz="body3" fw="semibold" truncate>
            Lauren Bennett
          </Text>
          <Text fz="caption" c="text.muted" truncate>
            Sujeto activo
          </Text>
        </Box>
        <ActionIcon variant="ghost" size="sm" aria-label="Cambiar de sujeto">
          <Icon name="chevron-right" />
        </ActionIcon>
      </Flex>

      <Divider my="md" />

      <Title order={2} fz="caption" tt="uppercase" ls="wide" c="text.muted" mb="xs">
        Memoria
      </Title>
      <Textarea
        aria-label="Recuerdos fijados"
        placeholder="Lo que debe recordar entre sesiones."
        rows={3}
      />
      <Text fz="caption" c="text.muted" mt="xxs">
        0 / 15 000
      </Text>

      <Title order={2} fz="caption" tt="uppercase" ls="wide" c="text.muted" mt="md" mb="xs">
        Instrucciones
      </Title>
      <Textarea
        aria-label="Instrucciones personalizadas"
        placeholder="Cómo debe comportarse. Se aplica a chat y a generación."
        rows={3}
      />

      <Flex align="center" gap="xs" mt="md">
        <Icon name="brain" />
        <Text fz="caption" c="text.muted">
          La memoria alimenta el chat y los preajustes
        </Text>
      </Flex>
    </GlassSurface>
  );
}

/* ── La página: una sola, con las tres columnas ───────────────────────────────── */

function Studio(): ReactElement {
  const scroller = useRef<HTMLElement | null>(null);
  const [mini, set_mini] = useState(false);

  return (
    <AppShell
      mainRef={scroller}
      sidebarCollapsed={mini}
      backdrop={<StarField fixed parallax aurora density="sm" scroller={scroller} />}
      sidebar={
        <AppShell.Sidebar aria-label="Navegación principal" collapsed={mini} onCollapse={set_mini}>
          <AppShell.Sidebar.Header>
            <Box c="primary.600" display="flex">
              <Icon name="spark" size={26} />
            </Box>
            <AppShell.Label>
              <Text fz="h6" fw="bold" lh="tight">
                <GradientText>Rosette</GradientText>
              </Text>
            </AppShell.Label>
          </AppShell.Sidebar.Header>

          <Rail />

          <AppShell.Sidebar.Footer>
            <Avatar name="William Covarrubias" size="sm" radius="full" />
            <AppShell.Label>
              <Box display="flex" direction="column" miw={0} style={{ flex: 1 }}>
                <Text fz="caption" fw="semibold" truncate>
                  William Covarrubias
                </Text>
                <Text fz="caption" c="text.muted" truncate>
                  120 créditos
                </Text>
              </Box>
            </AppShell.Label>
          </AppShell.Sidebar.Footer>
        </AppShell.Sidebar>
      }
    >
      <VisuallyHidden>
        <Title order={1}>Estudio de Rosette</Title>
      </VisuallyHidden>

      <AppShell.Section aria-label="Estudio">
        <AppShell.Header
          sticky
          title="Estudio"
          subtitle="Componer, generar y conversar en una sola pantalla"
          actions={
            <Group gap="sm">
              <Badge variant="light">120 créditos</Badge>
              <Button size="sm" variant="gradient">
                Mejorar plan
              </Button>
            </Group>
          }
        />
        <AppShell.Content>
          <SimpleGrid cols={{ base: 1, laptop: 3 }} spacing="md">
            <ComposePanel />
            <Canvas />
            <ContextPanel />
          </SimpleGrid>
        </AppShell.Content>
      </AppShell.Section>
    </AppShell>
  );
}

const meta: Meta = {
  title: "Patterns/Rosette",
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj;

/**
 * El estudio unificado. En `ourdream` la composición, el chat y la memoria viven en tres
 * páginas distintas y hay que navegar entre ellas para ajustar una sola generación; aquí son
 * tres columnas de la misma pantalla, así que el contexto nunca se pierde.
 */
export const Estudio: Story = {
  render: () => (
    <ProductStage name="rosette" global="dark">
      <Studio />
    </ProductStage>
  ),
};
