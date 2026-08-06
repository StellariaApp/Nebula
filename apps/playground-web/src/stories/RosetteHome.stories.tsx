import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement } from "react";

import {
  Alert,
  AppShell,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  GlassSurface,
  Group,
  Progress,
  SimpleGrid,
  StatusBadge,
  Text,
} from "@stellaria/nebula-web";

import {
  AVATARES,
  Cols,
  Escena,
  ESTADO_AVATAR,
  Icon,
  Miles,
  PLAN,
  Placeholder,
  Rosets,
  Rotulo,
  SALDO,
  Shell,
} from "../fixtures/rosette.js";

/* ── La portada ───────────────────────────────────────────────────────────────
 * Los dos grupos del carril dicen de qué va el producto —Rosette se consume, el
 * estudio produce— y Home es la bisagra. No es un tablero de métricas: es «qué
 * necesita de mí» arriba y «qué hay nuevo» debajo.
 *
 * Un tablero de métricas es el sitio donde va a parar todo lo que no encuentra
 * casa, y a las tres semanas nadie lo mira. Aquí solo entra lo accionable.     */

const PENDIENTES = AVATARES.filter((avatar) => avatar.cola > 0 || avatar.activos > 0).slice(0, 3);

const SIN_REVISAR = 14;
const EN_CURSO = SALDO.trabajosEnCurso;

function Pendiente({
  icono,
  titulo,
  detalle,
  accion,
  tono,
}: {
  icono: "check-square" | "loader" | "warning";
  titulo: string;
  detalle: string;
  accion: string;
  tono: "accent" | "info" | "warning";
}): ReactElement {
  return (
    <Card withBorder radius="lg" padding="none">
      <Box p="md">
        <Flex align="center" gap="sm" mb="xs">
          <Box c={`${tono}.600`} display="flex">
            <Icon name={icono} size={18} />
          </Box>
          <Text fz="body2" fw="semibold">
            {titulo}
          </Text>
        </Flex>
        <Text fz="caption" c="text.muted">
          {detalle}
        </Text>
        <Button size="xs" variant="ghost" mt="sm" rightSection={<Icon name="chevron-right" />}>
          {accion}
        </Button>
      </Box>
    </Card>
  );
}

function LoQueTeEspera(): ReactElement {
  return (
    <Box>
      <Rotulo>Lo que te espera</Rotulo>
      <SimpleGrid cols={Cols({ base: 1, tablet: 3 })} spacing="md">
        <Pendiente
          icono="check-square"
          tono="accent"
          titulo={`${String(SIN_REVISAR)} candidatas sin revisar`}
          detalle="En Rose Aldana y en Nadia Ortiz. Se revisan sin ratón: 40 caben en 15 minutos."
          accion="Revisar"
        />
        <Pendiente
          icono="loader"
          tono="info"
          titulo={`${String(EN_CURSO)} trabajos en curso`}
          detalle={`De los ${String(PLAN.trabajos)} que permite el plan ${PLAN.nombre}. Al terminar aparecen para revisar.`}
          accion="Ver la cola"
        />
        <Pendiente
          icono="warning"
          tono="warning"
          titulo="1 avatar a medias"
          detalle="Nadia Ortiz tiene 8 de 9 anclas: el ancla dorsal salió contradicha y hay que rehacerla."
          accion="Terminar Nadia Ortiz"
        />
      </SimpleGrid>
    </Box>
  );
}

function TusAvatares(): ReactElement {
  return (
    <Box>
      <Flex align="center" justify="space-between" gap="sm" wrap="wrap" mb="xs">
        <Rotulo>Tus avatares</Rotulo>
        <Button size="xs" variant="ghost" rightSection={<Icon name="chevron-right" />}>
          Ver todos
        </Button>
      </Flex>
      <SimpleGrid cols={Cols({ base: 1, tablet: 3 })} spacing="md">
        {PENDIENTES.map((avatar) => (
          <Card
            key={avatar.id}
            withBorder
            radius="lg"
            padding="none"
            overflow="hidden"
            interactive
            href="#avatar"
          >
            <Flex align="center" gap="md" p="sm">
              <Avatar name={avatar.nombre} size="md" radius="md" />
              <Box miw={0} style={{ flex: 1 }}>
                <Text fz="body3" fw="semibold" truncate>
                  {avatar.nombre}
                </Text>
                <Text fz="caption" c="text.muted" truncate>
                  canon v{avatar.canon} · {avatar.activos} activos
                </Text>
              </Box>
              <StatusBadge status={avatar.estado} map={ESTADO_AVATAR} size="xs" />
            </Flex>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}

function Saldo(): ReactElement {
  const usado = Math.round((SALDO.gastadoCiclo / PLAN.rosetsMes) * 100);
  return (
    <GlassSurface level="subtle" radius="lg" withBorder p="md">
      <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
        <Rotulo>Saldo</Rotulo>
        <Badge variant="light" size="sm">
          plan {PLAN.nombre}
        </Badge>
      </Flex>
      <Text fz="h4" fw="bold" lh="tight">
        {Rosets(SALDO.rosets)}
      </Text>
      <Progress value={usado} size="xs" mt="xs" label="Consumo del ciclo" />
      <Text fz="caption" c="text.muted" mt="xxs">
        {usado} % del ciclo consumido · {Miles(SALDO.retenido)} retenidos por trabajos en vuelo
      </Text>
      <Divider my="md" />
      <Text fz="caption" c="text.muted">
        Con este saldo te quedan unas <strong>{Miles(Math.floor(SALDO.rosets / 10))} imágenes</strong>,
        o un avatar nuevo con techo A y aún sobra.
      </Text>
      <Button size="sm" variant="ghost" fullWidth mt="sm">
        Saldo y gasto
      </Button>
    </GlassSurface>
  );
}

function Descubrir(): ReactElement {
  return (
    <Box>
      <Flex align="center" justify="space-between" gap="sm" wrap="wrap" mb="xs">
        <Rotulo>Nuevo en Rosette</Rotulo>
        <Badge variant="light" size="sm" color="warning">
          fuera del alcance del MVP
        </Badge>
      </Flex>
      <SimpleGrid cols={Cols({ base: 2, tablet: 4, laptop: 6 })} spacing="md">
        {Array.from({ length: 6 }, (_, index) => (
          <Card key={index} withBorder radius="md" padding="none" overflow="hidden">
            <Placeholder ratio={3 / 4} />
            <Box p="xs">
              <Text fz="caption" c="text.muted" truncate>
                Acción curada
              </Text>
            </Box>
          </Card>
        ))}
      </SimpleGrid>
      <Text fz="caption" c="text.muted" mt="xs">
        La mitad de abajo de esta pantalla es el puente entre los dos grupos del carril: lo que se
        explora aquí se produce con un toque en el grupo de arriba.
      </Text>
    </Box>
  );
}

function Home(): ReactElement {
  return (
    <Shell active="home" title="Home — Rosette">
      <AppShell.Section aria-label="Home">
        <AppShell.Header
          sticky
          title="Casa Rosette"
          subtitle="Lo que te espera hoy, y lo que hay nuevo"
          actions={
            <Group gap="sm">
              <Badge variant="light" size="sm">
                {Rosets(SALDO.rosets)}
              </Badge>
              <Button size="sm" rightSection={<Icon name="plus" />}>
                Crear avatar
              </Button>
            </Group>
          }
        />
        <AppShell.Content>
          {SALDO.gastadoCiclo / PLAN.rosetsMes >= 0.8 ? (
            <Alert variant="light" color="warning" icon={<Icon name="warning" />} mb="md">
              Has consumido el 80 % de la asignación del ciclo.
            </Alert>
          ) : null}

          <SimpleGrid cols={Cols({ base: 1, laptop: 4 })} spacing="md">
            <Box style={{ gridColumn: "span 3" }} miw={0}>
              <LoQueTeEspera />
              <Box mt="lg">
                <TusAvatares />
              </Box>
            </Box>
            <Saldo />
          </SimpleGrid>

          <Box mt="lg">
            <Descubrir />
          </Box>
        </AppShell.Content>
      </AppShell.Section>
    </Shell>
  );
}

const meta: Meta = {
  title: "Patterns/Rosette/Home",
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj;

/**
 * **La portada, y la bisagra entre los dos grupos del carril.** Los grupos que fijó el titular
 * —`Rosette: Home · Explorar · Feed` y `Studio: Avatares · Saldo y gasto · Usuarios`— dicen algo
 * sobre el producto: **Rosette se consume y el estudio produce**. Home es donde las dos mitades se
 * tocan: arriba lo que necesita de ti, abajo lo que hay nuevo.
 *
 * *Lo que NO es.* Un tablero de métricas. Ese es el sitio al que va a parar todo lo que no
 * encuentra casa, y a las tres semanas nadie lo mira. Aquí solo entra lo accionable, y cada
 * tarjeta lleva el verbo de lo que hay que hacer: revisar, ver la cola, terminar a Nadia.
 *
 * *Absorbe el contador de revisión.* Antes la revisión era una entrada de carril; ahora es un modo
 * al que se entra desde un avatar, así que el número de candidatas sin revisar tiene que vivir
 * donde se mira al empezar el día. Es esta pantalla.
 *
 * *Y el saldo aparece dos veces a propósito*: la cifra en el pie del carril, para no perderla nunca
 * de vista, y aquí traducida a lo único que le importa a quien produce —**cuántas imágenes te
 * quedan**—. Un número de rosets no dice nada por sí solo.
 */
export const Portada: Story = {
  name: "Lo que te espera y lo que hay nuevo",
  render: () => (
    <Escena>
      <Home />
    </Escena>
  ),
};
