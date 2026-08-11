import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactElement } from "react";

import {
  Alert,
  AppShell,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Drawer,
  Flex,
  GlassSurface,
  Group,
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
 * Decisiones del titular, 06/08/2026: el avatar puede ser público o privado; si
 * es público, el estudio elige qué piezas suyas se ven; y aparte, decide si se
 * puede clonar. Así que aquí ya hay entidad pública que enseñar, y son tres
 * permisos distintos que la pantalla no puede mezclar:
 *
 *   público  → aparece en esta pantalla
 *   piezas   → cuáles de sus imágenes, vídeos y audios se ven
 *   clonable → si otro estudio puede partir de su canon y sus anclas
 *
 * Un avatar público y no clonable es el caso normal, así que el botón de clonar
 * no puede ser el principal: el principal es usar su acción con TU avatar, que
 * no toca a nadie.                                                             */

interface AvatarPublico {
  id: string;
  nombre: string;
  estudio: string;
  techo: string;
  piezas: number;
  clonable: boolean;
  seguidores: string;
}

const PUBLICOS: AvatarPublico[] = [
  {
    id: "rose",
    nombre: "Rose Aldana",
    estudio: "Casa Rosette",
    techo: "D",
    piezas: 24,
    clonable: true,
    seguidores: "1.284",
  },
  {
    id: "mara",
    nombre: "Mara Iriarte",
    estudio: "Estudio Lumen",
    techo: "A",
    piezas: 41,
    clonable: false,
    seguidores: "973",
  },
  {
    id: "june",
    nombre: "June Petrova",
    estudio: "Taller Nueve",
    techo: "B",
    piezas: 12,
    clonable: true,
    seguidores: "2.110",
  },
  {
    id: "vera",
    nombre: "Vera Solís",
    estudio: "Casa Rosette",
    techo: "A",
    piezas: 9,
    clonable: false,
    seguidores: "640",
  },
];

interface AccionPublica {
  id: string;
  label: string;
  escalon: string;
  group: string;
  usos: number;
  suggestive: boolean;
}

const CATALOGO: AccionPublica[] = [
  {
    id: "c1",
    label: "De pie junto a la barandilla, mirando la ciudad",
    escalon: "A",
    group: "cuerpo entero frontal",
    usos: 1284,
    suggestive: false,
  },
  {
    id: "c2",
    label: "Sentada leyendo junto a la ventana",
    escalon: "A",
    group: "cuerpo entero perfil",
    usos: 973,
    suggestive: false,
  },
  {
    id: "c3",
    label: "Ajustándose el puño de la camisa",
    escalon: "A",
    group: "plano de manos",
    usos: 640,
    suggestive: true,
  },
  {
    id: "c4",
    label: "Retrato de tres cuartos con luz lateral",
    escalon: "A",
    group: "plano de cara",
    usos: 2110,
    suggestive: false,
  },
  {
    id: "c5",
    label: "Caminando descalza por el pasillo",
    escalon: "A",
    group: "cuerpo entero frontal",
    usos: 415,
    suggestive: false,
  },
  {
    id: "c6",
    label: "Apoyada en el marco de la puerta",
    escalon: "A",
    group: "cuerpo entero perfil",
    usos: 802,
    suggestive: true,
  },
];

function TarjetaAvatar({
  avatar,
  onClonar,
}: {
  avatar: AvatarPublico;
  onClonar: (avatar: AvatarPublico) => void;
}): ReactElement {
  return (
    <Card withBorder r="lg" padding="none" overflow="hidden">
      <Placeholder ratio={4 / 3} />
      <Box p="sm">
        <Flex align="center" gap="sm" miw={0}>
          <Avatar name={avatar.nombre} size="sm" radius="full" />
          <Box miw={0} style={{ flex: 1 }}>
            <Text fz="body3" fw="semibold" truncate>
              {avatar.nombre}
            </Text>
            <Text fz="caption" c="text.muted" truncate>
              {avatar.estudio}
            </Text>
          </Box>
        </Flex>

        <Flex align="center" gap="xxs" wrap="wrap" mt="xs">
          <Badge size="xs" variant="outline" color="gray">
            {avatar.piezas} piezas públicas
          </Badge>
          <Badge size="xs" variant="outline" color="gray">
            techo {avatar.techo}
          </Badge>
        </Flex>

        {avatar.clonable ? (
          <Button
            size="xs"
            variant="glass"
            fullWidth
            mt="sm"
            onPress={() => {
              onClonar(avatar);
            }}
            rightSection={<Icon name="copy" />}
          >
            Clonar como punto de partida
          </Button>
        ) : (
          <Tooltip
            label="Su estudio no ha autorizado que se clone"
            trigger={
              <Box mt="sm">
                <Button size="xs" variant="ghost" fullWidth disabled>
                  No clonable
                </Button>
              </Box>
            }
          />
        )}
      </Box>
    </Card>
  );
}

function TarjetaAccion({ accion }: { accion: AccionPublica }): ReactElement {
  const coste = 3 * TARIFA.imagen;
  return (
    <Card withBorder r="lg" padding="none" overflow="hidden">
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

/* ── Clonar ───────────────────────────────────────────────────────────────────
 * Es la acción cara y la que toca a un tercero, así que no se hace de un clic:
 * dice qué se lleva, qué no, y qué cuesta.                                     */

function Clonar({
  avatar,
  onClose,
}: {
  avatar: AvatarPublico | null;
  onClose: () => void;
}): ReactElement | null {
  if (avatar === null) return null;
  const juego =
    avatar.techo === "A" || avatar.techo === "B" ? TARIFA.anclasBase : TARIFA.anclasDetalle;

  return (
    <Drawer opened onClose={onClose} side="end" size={440} title={`Clonar ${avatar.nombre}`}>
      <Text fz="body3" c="text.secondary">
        {avatar.estudio} ha autorizado que este avatar se clone. El clon nacerá en{" "}
        <strong>Casa Rosette</strong> y será tuyo desde ese momento.
      </Text>

      <Rotulo mt="md">Qué se lleva</Rotulo>
      <Box display="flex" direction="column" gap="xxs">
        {[
          { que: "El canon", detalle: "identidad, físico, voz y personalidad" },
          { que: "El techo declarado", detalle: `${avatar.techo}, y podrás bajarlo` },
        ].map((linea) => (
          <Flex key={linea.que} align="center" gap="sm">
            <Box c="success.500" display="flex">
              <Icon name="check" size={14} />
            </Box>
            <Text fz="body3">{linea.que}</Text>
            <Text fz="caption" c="text.muted" truncate>
              {linea.detalle}
            </Text>
          </Flex>
        ))}
      </Box>

      <Rotulo mt="md">Qué no</Rotulo>
      <Box display="flex" direction="column" gap="xxs">
        {[
          { que: "Sus activos", detalle: "las piezas publicadas siguen siendo suyas" },
          { que: "Su juego de anclas", detalle: "el tuyo se genera de nuevo" },
          { que: "Sus chats y su memoria", detalle: "son de cada miembro de su estudio" },
        ].map((linea) => (
          <Flex key={linea.que} align="center" gap="sm">
            <Box c="text.disabled" display="flex">
              <Icon name="close" size={14} />
            </Box>
            <Text fz="body3">{linea.que}</Text>
            <Text fz="caption" c="text.muted" truncate>
              {linea.detalle}
            </Text>
          </Flex>
        ))}
      </Box>

      <Divider my="md" />

      <Flex align="center" justify="space-between" gap="sm">
        <Box miw={0}>
          <Text fz="body3" fw="semibold">
            Coste del clon
          </Text>
          <Text fz="caption" c="text.muted">
            juego de anclas + prueba de identidad
          </Text>
        </Box>
        <Badge variant="light" size="lg">
          {Rosets(juego + TARIFA.pruebaIdentidad)}
        </Badge>
      </Flex>

      <Alert
        variant="light"
        color="warning"
        mt="md"
        icon={<Icon name="warning" />}
        title="Por qué el clon no hereda las anclas"
      >
        Un duplicado <em>dentro</em> del estudio sí las hereda, y por eso sale gratis. Aquí no:
        heredarlas pondría la identidad en píxel de {avatar.nombre} —construida con fotos que se
        consintieron en {avatar.estudio}— dentro de otro estudio. El clon parte de su canon y
        <strong> genera su propia identidad</strong>.
      </Alert>

      <Button fullWidth mt="md" rightSection={<Icon name="copy" />}>
        Clonar · {Rosets(juego + TARIFA.pruebaIdentidad)}
      </Button>
    </Drawer>
  );
}

function Explorar({ panel = "avatares" }: { panel?: string | undefined }): ReactElement {
  const [que, set_que] = useState(panel);
  const [clonando, set_clonando] = useState<AvatarPublico | null>(null);

  return (
    <Shell active="explorar" title="Explorar — Rosette">
      <AppShell.Section aria-label="Explorar">
        <AppShell.Header
          sticky
          title="Explorar"
          subtitle="Todos los avatares públicos, y el banco de acciones curado"
          actions={
            <Group gap="sm">
              <Badge variant="light" size="sm" color="warning">
                fuera del alcance del MVP
              </Badge>
              <Button size="sm" rightSection={<Icon name="plus" />}>
                Crear avatar
              </Button>
            </Group>
          }
        />
        <AppShell.Subbar sticky>
          <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
            <Segment value={que} onChange={set_que} size="sm">
              <Segment.Control aria-label="Qué se explora">
                <Segment.Control.Item value="avatares">Avatares</Segment.Control.Item>
                <Segment.Control.Item value="acciones">Acciones</Segment.Control.Item>
              </Segment.Control>
            </Segment>
            <SearchInput placeholder="Buscar" aria-label="Buscar en Explorar" size="sm" />
          </Flex>
        </AppShell.Subbar>
        <AppShell.Content>
          <Alert
            variant="light"
            color="warning"
            icon={<Icon name="warning" />}
            title="Esta pantalla es la raíz, y no existe en plan-demo"
            mb="md"
          >
            Decisión del titular, 06/08/2026:{" "}
            <strong>la puerta de Rosette es el catálogo público</strong>, no un panel del estudio.
            Pero Explorar es territorio de <strong>plan-produccion</strong>, así que{" "}
            <strong>mientras no exista, la raíz cae a Avatares</strong> —donde ahora vive «lo que te
            espera»— y esta pantalla llega con el producto público.
          </Alert>

          <SimpleGrid cols={Cols({ base: 1, laptop: 3 })} spacing="md">
            <Box style={{ gridColumn: "span 2" }} miw={0}>
              {que === "avatares" ? (
                <>
                  <Rotulo>Avatares públicos</Rotulo>
                  <SimpleGrid cols={Cols({ base: 1, tablet: 2, wide: 3 })} spacing="md">
                    {PUBLICOS.map((avatar) => (
                      <TarjetaAvatar key={avatar.id} avatar={avatar} onClonar={set_clonando} />
                    ))}
                  </SimpleGrid>
                </>
              ) : (
                <>
                  <Rotulo>Acciones del banco global</Rotulo>
                  <SimpleGrid cols={Cols({ base: 2, tablet: 3, wide: 4 })} spacing="md">
                    {CATALOGO.map((accion) => (
                      <TarjetaAccion key={accion.id} accion={accion} />
                    ))}
                  </SimpleGrid>
                </>
              )}
            </Box>

            <Box display="flex" direction="column" gap="md" miw={0}>
              <GlassSurface level="subtle" r="lg" withBorder p="md">
                <Rotulo>Tres permisos, no uno</Rotulo>
                <Box display="flex" direction="column" gap="sm">
                  {[
                    {
                      que: "Público",
                      texto: "Decide si el avatar aparece aquí. Nada más.",
                    },
                    {
                      que: "Piezas publicadas",
                      texto:
                        "Cuáles de sus imágenes, vídeos y audios se ven. Se marcan una a una en su galería, así que lo que no se marca no sale aunque el avatar sea público.",
                    },
                    {
                      que: "Clonable",
                      texto:
                        "Si otro estudio puede partir de su canon. Se autoriza aparte: ser público no lo implica, y el caso normal es público y no clonable.",
                    },
                  ].map((linea) => (
                    <Box key={linea.que}>
                      <Text fz="body3" fw="semibold">
                        {linea.que}
                      </Text>
                      <Text fz="caption" c="text.muted">
                        {linea.texto}
                      </Text>
                    </Box>
                  ))}
                </Box>
              </GlassSurface>

              <GlassSurface level="subtle" r="lg" withBorder p="md">
                <Rotulo>La acción principal no es clonar</Rotulo>
                <Text fz="body3" c="text.secondary">
                  Clonar cuesta 110 o 160 rosets y se lleva el canon de otro. Usar una{" "}
                  <strong>acción</strong> del banco con tu propio avatar cuesta{" "}
                  {Rosets(3 * TARIFA.imagen)}, no toca a nadie y resuelve lo mismo casi siempre:
                  «quiero algo así».
                </Text>
                <Divider my="sm" />
                <Text fz="caption" c="text.muted">
                  Por eso las acciones tienen su propia pestaña y su botón es el primario. Clonar
                  aparece solo donde el estudio lo autorizó, y con una pantalla que dice qué se
                  lleva y qué no.
                </Text>
              </GlassSurface>

              <GlassSurface level="subtle" r="lg" withBorder p="md">
                <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
                  <Rotulo>Lo que sigue abierto</Rotulo>
                  <Badge variant="light" size="sm" color="error">
                    bloqueo externo
                  </Badge>
                </Flex>
                <Text fz="caption" c="text.muted">
                  Publicar hacia fuera arrastra la verificación de edad y la política escrita del
                  proveedor, que son plazo externo y no código. Y el consentimiento del riesgo 1 se
                  aceptó por estudio: la cadena que ata cada activo a su aceptación tiene que poder
                  reconstruirse también para las piezas publicadas.
                </Text>
              </GlassSurface>
            </Box>
          </SimpleGrid>
        </AppShell.Content>
      </AppShell.Section>

      <Clonar
        avatar={clonando}
        onClose={() => {
          set_clonando(null);
        }}
      />
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
 * **La raíz de Rosette** — decisión del titular, 06/08/2026. Se retiró Home: en un producto que
 * también se consume, la puerta es el catálogo público y no un panel del estudio. Los dos grupos
 * del carril ya lo decían —*Rosette se consume, el estudio produce*— y ahora la primera pantalla
 * lo dice también.
 *
 * *Lo que Home cargaba no se pierde.* «Lo que te espera» —sin revisar, trabajos en curso, el
 * avatar a medias— se muda a `Avatares`, que es donde se actúa sobre ello, y **la cuenta de sin
 * revisar viaja en el propio carril**: se ve desde aquí, desde el lado público, sin volver al
 * estudio.
 *
 * ⚠️ **Y esta pantalla no existe en `plan-demo`.** Es territorio de `plan-produccion`, así que
 * mientras no exista **la raíz cae a `Avatares`**. La decisión de producto se mantiene; lo que se
 * mueve es cuándo entra.
 *
 * *Son tres permisos y la pantalla no los mezcla.* **Público** decide si el avatar aparece aquí.
 * **Las piezas publicadas** se marcan una a una en su galería, así que lo que no se marca no sale
 * aunque el avatar sea público. Y **clonable** se autoriza aparte: ser público no lo implica, y el
 * caso normal —público y no clonable— tiene su botón deshabilitado con el motivo, no escondido.
 *
 * *La acción principal no es clonar, y eso es una decisión de jerarquía.* Clonar cuesta 110 o 160
 * rosets y se lleva el canon de otro estudio. Usar una **acción** del banco con tu propio avatar
 * cuesta 30, no toca a nadie, y resuelve lo mismo casi siempre: «quiero algo así». Por eso las
 * acciones tienen pestaña propia y su botón es el primario.
 */
export const AvataresPublicos: Story = {
  name: "Avatares públicos y acciones",
  render: () => (
    <Escena>
      <Explorar />
    </Escena>
  ),
};

/**
 * El catálogo curado, que es la vía barata para «generar algo así». Las acciones de scope
 * **global** no llevan las fotos de nadie, ya declaran su escalón y ya declaran qué regiones
 * enseñan, así que se pueden mostrar en público sin tocar el consentimiento — y el enlace entre
 * consumir y crear sale gratis: usar la acción con **tu** avatar, con el coste delante y el
 * escalón comprobado contra tus tres techos.
 */
export const CatalogoPublico: Story = {
  name: "El banco de acciones",
  render: () => (
    <Escena>
      <Explorar panel="acciones" />
    </Escena>
  ),
};
