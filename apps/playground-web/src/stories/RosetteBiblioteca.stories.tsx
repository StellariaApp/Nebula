import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState, type ReactElement } from "react";

import {
  Alert,
  AppShell,
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
  type IconName,
} from "../fixtures/rosette.js";

/* ── Los assets ───────────────────────────────────────────────────────────────
 * Tres tipos, una sola colección. «Escena» no es un asset: la escena es canon +
 * acción + assets, y por eso no aparece en ninguna pestaña.                    */

type TipoAsset = "ubicacion" | "outfit" | "peinado";

interface Asset {
  id: string;
  nombre: string;
  tipo: TipoAsset;
  ubicacion?: string | undefined;
  contentClass: "safe" | "nsfw";
  icono: boolean;
}

const TIPO_ICONO: Record<TipoAsset, IconName> = {
  ubicacion: "pin",
  outfit: "wardrobe",
  peinado: "scissors",
};

const TIPO_LABEL: Record<TipoAsset, string> = {
  ubicacion: "Ubicación",
  outfit: "Outfit",
  peinado: "Peinado",
};

const ASSETS: Asset[] = [
  { id: "u1", nombre: "Azotea al atardecer", tipo: "ubicacion", contentClass: "safe", icono: true },
  { id: "u2", nombre: "Gimnasio", tipo: "ubicacion", contentClass: "safe", icono: true },
  { id: "u3", nombre: "Cocina de casa", tipo: "ubicacion", contentClass: "safe", icono: false },
  { id: "u4", nombre: "Dormitorio", tipo: "ubicacion", contentClass: "safe", icono: false },
  {
    id: "o1",
    nombre: "Lino blanco",
    tipo: "outfit",
    ubicacion: "Azotea al atardecer",
    contentClass: "safe",
    icono: true,
  },
  {
    id: "o2",
    nombre: "Vestido de noche",
    tipo: "outfit",
    ubicacion: "Azotea al atardecer",
    contentClass: "safe",
    icono: true,
  },
  {
    id: "o3",
    nombre: "Gabardina",
    tipo: "outfit",
    ubicacion: "Azotea al atardecer",
    contentClass: "safe",
    icono: false,
  },
  {
    id: "o4",
    nombre: "Top y mallas",
    tipo: "outfit",
    ubicacion: "Gimnasio",
    contentClass: "safe",
    icono: true,
  },
  {
    id: "o5",
    nombre: "Sudadera ancha",
    tipo: "outfit",
    ubicacion: "Gimnasio",
    contentClass: "safe",
    icono: false,
  },
  {
    id: "o6",
    nombre: "Camisa de dormir",
    tipo: "outfit",
    ubicacion: "Dormitorio",
    contentClass: "safe",
    icono: false,
  },
  {
    id: "o7",
    nombre: "Conjunto de encaje",
    tipo: "outfit",
    ubicacion: "Dormitorio",
    contentClass: "nsfw",
    icono: false,
  },
  {
    id: "p1",
    nombre: "Suelto con ondas",
    tipo: "peinado",
    ubicacion: "Azotea al atardecer",
    contentClass: "safe",
    icono: true,
  },
  {
    id: "p2",
    nombre: "Recogido alto",
    tipo: "peinado",
    ubicacion: "Gimnasio",
    contentClass: "safe",
    icono: false,
  },
  {
    id: "p3",
    nombre: "Trenza lateral",
    tipo: "peinado",
    ubicacion: "Cocina de casa",
    contentClass: "safe",
    icono: false,
  },
];

/* ── Las acciones del banco ─────────────────────────────────────────────────── */

interface Accion {
  id: string;
  label: string;
  declarado: string;
  observado: string | null;
  suggestive: boolean | null;
  scope: "global" | "enterprise";
  group: string;
  regiones: string;
  curador: string | null;
}

const ACCIONES: Accion[] = [
  {
    id: "a1",
    label: "De pie junto a la barandilla, mirando la ciudad",
    declarado: "A",
    observado: "A",
    suggestive: false,
    scope: "global",
    group: "cuerpo entero frontal",
    regiones: "torso · piernas · cara",
    curador: "curaduría Rosette",
  },
  {
    id: "a2",
    label: "Sentada leyendo junto a la ventana",
    declarado: "A",
    observado: "A",
    suggestive: false,
    scope: "global",
    group: "cuerpo entero perfil",
    regiones: "torso · cara",
    curador: "curaduría Rosette",
  },
  {
    id: "a3",
    label: "Ajustándose el puño de la camisa",
    declarado: "A",
    observado: "A",
    suggestive: true,
    scope: "global",
    group: "plano de manos",
    regiones: "manos",
    curador: "curaduría Rosette",
  },
  {
    id: "a4",
    label: "Retrato de tres cuartos con luz lateral",
    declarado: "A",
    observado: null,
    suggestive: false,
    scope: "enterprise",
    group: "plano de cara",
    regiones: "cara",
    curador: null,
  },
  {
    id: "a5",
    label: "De espaldas, secándose el pelo",
    declarado: "A",
    observado: "B",
    suggestive: true,
    scope: "global",
    group: "cuerpo entero dorsal",
    regiones: "espalda · piernas",
    curador: "curaduría Rosette",
  },
];

const ESCALON_TONO = { A: "success", B: "info", C: "warning", D: "error" } as const;

function AssetCard({ asset }: { asset: Asset }): ReactElement {
  return (
    <Card withBorder r="md" p="none" overflow="hidden">
      {asset.icono ? (
        <Placeholder ratio={4 / 3} icon={TIPO_ICONO[asset.tipo]} />
      ) : (
        <Placeholder ratio={4 / 3} icon={TIPO_ICONO[asset.tipo]} tone="muted">
          <Button size="xs" variant="glass" mt="xxs">
            Generar icono · {Rosets(TARIFA.iconoAsset)}
          </Button>
        </Placeholder>
      )}
      <Box p="sm">
        <Flex align="center" justify="space-between" gap="xs" wrap="wrap">
          <Text fz="body3" fw="semibold" truncate>
            {asset.nombre}
          </Text>
          {asset.contentClass === "nsfw" ? (
            <Tooltip
              label="No aparece en el selector de un trabajo de escalón A"
              trigger={
                <Badge size="xs" variant="outline" color="warning">
                  clase nsfw
                </Badge>
              }
            />
          ) : null}
        </Flex>
        <Text fz="caption" c="text.muted" truncate>
          {TIPO_LABEL[asset.tipo]}
          {asset.ubicacion === undefined ? "" : ` · ${asset.ubicacion}`}
        </Text>
      </Box>
    </Card>
  );
}

function PanelAssets(): ReactElement {
  const [tipo, set_tipo] = useState("todos");

  const items = useMemo(
    () => (tipo === "todos" ? ASSETS : ASSETS.filter((asset) => asset.tipo === tipo)),
    [tipo],
  );
  const sin_icono = ASSETS.filter((asset) => !asset.icono).length;

  return (
    <Box>
      <Flex align="center" justify="space-between" gap="sm" wrap="wrap" mb="md">
        <Segment value={tipo} onChange={set_tipo} size="sm">
          <Segment.Control aria-label="Tipo de asset">
            <Segment.Control.Item value="todos">Todos</Segment.Control.Item>
            <Segment.Control.Item value="ubicacion">Ubicaciones</Segment.Control.Item>
            <Segment.Control.Item value="outfit">Outfits</Segment.Control.Item>
            <Segment.Control.Item value="peinado">Peinados</Segment.Control.Item>
          </Segment.Control>
        </Segment>
        <Group gap="sm">
          <SearchInput placeholder="Buscar en la biblioteca" aria-label="Buscar assets" size="sm" />
          <Button size="sm" rightSection={<Icon name="plus" />}>
            Nuevo asset
          </Button>
        </Group>
      </Flex>

      <Alert variant="light" color="info" icon={<Icon name="info" />} mb="md">
        Los assets nacen <strong>sin imagen</strong>. Generarlas todas al crearlas se comía el{" "}
        <strong>53,8 %</strong> del plan de entrada antes de producir una sola foto que alguien
        quisiera, así que van bajo demanda: {sin_icono} de {ASSETS.length} están sin icono y cada
        uno cuesta {Rosets(TARIFA.iconoAsset)} —una sola candidata, es un icono de catálogo, no una
        entrega—.
      </Alert>

      <SimpleGrid cols={Cols({ base: 2, tablet: 3, laptop: 4, wide: 5 })} spacing="md">
        {items.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </SimpleGrid>
    </Box>
  );
}

function PanelAcciones(): ReactElement {
  const desalineadas = ACCIONES.filter(
    (accion) => accion.observado !== null && accion.observado !== accion.declarado,
  );
  const sin_observar = ACCIONES.filter((accion) => accion.observado === null);

  return (
    <Box>
      <Alert
        variant="light"
        color="warning"
        icon={<Icon name="warning" />}
        title="El banco es el único control de escalón que existe en su vía"
        mb="md"
      >
        Al cerrar F5,{" "}
        <strong>13 de 23 acciones declaraban un escalón por debajo del que producen</strong>, y las
        trece hacia arriba. Por eso el escalón <em>observado</em> se anota aparte del declarado, lo
        firma una persona, y una acción sin observar <strong>no la sirve el banco</strong>.
      </Alert>

      <Flex align="center" gap="sm" wrap="wrap" mb="md">
        <Badge variant="light" color="error" size="sm">
          {desalineadas.length} con declarado ≠ observado
        </Badge>
        <Badge variant="light" color="gray" size="sm">
          {sin_observar.length} sin observar · no se sirven
        </Badge>
      </Flex>

      <Box display="flex" direction="column" gap="sm">
        {ACCIONES.map((accion) => {
          const desalineada = accion.observado !== null && accion.observado !== accion.declarado;
          return (
            <Card key={accion.id} withBorder r="md" p="none">
              <Box p="md">
                <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
                  <Text fz="body3" fw="semibold" miw={0}>
                    {accion.label}
                  </Text>
                  <Group gap="xs">
                    <Badge
                      size="xs"
                      variant="outline"
                      color={ESCALON_TONO[accion.declarado as "A"]}
                    >
                      declarado {accion.declarado}
                    </Badge>
                    {accion.observado === null ? (
                      <Badge size="xs" variant="light" color="gray">
                        sin observar
                      </Badge>
                    ) : (
                      <Badge
                        size="xs"
                        variant={desalineada ? "filled" : "light"}
                        color={desalineada ? "error" : ESCALON_TONO[accion.observado as "A"]}
                      >
                        observado {accion.observado}
                      </Badge>
                    )}
                    <Badge size="xs" variant="outline" color="gray">
                      {accion.scope}
                    </Badge>
                    {accion.suggestive === true ? (
                      <Tooltip
                        label="Ordena el catálogo; no filtra por techo. Eso lo hace el escalón observado"
                        trigger={
                          <Badge size="xs" variant="outline" color="accent">
                            sugerente
                          </Badge>
                        }
                      />
                    ) : null}
                  </Group>
                </Flex>
                <Text fz="caption" c="text.muted" mt="xxs">
                  Encuadre: {accion.group} · regiones visibles: {accion.regiones}
                  {accion.curador === null ? "" : ` · curada por ${accion.curador}`}
                </Text>
                {desalineada ? (
                  <Text fz="caption" c="error.500" mt="xxs">
                    Se reporta, no se pisa. Se corrige la acción, no el activo.
                  </Text>
                ) : null}
              </Box>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}

function Biblioteca(): ReactElement {
  const [panel, set_panel] = useState("assets");

  return (
    <Shell active="ninguna" title="Biblioteca — Rosette">
      <AppShell.Section aria-label="Biblioteca">
        <AppShell.Header
          sticky
          title="Biblioteca"
          subtitle="Ubicación, outfit y peinado. La escena no es un asset: es canon + acción + assets"
        />
        <AppShell.Subbar sticky>
          <Segment value={panel} onChange={set_panel} size="sm">
            <Segment.Control aria-label="Qué se gestiona">
              <Segment.Control.Item value="assets">Assets</Segment.Control.Item>
              <Segment.Control.Item value="acciones">Banco de acciones</Segment.Control.Item>
            </Segment.Control>
          </Segment>
        </AppShell.Subbar>
        <AppShell.Content>
          {panel === "assets" ? <PanelAssets /> : <PanelAcciones />}
        </AppShell.Content>
      </AppShell.Section>
    </Shell>
  );
}

/* ── El selector desde el taller ─────────────────────────────────────────────
 * La regla que hay que enseñar es de orden, no de bloqueo: primero los
 * relacionados con la ubicación elegida, después todos los demás, y ninguno
 * deshabilitado. Lo único que de verdad desaparece es la clase que el escalón
 * del trabajo no admite.                                                       */

function Selector({
  ubicacion,
  onClose,
}: {
  ubicacion: string;
  onClose: () => void;
}): ReactElement {
  const outfits = ASSETS.filter((asset) => asset.tipo === "outfit");
  const relacionados = outfits.filter(
    (asset) => asset.ubicacion === ubicacion && asset.contentClass === "safe",
  );
  const resto = outfits.filter(
    (asset) => asset.ubicacion !== ubicacion && asset.contentClass === "safe",
  );

  return (
    <Drawer opened onClose={onClose} side="end" size={420} title="Elegir outfit">
      <Text fz="caption" c="text.muted">
        Trabajo de escalón A en <strong>{ubicacion}</strong>.
      </Text>

      <Rotulo mt="md">Relacionados con {ubicacion}</Rotulo>
      <SimpleGrid cols={Cols({ base: 2 })} spacing="sm">
        {relacionados.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </SimpleGrid>

      <Divider my="md" />

      <Rotulo>Todos los demás</Rotulo>
      <Text fz="caption" c="text.muted" mb="xs">
        La relación orienta, no restringe: ninguno está bloqueado. El sistema no sabe si quieres un
        vestido de noche en el gimnasio, y no le toca decidirlo.
      </Text>
      <SimpleGrid cols={Cols({ base: 2 })} spacing="sm">
        {resto.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </SimpleGrid>

      <Alert variant="light" color="gray" mt="md" icon={<Icon name="lock" />}>
        Los assets de clase <strong>nsfw</strong> no aparecen en un trabajo de escalón A. Es la
        misma regla de clase que gobierna las tres anclas de detalle.
      </Alert>
    </Drawer>
  );
}

function TallerConSelector(): ReactElement {
  const [abierto, set_abierto] = useState(true);

  return (
    <Shell active="avatares" title="Elegir un asset sin salir del taller — Rosette">
      <AppShell.Section aria-label="Taller">
        <AppShell.Header
          sticky
          title={AVATAR_ACTIVO.nombre}
          subtitle="El selector se abre encima del taller: la composición no se pierde"
        />
        <AppShell.Content>
          <SimpleGrid cols={Cols({ base: 1, laptop: 2 })} spacing="md">
            <GlassSurface level="subtle" r="lg" withBorder p="md">
              <Rotulo>Assets de escena</Rotulo>
              {[
                { label: "Ubicación", valor: "Azotea al atardecer", icon: "pin" as IconName },
                { label: "Outfit", valor: "eligiendo…", icon: "wardrobe" as IconName },
                { label: "Peinado", valor: "Suelto con ondas", icon: "scissors" as IconName },
              ].map((linea) => (
                <Card key={linea.label} withBorder r="md" p="none" mb="xs">
                  <Box p="sm">
                    <Flex align="center" gap="xs" c="text.muted">
                      <Icon name={linea.icon} size={14} />
                      <Text fz="caption" tt="uppercase" ls="wide" fw="semibold">
                        {linea.label}
                      </Text>
                    </Flex>
                    <Text fz="body3" fw="semibold" mt="xxs">
                      {linea.valor}
                    </Text>
                  </Box>
                </Card>
              ))}
              <Button
                fullWidth
                mt="sm"
                variant="ghost"
                onPress={() => {
                  set_abierto(true);
                }}
              >
                Abrir el selector
              </Button>
            </GlassSurface>

            <Box>
              <Rotulo>Cola</Rotulo>
              <SimpleGrid cols={Cols({ base: 2 })} spacing="md">
                {[0, 1].map((clave) => (
                  <Card key={clave} withBorder r="md" p="none" overflow="hidden">
                    <Placeholder ratio={3 / 4} />
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          </SimpleGrid>
        </AppShell.Content>
      </AppShell.Section>

      {abierto ? (
        <Selector
          ubicacion="Azotea al atardecer"
          onClose={() => {
            set_abierto(false);
          }}
        />
      ) : null}
    </Shell>
  );
}

const meta: Meta = {
  title: "Patterns/Rosette/Biblioteca",
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj;

/**
 * El modelo ya está cerrado, así que aquí lo que se diseña es **el acceso**: una colección con
 * tres tipos, y un banco de acciones al lado que no es lo mismo aunque se elija en el mismo sitio.
 *
 * *Los assets nacen sin imagen y el botón dice lo que cuesta.* Generarlas todas al crear el asset
 * se comía el 53,8 % del plan de entrada antes de producir una sola foto que alguien quisiera. Es
 * una candidata, no tres: es un icono de catálogo, no una entrega.
 *
 * *El banco enseña el escalón dos veces.* Declarado y **observado**, porque al cerrar F5 trece de
 * veintitrés acciones producían por encima de lo que declaraban. Cuando no coinciden se reporta y
 * no se pisa —se corrige la acción, no el activo— y una acción sin observar no se sirve.
 * `suggestive` ordena el catálogo y no filtra por techo: es un problema de presentación, no de
 * control.
 */
export const Gestion: Story = {
  name: "La vista de biblioteca",
  render: () => (
    <Escena>
      <Biblioteca />
    </Escena>
  ),
};

/**
 * **Elegir sin salir del taller.** El selector es un cajón lateral sobre la misma pantalla: la
 * composición sigue detrás y no hay que volver a montarla.
 *
 * Lo que enseña es la regla de orden de §7.3, que es fácil de convertir en un bloqueo por
 * accidente: **primero los relacionados con la ubicación elegida, después todos los demás, y
 * ninguno deshabilitado**. El sistema no sabe si quieres un vestido de noche en el gimnasio, y no
 * le toca decidirlo.
 *
 * Lo único que de verdad no aparece es la clase que el escalón del trabajo no admite —un outfit
 * `nsfw` en un trabajo de escalón A—, y eso se dice en el pie del cajón en vez de dejar un hueco
 * inexplicable.
 */
export const SelectorDesdeElTaller: Story = {
  name: "Elegir sin salir del taller",
  render: () => (
    <Escena>
      <TallerConSelector />
    </Escena>
  ),
};
