import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState, type ReactElement } from "react";

import { useBreakpointDown } from "@stellaria/nebula-hooks";

import {
  ActionIcon,
  Alert,
  AppShell,
  Avatar,
  Badge,
  Box,
  Card,
  Flex,
  GlassSurface,
  Kbd,
  SimpleGrid,
  StarField,
  StatusBadge,
  Text,
  VisuallyHidden,
} from "@stellaria/nebula-web";

import {
  AVATARES,
  Carril,
  Cols,
  Escena,
  ESTADO_AVATAR,
  Icon,
  Nombre,
  PieDeCarril,
  Placeholder,
  Rotulo,
  Shell,
} from "../fixtures/rosette.js";

/* ── Lo que se explica en la pantalla ─────────────────────────────────────────
 * El dato duro que decide esto: bajo tablet el propio Sidebar SE CONVIERTE en la
 * barra inferior fija. No hay componente de barra aparte, así que lo que se
 * ponga en el carril ES la barra inferior del móvil.                           */

function Explicacion({
  titulo,
  costes,
  recomendado,
}: {
  titulo: string;
  costes: { que: string; texto: string }[];
  recomendado: boolean;
}): ReactElement {
  return (
    <GlassSurface level="subtle" radius="lg" withBorder p="md">
      <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
        <Rotulo>{titulo}</Rotulo>
        <Badge variant="light" size="sm" color={recomendado ? "success" : "gray"}>
          {recomendado ? "recomendada" : "descartada"}
        </Badge>
      </Flex>
      <Box display="flex" direction="column" gap="sm">
        {costes.map((coste) => (
          <Box key={coste.que}>
            <Text fz="body3" fw="semibold">
              {coste.que}
            </Text>
            <Text fz="caption" c="text.muted">
              {coste.texto}
            </Text>
          </Box>
        ))}
      </Box>
    </GlassSurface>
  );
}

function BarraInferior({
  items,
  etiqueta,
}: {
  items: { label: string; icon: "user" | "grid" }[];
  etiqueta: string;
}): ReactElement {
  return (
    <Card withBorder radius="md" padding="none">
      <Flex
        component="nav"
        aria-label={etiqueta}
        tabIndex={0}
        align="center"
        gap="none"
        p="xxs"
        style={{ overflowX: "auto" }}
      >
        <Box
          component="button"
          type="button"
          aria-label="Cambiar de estudio"
          p="sm"
          bdc="border.default"
          style={{ border: "none", borderInlineEnd: "1px solid", background: "none", cursor: "pointer" }}
        >
          <Icon name="studio" size={18} />
        </Box>
        {items.map((item) => (
          <Box
            key={item.label}
            component="button"
            type="button"
            display="flex"
            direction="column"
            align="center"
            gap="xxs"
            px="sm"
            py="xs"
            miw={64}
            c="text.primary"
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
            <Icon name={item.icon} size={16} />
            <Text fz="caption" c="text.muted" ws="nowrap">
              {item.label}
            </Text>
          </Box>
        ))}
        <Box
          component="button"
          type="button"
          aria-label="Saldo"
          p="sm"
          bdc="border.default"
          style={{ border: "none", borderInlineStart: "1px solid", background: "none", cursor: "pointer" }}
        >
          <Icon name="roset" size={18} />
        </Box>
      </Flex>
    </Card>
  );
}

function Contenido(): ReactElement {
  return (
    <AppShell.Content>
      <Alert
        variant="light"
        color="info"
        icon={<Icon name="info" />}
        title="Bajo tablet, este carril ES la barra inferior"
        mb="md"
      >
        Verificado sobre el componente: por debajo del punto de ruptura <Kbd size="xs">tablet</Kbd>{" "}
        el propio <strong>AppShell.Sidebar</strong> se convierte en una barra fija abajo —la
        cabecera se ancla a la izquierda, el pie a la derecha y el cuerpo es el carrusel horizontal
        de en medio—. No hay un componente de barra inferior aparte, así que{" "}
        <strong>lo que se ponga aquí es la navegación del móvil</strong>.
      </Alert>

      <SimpleGrid cols={Cols({ base: 1, laptop: 2 })} spacing="md">
        <Explicacion
          titulo="A · Carril por secciones, con el avatar activo arriba"
          recomendado
          costes={[
            {
              que: "En móvil da cinco destinos y un contexto",
              texto:
                "La barra inferior queda: estudio anclado a la izquierda, avatar activo, Avatares, Revisión, Biblioteca, Saldo, Explorar, Feed, y el saldo anclado a la derecha.",
            },
            {
              que: "Escala con el estudio",
              texto:
                "Un estudio Studio tiene doce avatares. El carril no crece con ellos: crece la lista de Avatares, que es una pantalla.",
            },
            {
              que: "Cuesta un clic cambiar de avatar",
              texto:
                "Es el precio, y se paga poco: dentro del avatar todo son pestañas suyas, así que se cambia al empezar y no a mitad de tarea.",
            },
          ]}
        />
        <Explicacion
          titulo="B · Carril por avatares"
          recomendado={false}
          costes={[
            {
              que: "En móvil la barra inferior es una lista de caras",
              texto:
                "Con doce avatares, los destinos —Biblioteca, Saldo, Revisión— quedan fuera de pantalla a la derecha. La navegación del producto desaparece detrás de un carrusel.",
            },
            {
              que: "No escala",
              texto:
                "El carril crece con el catálogo del estudio, que es justo lo que un carril no puede hacer.",
            },
            {
              que: "Lo que sí acierta, y se conserva",
              texto:
                "Tener el avatar activo a la vista. Por eso en la A vive arriba del todo, como una entrada fija y no como una lista.",
            },
          ]}
        />
      </SimpleGrid>

      <Rotulo mt="lg">Cómo queda la barra inferior en cada una</Rotulo>
      <SimpleGrid cols={Cols({ base: 1, laptop: 2 })} spacing="md">
        <Box>
          <Text fz="caption" c="text.muted" mb="xs">
            A · destinos
          </Text>
          <BarraInferior
            etiqueta="Barra inferior de la opción A"
            items={[
              { label: "Rose", icon: "user" },
              { label: "Avatares", icon: "grid" },
              { label: "Revisión", icon: "grid" },
              { label: "Biblioteca", icon: "grid" },
              { label: "Saldo", icon: "grid" },
            ]}
          />
        </Box>
        <Box>
          <Text fz="caption" c="text.muted" mb="xs">
            B · caras
          </Text>
          <BarraInferior
            etiqueta="Barra inferior de la opción B"
            items={AVATARES.slice(0, 5).map((avatar) => ({
              label: avatar.nombre.split(" ")[0] ?? "",
              icon: "user" as const,
            }))}
          />
        </Box>
      </SimpleGrid>

      <Rotulo mt="lg">El conmutador de estudio</Rotulo>
      <SimpleGrid cols={Cols({ base: 1, laptop: 3 })} spacing="md">
        <Box style={{ gridColumn: "span 2" }} miw={0}>
          <GlassSurface level="subtle" radius="lg" withBorder p="md">
            <Text fz="body3" c="text.secondary">
              El usuario llega desde <strong>Polaris</strong>, que lee los servicios de la empresa y
              redirige, y puede pertenecer a más de un estudio. El conmutador vive en la{" "}
              <strong>cabecera del carril</strong> por dos razones que no son de gusto:
            </Text>
            <Box display="flex" direction="column" gap="sm" mt="sm">
              {[
                {
                  que: "Es lo único que no cambia de sitio",
                  texto:
                    "En escritorio está arriba del carril; en móvil, anclado a la izquierda de la barra inferior. En los dos casos es la esquina de «dónde estoy».",
                },
                {
                  que: "Cambiar de estudio lo cambia todo",
                  texto:
                    "Los avatares cuelgan del estudio, no del usuario. Un conmutador metido entre los enlaces parecería un filtro, y no lo es.",
                },
                {
                  que: "Es el mismo sitio que usa el Sidenav de The Film Vault",
                  texto:
                    "Ahí la cabecera del carril es la empresa —con su imagen de fondo— y pulsarla lleva al panel de empresas. La misma pieza sirve de identidad y de salida.",
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
        </Box>

        <GlassSurface level="subtle" radius="lg" withBorder p="md">
          <Rotulo>Estudios de este usuario</Rotulo>
          {[
            { nombre: "Casa Rosette", papel: "Propietario · plan Pro", activo: true },
            { nombre: "Estudio Lumen", papel: "Operador · plan Starter", activo: false },
          ].map((estudio) => (
            <Card key={estudio.nombre} withBorder radius="md" padding="none" mb="xs">
              <Flex align="center" gap="sm" p="sm">
                <Box c={estudio.activo ? "primary.600" : "text.muted"} display="flex">
                  <Icon name="studio" size={18} />
                </Box>
                <Box miw={0} style={{ flex: 1 }}>
                  <Text fz="body3" fw="semibold" truncate>
                    {estudio.nombre}
                  </Text>
                  <Text fz="caption" c="text.muted" truncate>
                    {estudio.papel}
                  </Text>
                </Box>
                {estudio.activo ? (
                  <Badge size="xs" variant="light">
                    activo
                  </Badge>
                ) : null}
              </Flex>
            </Card>
          ))}
          <Text fz="caption" c="text.muted" mt="sm">
            El servicio no es la suscripción: uno gobierna lo que se ve, la otra los rosets. Por eso
            el conmutador enseña el plan y no solo el nombre.
          </Text>
        </GlassSurface>
      </SimpleGrid>
    </AppShell.Content>
  );
}

function CarrilRecomendado(): ReactElement {
  return (
    <Shell active="avatares" title="El carril — Rosette">
      <AppShell.Section aria-label="El carril y el conmutador de estudio">
        <AppShell.Header
          sticky
          title="El carril"
          subtitle="Lo que se ponga aquí es la barra inferior del móvil"
        />
        <Contenido />
      </AppShell.Section>
    </Shell>
  );
}

/* ── La opción descartada, montada para poder mirarla ─────────────────────── */

function CarrilPorAvatares(): ReactElement {
  const scroller = useRef<HTMLElement | null>(null);
  const [mini, set_mini] = useState(false);
  const estrecho = useBreakpointDown("laptop");

  return (
    <AppShell
      mainRef={scroller}
      scrollShadowOffset={116}
      sidebarCollapsed={mini}
      backdrop={<StarField fixed parallax aurora density="sm" scroller={scroller} />}
      sidebar={
        <AppShell.Sidebar aria-label="Navegación por avatares" collapsed={mini} onCollapse={set_mini}>
          <AppShell.Sidebar.Header>
            <Box c="primary.600" display="flex">
              <Icon name="studio" size={24} />
            </Box>
            <AppShell.Label>
              <Text fz="body3" fw="bold" truncate>
                Casa Rosette
              </Text>
            </AppShell.Label>
          </AppShell.Sidebar.Header>

          <AppShell.Sidebar.Body>
            <AppShell.Links title="Avatares">
              {AVATARES.map((avatar, index) => (
                <AppShell.Link
                  key={avatar.id}
                  href={`#${avatar.id}`}
                  active={index === 0}
                  label={<AppShell.Label>{avatar.nombre}</AppShell.Label>}
                  rightSection={Nombre(avatar.nombre, estrecho || mini)}
                  leftSection={<Avatar name={avatar.nombre} size="sm" radius="full" />}
                />
              ))}
            </AppShell.Links>
            <AppShell.Links title="Estudio">
              {[
                { key: "biblioteca", label: "Biblioteca" },
                { key: "saldo", label: "Saldo" },
              ].map((enlace) => (
                <AppShell.Link
                  key={enlace.key}
                  href={`#${enlace.key}`}
                  label={<AppShell.Label>{enlace.label}</AppShell.Label>}
                  rightSection={Nombre(enlace.label, estrecho || mini)}
                  leftSection={<Icon name="grid" />}
                />
              ))}
            </AppShell.Links>
          </AppShell.Sidebar.Body>

          <PieDeCarril />
        </AppShell.Sidebar>
      }
    >
      <VisuallyHidden>
        <h1>Carril por avatares — la opción descartada</h1>
      </VisuallyHidden>

      <AppShell.Section aria-label="Carril por avatares">
        <AppShell.Header
          sticky
          title="Carril por avatares"
          subtitle="La opción descartada, montada para poder mirarla en las tres anchuras"
          actions={
            <Badge variant="light" size="sm" color="gray">
              descartada
            </Badge>
          }
        />
        <AppShell.Content>
          <Alert
            variant="light"
            color="warning"
            icon={<Icon name="warning" />}
            title="Baja de tablet y mira la barra inferior"
            mb="md"
          >
            Con seis avatares ya empuja los dos destinos fuera de la pantalla. Con los doce del plan
            Studio, la navegación del producto deja de existir en móvil.
          </Alert>

          <SimpleGrid cols={Cols({ base: 2, tablet: 3, laptop: 4 })} spacing="md">
            {AVATARES.map((avatar) => (
              <Card key={avatar.id} withBorder radius="md" padding="none" overflow="hidden">
                <Placeholder ratio={4 / 3} />
                <Box p="sm">
                  <Text fz="body3" fw="semibold" truncate>
                    {avatar.nombre}
                  </Text>
                  <StatusBadge status={avatar.estado} map={ESTADO_AVATAR} size="xs" />
                </Box>
              </Card>
            ))}
          </SimpleGrid>
        </AppShell.Content>
      </AppShell.Section>
    </AppShell>
  );
}

/* ── El carril encogido, que es el tercer estado ──────────────────────────── */

function CarrilEncogido(): ReactElement {
  const scroller = useRef<HTMLElement | null>(null);

  return (
    <AppShell
      mainRef={scroller}
      scrollShadowOffset={116}
      sidebarCollapsed
      backdrop={<StarField fixed parallax aurora density="sm" scroller={scroller} />}
      sidebar={
        <AppShell.Sidebar aria-label="Navegación principal" collapsed>
          <AppShell.Sidebar.Header>
            <ActionIcon variant="ghost" size="sm" aria-label="Cambiar de estudio">
              <Icon name="studio" size={20} />
            </ActionIcon>
          </AppShell.Sidebar.Header>
          <Carril active="avatares" collapsed />
          <PieDeCarril />
        </AppShell.Sidebar>
      }
    >
      <VisuallyHidden>
        <h1>El carril encogido</h1>
      </VisuallyHidden>
      <AppShell.Section aria-label="El carril encogido">
        <AppShell.Header
          sticky
          title="El carril encogido"
          subtitle="El mismo carril sin rótulos: es lo que se ve por debajo de laptop"
        />
        <AppShell.Content>
          <Text fz="body3" c="text.secondary" maw={640}>
            Los rótulos viven dentro de <strong>AppShell.Label</strong>, así que desaparecen solos
            al encoger y vuelven al expandir. El avatar activo sobrevive como retrato, que es
            exactamente lo que tiene que sobrevivir: sin él, el carril encogido no dice con quién
            estás trabajando.
          </Text>
        </AppShell.Content>
      </AppShell.Section>
    </AppShell>
  );
}

const meta: Meta = {
  title: "Patterns/Rosette/El carril",
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj;

/**
 * **El carril navega por secciones, con el avatar activo como primera entrada fija.**
 *
 * *El dato que decide.* Bajo `tablet`, el propio `AppShell.Sidebar` **se convierte** en la barra
 * inferior: no hay componente aparte. Así que la pregunta «¿el carril navega por avatares?» es en
 * realidad «¿la navegación del móvil es una lista de caras?». Con doce avatares —el plan Studio—
 * la respuesta es que Biblioteca, Saldo y Revisión quedan fuera de pantalla, empujados por el
 * catálogo del estudio.
 *
 * *Lo que la opción descartada acierta, y se conserva.* Tener el avatar activo delante. Por eso
 * vive arriba del carril como **una** entrada fija, con su versión de canon y su techo: en móvil
 * es el primer elemento tras el conmutador, y en el carril encogido sobrevive como retrato.
 *
 * *El conmutador de estudio va en la cabecera del carril*, que es la única esquina que no se mueve
 * entre las tres anchuras —arriba en escritorio, anclada a la izquierda en la barra inferior— y es
 * donde el `Sidenav` de The Film Vault pone la empresa. Cambiar de estudio cambia todo el
 * contenido, así que no puede parecer un filtro entre enlaces.
 */
export const PorSecciones: Story = {
  name: "A · por secciones (recomendada)",
  render: () => (
    <Escena>
      <CarrilRecomendado />
    </Escena>
  ),
};

/**
 * La opción B, montada para poder mirarla en las tres anchuras en vez de discutirla en abstracto.
 * Baja el visor a `tablet` y mira la barra inferior: con seis avatares los destinos ya salen de
 * cuadro.
 */
export const PorAvatares: Story = {
  name: "B · por avatares (descartada)",
  render: () => (
    <Escena>
      <CarrilPorAvatares />
    </Escena>
  ),
};

/**
 * El tercer estado del carril, que es el que se ve por debajo de `laptop` y el que el usuario
 * puede forzar. Los rótulos desaparecen y el avatar activo sobrevive como retrato.
 */
export const Encogido: Story = {
  name: "El carril encogido",
  render: () => (
    <Escena>
      <CarrilEncogido />
    </Escena>
  ),
};
