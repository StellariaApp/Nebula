import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactElement } from "react";

import { Carousel } from "@stellaria/nebula-web/carousel";
import {
  ActionIcon,
  Affix,
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  Flex,
  GlassSurface,
  Group,
  Progress,
  Text,
  Tooltip,
  VisuallyHidden,
} from "@stellaria/nebula-web";

import { AVATAR_ACTIVO, Escena, Icon, Rosets, Rotulo, TARIFA } from "../fixtures/rosette.js";

/* ── El feed ──────────────────────────────────────────────────────────────────
 * Es el único sitio donde el carril estorba, así que SALE del AppShell: ocupa la
 * ventana entera y se vuelve por una sola salida siempre visible. No es una
 * pantalla más del panel, es un modo.                                          */

interface Pieza {
  id: string;
  estudio: string;
  avatar: string;
  accion: string;
  duracion: string;
  escalon: string;
}

const PIEZAS: Pieza[] = [
  {
    id: "v1",
    estudio: "Casa Rosette",
    avatar: "Rose Aldana",
    accion: "De pie junto a la barandilla",
    duracion: "0:05",
    escalon: "A",
  },
  {
    id: "v2",
    estudio: "Estudio Lumen",
    avatar: "Mara Iriarte",
    accion: "Caminando descalza por el pasillo",
    duracion: "0:10",
    escalon: "A",
  },
  {
    id: "v3",
    estudio: "Casa Rosette",
    avatar: "Vera Solís",
    accion: "Sentada leyendo junto a la ventana",
    duracion: "0:05",
    escalon: "A",
  },
  {
    id: "v4",
    estudio: "Taller Nueve",
    avatar: "Ada Winter",
    accion: "Apoyada en el marco de la puerta",
    duracion: "0:15",
    escalon: "A",
  },
];

function Acciones({ onGenerar }: { onGenerar: () => void }): ReactElement {
  return (
    <Flex direction="column" gap="md" align="center">
      {[
        { icon: "heart" as const, label: "Me gusta" },
        { icon: "bookmark" as const, label: "Guardar" },
        { icon: "share" as const, label: "Compartir" },
      ].map((accion) => (
        <Tooltip
          key={accion.label}
          label={accion.label}
          placement="left"
          trigger={
            <ActionIcon variant="glass" glass="strong" size="md" r="full" aria-label={accion.label}>
              <Icon name={accion.icon} />
            </ActionIcon>
          }
        />
      ))}
      <Tooltip
        label="Generar algo así con tu avatar"
        placement="left"
        trigger={
          <ActionIcon
            variant="gradient"
            size="lg"
            r="full"
            aria-label="Generar algo así con tu avatar"
            onPress={onGenerar}
          >
            <Icon name="spark" />
          </ActionIcon>
        }
      />
    </Flex>
  );
}

/* ── La base del reproductor en línea ─────────────────────────────────────────
 * ENTRA AL CATÁLOGO — decisión del titular, 06/08/2026. Aquí va maquetada la
 * base para poder discutirla contra algo, no una implementación: el vídeo son
 * marcadores de posición.
 *
 * El contrato que propone esta maqueta, y en qué se diferencia de `Player`:
 *
 *   src        el medio
 *   active     si esta pieza es la que se está viendo. Es LA prop que Player no
 *              tiene y la que hace falta: el feed monta varias y solo una suena
 *   muted      arranca en silencio, porque un feed que suena solo no se tolera
 *   loop       la pieza se repite hasta que el usuario pasa
 *   poster     el fotograma mientras no está activa, para no descargar N vídeos
 *   onProgress para pintar la barra fina de arriba
 *
 * `Player` seguirá siendo el overlay para reproducir UN medio concreto —tiene
 * `opened`/`onClose` y cromado de diálogo—, y esto es lo otro: un elemento de
 * contenido que vive dentro de una lista. Son dos componentes, no dos variantes.
 *
 * Lo que queda por decidir al construirlo: si `active` lo pone el consumidor —lo
 * que hace aquí el índice del Carousel— o si el componente lo deduce con un
 * IntersectionObserver. Lo segundo es más cómodo y lo primero es más honesto con
 * un carrusel que ya sabe cuál es su slide.                                     */

interface ReproductorProps {
  active: boolean;
  duracion: string;
  progreso: number;
}

function ReproductorEnLinea({ active, duracion, progreso }: ReproductorProps): ReactElement {
  return (
    <Box w="100%" h="100%" position="relative" bg="surface.sunken">
      <Box
        w="100%"
        h="100%"
        display="flex"
        align="center"
        justify="center"
        direction="column"
        gap="xs"
      >
        <Box c="text.disabled" display="flex">
          <Icon name={active ? "video" : "play"} size={32} />
        </Box>
        <Text fz="caption" c="text.muted">
          Marcador de posición · {duracion}
        </Text>
        <Text fz="caption" c="text.muted">
          {active ? "activa · en silencio y en bucle" : "en cartel, sin descargar"}
        </Text>
      </Box>

      <Box position="absolute" style={{ top: 0, left: 0, right: 0 }}>
        <Progress value={active ? progreso : 0} size="xs" radius={0} label="Progreso de la pieza" />
      </Box>

      <Box position="absolute" style={{ left: 16, top: 16 }}>
        <ActionIcon
          variant="glass"
          glass="strong"
          size="sm"
          r="full"
          aria-label="Activar el sonido"
        >
          <Icon name="volume" />
        </ActionIcon>
      </Box>
    </Box>
  );
}

function Pieza({
  pieza,
  activa,
  onGenerar,
}: {
  pieza: Pieza;
  activa: boolean;
  onGenerar: () => void;
}): ReactElement {
  return (
    <Box h="100dvh" position="relative" display="flex" align="center" justify="center">
      <ReproductorEnLinea active={activa} duracion={pieza.duracion} progreso={38} />

      <Box position="absolute" style={{ right: 16, bottom: 120 }}>
        <Acciones onGenerar={onGenerar} />
      </Box>

      <Box position="absolute" style={{ left: 16, right: 88, bottom: 32 }}>
        <GlassSurface level="strong" r="lg" withBorder p="md">
          <Flex align="center" gap="sm" miw={0}>
            <Avatar name={pieza.avatar} size="sm" radius="full" />
            <Box miw={0} style={{ flex: 1 }}>
              <Text fz="body3" fw="semibold" truncate>
                {pieza.avatar}
              </Text>
              <Text fz="caption" c="text.muted" truncate>
                {pieza.estudio}
              </Text>
            </Box>
            <Badge size="xs" variant="light" color="success">
              escalón {pieza.escalon}
            </Badge>
          </Flex>
          <Text fz="body3" mt="xs">
            {pieza.accion}
          </Text>
        </GlassSurface>
      </Box>
    </Box>
  );
}

function Feed(): ReactElement {
  const [generar, set_generar] = useState(false);
  const [indice, set_indice] = useState(0);

  return (
    <Box h="100dvh" bg="surface.base" position="relative" overflow="hidden">
      <VisuallyHidden>
        <h1>Feed de vídeo — exploración fuera del alcance</h1>
      </VisuallyHidden>

      <Carousel
        items={PIEZAS}
        getKey={(pieza) => pieza.id}
        axis="y"
        slideSize="100%"
        gap="none"
        withControls
        withIndicators={false}
        label="Feed de vídeo"
        h="100dvh"
        index={indice}
        onIndexChange={set_indice}
        renderItem={(pieza, i) => (
          <Pieza
            pieza={pieza}
            activa={i === indice}
            onGenerar={() => {
              set_generar(true);
            }}
          />
        )}
      />

      <Affix position={{ top: 16, left: 16 }} zIndex={20}>
        <Button size="sm" variant="glass" leftSection={<Icon name="arrow-left" />}>
          Salir del feed
        </Button>
      </Affix>

      <Affix position={{ top: 16, right: 16 }} zIndex={20}>
        <Badge variant="light" size="sm" color="warning">
          exploración · fuera del alcance del MVP
        </Badge>
      </Affix>

      <Drawer
        opened={generar}
        onClose={() => {
          set_generar(false);
        }}
        side="end"
        size={400}
        title="Generar algo así"
      >
        <Text fz="body3" c="text.secondary">
          Lo que viaja de la pieza que estabas viendo es <strong>la acción</strong>, que es curada y
          no lleva nada de nadie. No viaja el avatar, ni su canon, ni sus anclas.
        </Text>

        <Rotulo mt="md">Con tu avatar</Rotulo>
        <Flex align="center" gap="sm">
          <Avatar name={AVATAR_ACTIVO.nombre} size="sm" radius="full" />
          <Box miw={0}>
            <Text fz="body3" fw="semibold" truncate>
              {AVATAR_ACTIVO.nombre}
            </Text>
            <Text fz="caption" c="text.muted" truncate>
              canon v{AVATAR_ACTIVO.canon} · techo {AVATAR_ACTIVO.techo}
            </Text>
          </Box>
        </Flex>

        <Rotulo mt="md">Coste</Rotulo>
        <Group gap="xs">
          <Badge variant="light" size="lg">
            {Rosets(TARIFA.video)}
          </Badge>
          <Text fz="caption" c="text.muted">
            imagen + vídeo, cobrados y mostrados por separado
          </Text>
        </Group>

        <Button fullWidth mt="md" rightSection={<Icon name="spark" />}>
          Generar
        </Button>

        <Alert variant="light" color="warning" mt="md" icon={<Icon name="warning" />}>
          El escalón de la acción se comprueba contra los tres techos —estudio, avatar y tu permiso—
          y gana el más restrictivo.
        </Alert>
      </Drawer>
    </Box>
  );
}

const meta: Meta = {
  title: "Patterns/Rosette/Feed",
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj;

/**
 * ⚠️ **Exploración fuera del alcance del MVP.** El feed no existe en `plan-demo`.
 *
 * *Sale del AppShell, y es el único sitio donde eso está justificado.* Una pieza vertical a
 * pantalla completa con un carril al lado es una pieza vertical más pequeña. El carril no se
 * encoge: **desaparece**, y se vuelve por una sola salida fija arriba a la izquierda que está
 * siempre visible. No es una pantalla más del panel: es un modo, y por eso se entra y se sale en
 * vez de navegar.
 *
 * *El enlace entre consumir y crear, sin inventar modelo.* «Generar algo así» abre un cajón donde
 * lo que viaja de la pieza es **la acción** —curada, con su escalón declarado y observado— y no el
 * avatar de quien la publicó. Así el toque que va de ver a crear existe sin tocar el riesgo 1 ni la
 * propiedad del avatar. Que las piezas se puedan publicar sigue siendo pregunta abierta: ver
 * `Explorar`.
 *
 * *El reproductor en línea entra al catálogo* — decisión del titular, 06/08/2026. Aquí va
 * maquetada **la base**, para poder discutirla contra algo en vez de en abstracto: el vídeo son
 * marcadores de posición y lo que se propone es el contrato.
 *
 * La prop que lo separa de `Player` es **`active`**. Un feed monta varias piezas y solo una suena:
 * la activa reproduce en silencio y en bucle, y el resto se quedan en cartel sin descargar.
 * `Player` no la tiene porque no la necesita —es el overlay para reproducir **un** medio concreto,
 * con `opened`/`onClose` y cromado de diálogo—. Son dos componentes, no dos variantes del mismo.
 *
 * Lo que queda por decidir al construirlo: si `active` lo pone el consumidor —lo que hace aquí el
 * índice del `Carousel`— o si el componente lo deduce con un `IntersectionObserver`. Lo segundo es
 * más cómodo; lo primero es más honesto con un carrusel que ya sabe cuál es su slide.
 */
export const FeedVertical: Story = {
  name: "Vertical, fuera del AppShell",
  render: () => (
    <Escena>
      <Feed />
    </Escena>
  ),
};
