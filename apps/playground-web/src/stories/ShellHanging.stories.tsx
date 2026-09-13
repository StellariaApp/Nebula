import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement } from "react";

import { vars } from "@stellaria/nebula-themes/web";
import {
  AppShell,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  GlassSurface,
  Group,
  Segment,
  Text,
  Transition,
  useAppShellScroll,
} from "@stellaria/nebula-web";

const meta: Meta = {
  title: "Layout/Shell/Cabecera que se encoge",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

/**
 * relleno lg·2 (44) + fila, que manda la cara (96) + hueco md (16) + Segment md (58) + borde (1)
 */
const SHEET_HEADER_HEIGHT = 215;

/** La banda que cuelga de la sección: lee `scrolled` y decide qué encoge. La transición es CSS. */
function SheetHeader(): ReactElement {
  const { scrolled } = useAppShellScroll();
  return (
    <GlassSurface
      bdbw={1}
      bdw={0}
      direction="column"
      display="flex"
      gap={scrolled ? "sm" : "md"}
      level="strong"
      mih={scrolled ? 0 : SHEET_HEADER_HEIGHT}
      p={scrolled ? "sm" : { base: "md", tablet: "lg" }}
      r={0}
      style={{
        transitionProperty: "padding, gap, min-height",
        transitionDuration: vars.motion.duration.base,
        transitionTimingFunction: vars.motion.easing.standard,
      }}
    >
      <Box align="center" display="flex" gap={scrolled ? "sm" : "lg"} w="100%">
        <Avatar alt="Rose" name="Rose" radius="md" size={scrolled ? 40 : 96} />
        {scrolled ? (
          <Text fw="bold" fz="body1" truncate>
            Rose
          </Text>
        ) : null}
        <Transition mounted={!scrolled} transition="fade">
          <Group gap="xs" wrap>
            <Badge color="primary" size="sm" variant="light">
              Publicada
            </Badge>
            <Badge color="gray" size="sm" variant="outline">
              Canon v4
            </Badge>
          </Group>
        </Transition>
        <Box ml="auto">
          <Button size="sm" variant="gradient">
            Publicar
          </Button>
        </Box>
      </Box>
      <Segment defaultValue="canon" fullWidth overflowMode="scroll" variant="light" w="100%">
        <Segment.Control aria-label="Pestañas de la ficha">
          <Segment.Control.Item value="canon">Canon</Segment.Control.Item>
          <Segment.Control.Item value="gallery">Galería</Segment.Control.Item>
          <Segment.Control.Item value="stats">Estadísticas</Segment.Control.Item>
          <Segment.Control.Item value="options">Opciones</Segment.Control.Item>
        </Segment.Control>
      </Segment>
    </GlassSurface>
  );
}

function Screen(): ReactElement {
  return (
    <AppShell
      sidebar={
        <AppShell.Sidebar aria-label="Navegación principal">
          <AppShell.Sidebar.Body>
            <AppShell.Links title="Estudio">
              <AppShell.Link
                active
                href="#avatars"
                label={<AppShell.Label>Avatares</AppShell.Label>}
              />
              <AppShell.Link href="#gallery" label={<AppShell.Label>Galería</AppShell.Label>} />
            </AppShell.Links>
          </AppShell.Sidebar.Body>
        </AppShell.Sidebar>
      }
      mainProps={{ direction: "column", overflow: "hidden" }}
      overflow="hidden"
    >
      <AppShell.Scroll direction="column" display="flex" flex={1}>
        <AppShell.Section
          aria-label="Rose"
          hanging={<SheetHeader />}
          hangingHeight={SHEET_HEADER_HEIGHT}
          position="sticky"
          top={0}
          z="sticky"
        >
          <AppShell.Header
            order={1}
            subtitle="Faltan dos anclas para poder producir"
            subtitleProps={{ c: "text.muted", fz: "body3" }}
            title="Rose"
            titleProps={{ fz: "h5" }}
          />
        </AppShell.Section>
        <Box direction="column" display="flex" gap="md" p={{ base: "sm", tablet: "lg" }}>
          {Array.from({ length: 14 }, (_, index) => (
            <Card key={index} p="lg" r="xl" variant="glass" withBorder>
              <Text fw="semibold">Bloque {index + 1}</Text>
              <Text c="text.muted" fz="body2">
                Desplaza: la banda de arriba se encoge sin que este bloque se mueva, porque el
                espaciador que reserva su alto no cambia.
              </Text>
            </Card>
          ))}
        </Box>
      </AppShell.Scroll>
    </AppShell>
  );
}

export const Default: Story = { name: "Arriba y encogida", render: () => <Screen /> };
export const Composition: Story = { ...Default };
