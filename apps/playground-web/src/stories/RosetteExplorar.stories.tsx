import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactElement } from "react";

import {
  Alert,
  AppShell,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  GlassSurface,
  SearchInput,
  Segment,
  SimpleGrid,
  Text,
  Tooltip,
} from "@stellaria/nebula-web";

import {
  AVATAR_ACTIVO,
  Cols,
  Escena,
  Icon,
  Placeholder,
  Rosets,
  Rotulo,
  Shell,
  TARIFA,
} from "../fixtures/rosette.js";

/* ── Qué se explora ───────────────────────────────────────────────────────────
 * El banco de acciones con scope global: lo curamos nosotros, no lleva las fotos
 * de nadie, y «generar algo así» se traduce sin inventar modelo — es usar esa
 * acción con TU avatar. Explorar avatares ajenos no está propuesto: choca con el
 * riesgo 1 y con que el avatar cuelga del estudio.                              */

interface AccionPublica {
  id: string;
  label: string;
  escalon: string;
  group: string;
  usos: number;
  suggestive: boolean;
}

const CATALOGO: AccionPublica[] = [
  { id: "c1", label: "De pie junto a la barandilla, mirando la ciudad", escalon: "A", group: "cuerpo entero frontal", usos: 1284, suggestive: false },
  { id: "c2", label: "Sentada leyendo junto a la ventana", escalon: "A", group: "cuerpo entero perfil", usos: 973, suggestive: false },
  { id: "c3", label: "Ajustándose el puño de la camisa", escalon: "A", group: "plano de manos", usos: 640, suggestive: true },
  { id: "c4", label: "Retrato de tres cuartos con luz lateral", escalon: "A", group: "plano de cara", usos: 2110, suggestive: false },
  { id: "c5", label: "Caminando descalza por el pasillo", escalon: "A", group: "cuerpo entero frontal", usos: 415, suggestive: false },
  { id: "c6", label: "Apoyada en el marco de la puerta", escalon: "A", group: "cuerpo entero perfil", usos: 802, suggestive: true },
  { id: "c7", label: "Manos sobre la encimera, plano cerrado", escalon: "A", group: "plano de manos", usos: 233, suggestive: false },
  { id: "c8", label: "De espaldas mirando por la ventana", escalon: "A", group: "cuerpo entero dorsal", usos: 561, suggestive: false },
];

function TarjetaAccion({ accion }: { accion: AccionPublica }): ReactElement {
  const coste = 3 * TARIFA.imagen;
  return (
    <Card withBorder radius="lg" padding="none" overflow="hidden">
      <Placeholder ratio={3 / 4} label="Ejemplo curado" />
      <Box p="sm">
        <Flex align="center" gap="xs" wrap="wrap" mb="xxs">
          <Badge size="xs" variant="light" color="success">
            escalón {accion.escalon}
          </Badge>
          {accion.suggestive ? (
            <Tooltip
              label="Ordena el catálogo; no filtra por techo"
              trigger={
                <Badge size="xs" variant="outline" color="accent">
                  sugerente
                </Badge>
              }
            />
          ) : null}
          <Badge size="xs" variant="outline" color="gray">
            {accion.usos} usos
          </Badge>
        </Flex>
        <Text fz="body3" fw="semibold">
          {accion.label}
        </Text>
        <Text fz="caption" c="text.muted" truncate>
          {accion.group}
        </Text>
        <Button size="xs" fullWidth mt="sm" rightSection={<Icon name="spark" />}>
          Usar con {AVATAR_ACTIVO.nombre.split(" ")[0]} · {Rosets(coste)}
        </Button>
      </Box>
    </Card>
  );
}

const PREGUNTAS = [
  {
    titulo: "¿Se pueden publicar activos generados?",
    texto:
      "Un activo lleva dentro la identidad de un avatar, y ese avatar puede haberse construido con fotos de una persona real. Publicarlo saca esas fotos del estudio que aceptó los términos. El corpus registra la aceptación y la ata a cada avatar y a cada activo precisamente para poder responder a esto, pero no dice que se pueda publicar.",
  },
  {
    titulo: "¿Se puede clonar un avatar público como punto de partida?",
    texto:
      "Choca por dos lados. Con el riesgo 1, porque el consentimiento se aceptó en un estudio y el clon vive en otro. Y con el modelo, porque el avatar cuelga del estudio y no del usuario: un clon no es una copia de una ficha, es un juego de anclas nuevo y un canon nuevo, con su precio.",
  },
  {
    titulo: "¿Qué se ve de un estudio ajeno y qué no?",
    texto:
      "Hoy la respuesta honesta es «nada»: no hay ninguna entidad pública en el modelo. Antes de diseñar la pantalla hay que decidir si existe, y esa decisión trae verificación de edad y política de proveedor detrás.",
  },
];

function Explorar(): ReactElement {
  const [orden, set_orden] = useState("usadas");

  return (
    <Shell active="explorar" title="Explorar — Rosette">
      <AppShell.Section aria-label="Explorar">
        <AppShell.Header
          sticky
          title="Explorar"
          subtitle="El banco de acciones curado, no los avatares de otros estudios"
          actions={
            <Badge variant="light" size="sm" color="warning">
              exploración · fuera del alcance del MVP
            </Badge>
          }
        />
        <AppShell.Subbar sticky>
          <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
            <Segment value={orden} onChange={set_orden} size="sm">
              <Segment.Control aria-label="Cómo se ordena el catálogo">
                <Segment.Control.Item value="usadas">Más usadas</Segment.Control.Item>
                <Segment.Control.Item value="nuevas">Nuevas</Segment.Control.Item>
                <Segment.Control.Item value="encuadre">Por encuadre</Segment.Control.Item>
              </Segment.Control>
            </Segment>
            <SearchInput
              placeholder="Buscar una acción"
              aria-label="Buscar en el catálogo"
              size="sm"
            />
          </Flex>
        </AppShell.Subbar>
        <AppShell.Content>
          <Alert
            variant="light"
            color="warning"
            icon={<Icon name="warning" />}
            title="Esta pantalla no existe en plan-demo"
            mb="md"
          >
            Es territorio de <strong>plan-produccion</strong> y queda fuera del alcance del MVP. Va
            montada como exploración, con una propuesta concreta y con las preguntas que hay debajo
            sin responder: <strong>no se inventa modelo aquí</strong>.
          </Alert>

          <SimpleGrid cols={Cols({ base: 1, laptop: 3 })} spacing="md">
            <Box style={{ gridColumn: "span 2" }} miw={0}>
              <Rotulo>Acciones del banco global</Rotulo>
              <SimpleGrid cols={Cols({ base: 2, tablet: 3, wide: 4 })} spacing="md">
                {CATALOGO.map((accion) => (
                  <TarjetaAccion key={accion.id} accion={accion} />
                ))}
              </SimpleGrid>
            </Box>

            <Box display="flex" direction="column" gap="md" miw={0}>
              <GlassSurface level="subtle" radius="lg" withBorder p="md">
                <Rotulo>Por qué se explora esto y no avatares</Rotulo>
                <Text fz="body3" c="text.secondary">
                  Las acciones de scope <strong>global</strong> las curamos nosotros: no llevan las
                  fotos de nadie, ya declaran su escalón y ya declaran qué regiones enseñan. Son lo
                  único del modelo que se puede enseñar en público sin tocar el consentimiento.
                </Text>
                <Divider my="sm" />
                <Text fz="body3" c="text.secondary">
                  Y el enlace entre consumir y crear sale gratis: «generar algo así» no es clonar
                  nada, es <strong>usar esa acción con tu avatar</strong>, con su coste delante y su
                  escalón comprobado contra tus tres techos.
                </Text>
              </GlassSurface>

              <GlassSurface level="subtle" radius="lg" withBorder p="md">
                <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
                  <Rotulo>Preguntas para el propietario</Rotulo>
                  <Badge variant="light" size="sm" color="error">
                    sin responder
                  </Badge>
                </Flex>
                <Box display="flex" direction="column" gap="md">
                  {PREGUNTAS.map((pregunta) => (
                    <Box key={pregunta.titulo}>
                      <Text fz="body3" fw="semibold">
                        {pregunta.titulo}
                      </Text>
                      <Text fz="caption" c="text.muted">
                        {pregunta.texto}
                      </Text>
                    </Box>
                  ))}
                </Box>
              </GlassSurface>
            </Box>
          </SimpleGrid>
        </AppShell.Content>
      </AppShell.Section>
    </Shell>
  );
}

const meta: Meta = {
  title: "Patterns/Rosette/Explorar",
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj;

/**
 * ⚠️ **Exploración fuera del alcance del MVP.** Esta pantalla no existe en `plan-demo`: es
 * territorio de `plan-produccion`. Va montada porque el enlace entre consumir y crear es la
 * oportunidad más grande del producto, no porque el modelo la pida.
 *
 * *Lo que se propone, sin inventar modelo.* Explorar el **banco de acciones de scope global** —el
 * que curamos nosotros—, no los avatares de otros estudios. Esas acciones no llevan las fotos de
 * nadie, ya declaran su escalón y ya declaran qué regiones enseñan: son lo único del modelo que se
 * puede enseñar en público sin tocar el consentimiento. Y el enlace sale gratis: «generar algo
 * así» no es clonar nada, es **usar esa acción con tu avatar**, con el coste delante.
 *
 * *Lo que NO se propone, y por qué.* «Clonar un avatar público» choca por dos lados. Con el
 * **riesgo 1**, porque el consentimiento sobre las fotos se aceptó en un estudio y el clon viviría
 * en otro. Y con el modelo, porque el avatar **cuelga del estudio**, así que un clon no es copiar
 * una ficha: es un canon nuevo y un juego de anclas nuevo, con su precio. Queda escrito en la
 * pantalla como pregunta al propietario, no como funcionalidad.
 */
export const CatalogoPublico: Story = {
  name: "El banco global, no los avatares ajenos",
  render: () => (
    <Escena>
      <Explorar />
    </Escena>
  ),
};
