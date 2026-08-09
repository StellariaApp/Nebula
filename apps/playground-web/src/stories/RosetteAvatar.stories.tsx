import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactElement, type ReactNode } from "react";

import {
  ActionIcon,
  Alert,
  AppShell,
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Divider,
  Drawer,
  Flex,
  GlassSurface,
  Group,
  Menu,
  Progress,
  Segment,
  SimpleGrid,
  StatusBadge,
  Switch,
  Tabs,
  Text,
  Textarea,
  Timeline,
  Tooltip,
  type BreadcrumbItem,
  type MenuItemData,
  type TabItem,
} from "@stellaria/nebula-web";

import {
  AVATAR_ACTIVO,
  AvisoDeGasto,
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
  TARIFA,
  VISIBILIDAD,
} from "../fixtures/rosette.js";

/* ── El taller · componer ─────────────────────────────────────────────────────
 * Lo que el primer intento acertó y se conserva: preajustes que enseñan el valor
 * elegido, y el coste recalculado en vivo antes del botón. Lo que se corrige:
 * la concurrencia va por plan (decisión 23) y el tope de candidatas es tres
 * (enmienda 7), que son dos cosas distintas y aquí se ven por separado.        */

interface Preajuste {
  key: string;
  label: string;
  valor?: string | undefined;
  nota: string;
  icon: "pin" | "wardrobe" | "scissors";
}

const PREAJUSTES: Preajuste[] = [
  { key: "ubicacion", label: "Ubicación", valor: "Azotea al atardecer", nota: "6 outfits relacionados", icon: "pin" },
  { key: "outfit", label: "Outfit", valor: "Lino blanco", nota: "clase segura", icon: "wardrobe" },
  { key: "peinado", label: "Peinado", nota: "sin elegir · opcional", icon: "scissors" },
];

function PreajusteTile({ preajuste }: { preajuste: Preajuste }): ReactElement {
  const puesto = preajuste.valor !== undefined;
  return (
    <Card withBorder r="md" padding="none">
      <Box p="sm">
        <Flex align="center" gap="xs" c={puesto ? "primary.600" : "text.muted"}>
          <Icon name={preajuste.icon} size={14} />
          <Text fz="caption" tt="uppercase" ls="wide" fw="semibold" c="text.muted">
            {preajuste.label}
          </Text>
        </Flex>
        <Text fz="body3" fw="semibold" mt="xxs" truncate>
          {preajuste.valor ?? "Elegir"}
        </Text>
        <Text fz="caption" c="text.muted" truncate>
          {preajuste.nota}
        </Text>
      </Box>
    </Card>
  );
}

const ACCION = {
  label: "De pie junto a la barandilla, mirando la ciudad",
  escalon: "A",
  suggestive: false,
  group: "cuerpo entero frontal",
  scope: "global",
  regiones: "torso · piernas · cara",
};

function SelectorDeAccion(): ReactElement {
  return (
    <Card withBorder r="md" padding="none">
      <Box p="sm">
        <Flex align="center" justify="space-between" gap="xs">
          <Text fz="caption" tt="uppercase" ls="wide" fw="semibold" c="text.muted">
            Acción
          </Text>
          <Group gap="xxs">
            <Badge size="xs" variant="light" color="success">
              escalón {ACCION.escalon}
            </Badge>
            <Badge size="xs" variant="outline" color="gray">
              {ACCION.scope}
            </Badge>
          </Group>
        </Flex>
        <Text fz="body3" fw="semibold" mt="xxs">
          {ACCION.label}
        </Text>
        <Text fz="caption" c="text.muted">
          Encuadre: {ACCION.group} · regiones visibles: {ACCION.regiones}
        </Text>
        <Button size="xs" variant="ghost" mt="xs" rightSection={<Icon name="chevron-right" />}>
          Cambiar acción
        </Button>
      </Box>
    </Card>
  );
}

function Componer(): ReactElement {
  const [candidatas, set_candidatas] = useState(3);
  const [via, set_via] = useState("banco");

  const coste = candidatas * TARIFA.imagen + (via === "custom" ? TARIFA.promptCustom : 0);
  const detalle =
    via === "custom"
      ? `${String(candidatas)} × ${String(TARIFA.imagen)} imagen + ${String(TARIFA.promptCustom)} composición del prompt`
      : `${String(candidatas)} × ${String(TARIFA.imagen)} imagen`;

  return (
    <GlassSurface level="subtle" r="lg" withBorder p="md">
      <Segment defaultValue="imagen" fullWidth>
        <Segment.Control aria-label="Qué generar">
          <Segment.Control.Item value="imagen">Imagen</Segment.Control.Item>
          <Segment.Control.Item value="video">Vídeo</Segment.Control.Item>
          <Segment.Control.Item value="voz">Voz</Segment.Control.Item>
        </Segment.Control>
      </Segment>

      <Rotulo mt="md">Vía</Rotulo>
      <Segment value={via} onChange={set_via} fullWidth size="sm">
        <Segment.Control aria-label="Vía de generación">
          <Segment.Control.Item value="banco">Banco de acciones</Segment.Control.Item>
          <Segment.Control.Item value="custom">Custom</Segment.Control.Item>
        </Segment.Control>
      </Segment>

      {via === "custom" ? (
        <Alert
          variant="light"
          color="warning"
          mt="sm"
          icon={<Icon name="warning" />}
          title="La vía custom no lleva verificador"
        >
          El activo hereda el escalón que pidas, no el que salga. Está medido que cuatro veces
          sobre unas 60 no coincidieron.
        </Alert>
      ) : (
        <Box mt="sm">
          <SelectorDeAccion />
        </Box>
      )}

      <Rotulo mt="md">Assets de escena</Rotulo>
      <Box display="flex" direction="column" gap="xs">
        {PREAJUSTES.map((preajuste) => (
          <PreajusteTile key={preajuste.key} preajuste={preajuste} />
        ))}
      </Box>
      <Text fz="caption" c="text.muted" mt="xxs">
        El selector enseña primero los relacionados con la ubicación y después todos los demás. No
        bloquea ninguno.
      </Text>

      {via === "custom" ? (
        <>
          <Rotulo mt="md">Lo que quieres</Rotulo>
          <Textarea
            aria-label="Descripción de la escena"
            placeholder="Un modelo compone el prompt con el orden fijo. Tu texto entra en el punto 5, no sustituye al resto."
            rows={3}
          />
        </>
      ) : null}

      <Rotulo mt="md">Candidatas</Rotulo>
      <Segment
        value={String(candidatas)}
        onChange={(value) => {
          set_candidatas(Number(value));
        }}
        fullWidth
        size="sm"
      >
        <Segment.Control aria-label="Cuántas candidatas">
          <Segment.Control.Item value="1">1</Segment.Control.Item>
          <Segment.Control.Item value="2">2</Segment.Control.Item>
          <Segment.Control.Item value="3">3</Segment.Control.Item>
        </Segment.Control>
      </Segment>
      <Text fz="caption" c="text.muted" mt="xxs">
        Tope de tres. Una candidata y un reintento son la misma cosa: cuestan igual, las dos se
        guardan, y eliges tú aunque el control las rechace.
      </Text>

      <AvisoDeGasto coste={coste} detalle={detalle} />

      <Button fullWidth mt="sm" rightSection={<Icon name="spark" />}>
        Generar
      </Button>

      <Divider my="md" />

      <Flex align="center" justify="space-between" gap="sm">
        <Text fz="caption" c="text.muted">
          Trabajos a la vez
        </Text>
        <Text fz="caption" fw="semibold">
          {SALDO.trabajosEnCurso} de {PLAN.trabajos}
        </Text>
      </Flex>
      <Progress
        value={(SALDO.trabajosEnCurso / PLAN.trabajos) * 100}
        size="xs"
        mt="xxs"
        label="Trabajos concurrentes en curso"
      />
      <Text fz="caption" c="text.muted" mt="xxs">
        Lo fija el plan {PLAN.nombre}, no un ajuste. Starter 1 · Pro 6 · Studio 12, con tope global
        de 24.
      </Text>
    </GlassSurface>
  );
}

/* ── El taller · la cola ─────────────────────────────────────────────────────
 * Cada resultado dice su estado. El estado que el primer intento llamaba
 * «requiere plan» no existe: en Rosette el freno es el saldo y la ranura.      */

type EstadoCandidata = "sin-revisar" | "generando" | "en-cola" | "fallida" | "aprobada";

const COLA: { key: string; estado: EstadoCandidata; nota: string; progreso?: number }[] = [
  { key: "a", estado: "sin-revisar", nota: "intento 1 de 3" },
  { key: "b", estado: "sin-revisar", nota: "intento 2 de 3" },
  { key: "c", estado: "aprobada", nota: "activo · sidecar guardado" },
  { key: "d", estado: "generando", nota: "canon v7 · 9 anclas", progreso: 62 },
  { key: "e", estado: "generando", nota: "canon v7 · 9 anclas", progreso: 21 },
  { key: "f", estado: "en-cola", nota: "esperando ranura · 3 de 6 en curso" },
  { key: "g", estado: "en-cola", nota: "esperando ranura · 3 de 6 en curso" },
  { key: "h", estado: "fallida", nota: "transporte · 10 rosets devueltos" },
];

const ESTADO_CANDIDATA = {
  "sin-revisar": { label: "Sin revisar", color: "accent", variant: "light", dot: true },
  generando: { label: "Generando", color: "info", variant: "light", dot: true },
  "en-cola": { label: "En cola", color: "gray", variant: "light", dot: true },
  fallida: { label: "Fallida", color: "warning", variant: "light", dot: true },
  aprobada: { label: "Aprobada", color: "success", variant: "light", dot: true },
} as const;

function CandidataTile({
  estado,
  nota,
  progreso,
}: {
  estado: EstadoCandidata;
  nota: string;
  progreso?: number | undefined;
}): ReactElement {
  return (
    <Card withBorder r="md" padding="none" overflow="hidden">
      <Placeholder ratio={3 / 4} icon={estado === "fallida" ? "warning" : "image"}>
        {progreso === undefined ? null : (
          <Progress value={progreso} size="xs" w="70%" label="Progreso de la generación" />
        )}
      </Placeholder>
      <Box p="xs">
        <StatusBadge status={estado} map={ESTADO_CANDIDATA} size="xs" />
        <Text fz="caption" c="text.muted" mt="xxs" truncate>
          {nota}
        </Text>
      </Box>
    </Card>
  );
}

function Cola(): ReactElement {
  const sin_revisar = COLA.filter((item) => item.estado === "sin-revisar").length;

  return (
    <Box display="flex" direction="column" gap="md" miw={0}>
      <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
        <Segment defaultValue="todo" size="sm">
          <Segment.Control aria-label="Filtrar la cola">
            <Segment.Control.Item value="todo">Todo</Segment.Control.Item>
            <Segment.Control.Item value="sin-revisar">Sin revisar</Segment.Control.Item>
            <Segment.Control.Item value="aprobadas">Aprobadas</Segment.Control.Item>
          </Segment.Control>
        </Segment>
        <Button size="sm" variant="glass" rightSection={<Icon name="check-square" />}>
          Revisar {sin_revisar > 0 ? `(${String(sin_revisar)})` : ""}
        </Button>
      </Flex>

      <SimpleGrid cols={Cols({ base: 2, wide: 3 })} spacing="md">
        {COLA.map((item) => (
          <CandidataTile
            key={item.key}
            estado={item.estado}
            nota={item.nota}
            progreso={item.progreso}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}

/* ── El taller · qué se va a mandar ──────────────────────────────────────────
 * §7.5: el orden del prompt es fijo y el mismo para todas las generaciones.
 * Enseñarlo resuelto ANTES de gastar es lo que en ourdream no existe: allí una
 * imagen que sale mal no se puede explicar.                                    */

const COMPOSICION = [
  { title: "1 · Preámbulo de anclas", description: "emparejado con las 9 que viajan" },
  { title: "2 · Bloque de identidad", description: "literal del canon v7, sin cambiar una palabra" },
  { title: "3 · Escena", description: "Azotea al atardecer" },
  { title: "4 · Vestuario y peinado", description: "lino blanco, con un sitio en la escena" },
  { title: "5 · Acción", description: "de pie junto a la barandilla" },
  { title: "6 · Luz", description: "frontal difusa — la directiva del canon" },
  { title: "7 · Negativos", description: "los tres grupos del canon" },
];

function Contexto(): ReactElement {
  return (
    <GlassSurface level="subtle" r="lg" withBorder p="md">
      <Rotulo>Lo que viaja en esta generación</Rotulo>
      <Timeline items={COMPOSICION} active={COMPOSICION.length} />

      <Divider my="md" />

      <Rotulo>Referencias</Rotulo>
      <Flex align="center" justify="space-between" gap="sm">
        <Text fz="body3">9 anclas del juego</Text>
        <Badge variant="light" size="sm">
          1 hueco libre
        </Badge>
      </Flex>
      <Text fz="caption" c="text.muted" mt="xxs">
        El proveedor admite 10 referencias. Con el juego completo cabe una más: un juguete, una
        ubicación o una plancha de gesto. No caben dos.
      </Text>

      <Divider my="md" />

      <Rotulo>Últimos cargos</Rotulo>
      <Box display="flex" direction="column" gap="xxs">
        {[
          { label: "Tanda de 3 candidatas", valor: -30 },
          { label: "Trabajo fallido · devuelto", valor: 10 },
          { label: "Turno de chat", valor: -1 },
        ].map((linea) => (
          <Flex key={linea.label} align="center" justify="space-between" gap="sm">
            <Text fz="caption" c="text.muted" truncate>
              {linea.label}
            </Text>
            <Text fz="caption" fw="semibold" c={linea.valor > 0 ? "success.500" : "text.primary"}>
              {linea.valor > 0 ? "+" : ""}
              {Miles(linea.valor)}
            </Text>
          </Flex>
        ))}
      </Box>
    </GlassSurface>
  );
}

function Taller(): ReactElement {
  return (
    <SimpleGrid cols={Cols({ base: 1, laptop: 2, desktop: 3 })} spacing="md">
      <Componer />
      <Cola />
      <Contexto />
    </SimpleGrid>
  );
}

/* ── Galería ─────────────────────────────────────────────────────────────────
 * Cada activo apunta a la versión de canon con la que se generó (§6.6). Sin eso
 * un activo aprobado es irrepetible y además inexplicable: el modelo no expone
 * semilla.                                                                     */

const SIDECAR = [
  { campo: "Versión de canon", valor: "v7 · 29/07/2026" },
  { campo: "Anclas enviadas", valor: "rostro, manos, pies, frontal, dorsal, perfil" },
  { campo: "Acción", valor: "De pie junto a la barandilla · escalón A · global" },
  { campo: "Modelo", valor: "seedream-v5.0-pro/edit" },
  { campo: "Coste real", valor: "$0,0840 · 6 referencias" },
  { campo: "Veredicto", valor: "7 conservados · 0 contradichos · listón 6" },
];

const MEDIOS = [
  { id: 0, tipo: "imagen" as const, publico: true },
  { id: 1, tipo: "imagen" as const, publico: true },
  { id: 2, tipo: "imagen" as const, publico: false },
  { id: 3, tipo: "video" as const, publico: true },
  { id: 4, tipo: "imagen" as const, publico: false },
  { id: 5, tipo: "voz" as const, publico: false },
  { id: 6, tipo: "imagen" as const, publico: true },
  { id: 7, tipo: "video" as const, publico: false },
];

const TIPO_MEDIO = { imagen: "image", video: "video", voz: "mic" } as const;

/* Decisión del titular, 06/08/2026: si el avatar es público, el estudio elige
 * **qué imágenes, vídeos y audios** lo son. La selección es por pieza, no por
 * avatar, así que vive aquí y no en los ajustes.                                */

function Galeria(): ReactElement {
  const [publicos, set_publicos] = useState(
    () => new Set(MEDIOS.filter((medio) => medio.publico).map((medio) => medio.id)),
  );

  const Alternar = (id: number): void => {
    set_publicos((previos) => {
      const copia = new Set(previos);
      if (copia.has(id)) copia.delete(id);
      else copia.add(id);
      return copia;
    });
  };

  return (
    <SimpleGrid cols={Cols({ base: 1, laptop: 3 })} spacing="md">
      <Box style={{ gridColumn: "span 2" }} miw={0}>
        <Flex align="center" justify="space-between" gap="sm" wrap="wrap" mb="md">
          <Flex align="center" gap="sm" wrap="wrap">
            <Text fz="body3" c="text.muted">
              {AVATAR_ACTIVO.activos} activos aprobados
            </Text>
            <Badge size="xs" variant="light" color="accent">
              {AVATAR_ACTIVO.activosPublicos} públicos
            </Badge>
          </Flex>
          <Group gap="xs">
            <Button size="sm" variant="ghost" rightSection={<Icon name="download" />}>
              Descargar
            </Button>
            <Button size="sm" variant="ghost" rightSection={<Icon name="filter" />}>
              Filtrar
            </Button>
          </Group>
        </Flex>

        <Alert variant="light" color="info" icon={<Icon name="eye" />} mb="md">
          <strong>Rose Aldana es un avatar público</strong>, así que puedes elegir pieza a pieza
          qué se ve fuera del estudio. Lo que no marques no sale de aquí, aunque el avatar lo esté.
        </Alert>

        <SimpleGrid cols={Cols({ base: 2, tablet: 3, desktop: 4 })} spacing="md">
          {MEDIOS.map((medio) => {
            const es_publico = publicos.has(medio.id);
            return (
              <Card key={medio.id} withBorder r="md" padding="none" overflow="hidden">
                <Placeholder
                  ratio={3 / 4}
                  icon={TIPO_MEDIO[medio.tipo]}
                  label={medio.id === 0 ? "Seleccionado" : undefined}
                />
                <Box p="xs">
                  <Switch
                    size="sm"
                    checked={es_publico}
                    onChange={() => {
                      Alternar(medio.id);
                    }}
                    label={es_publico ? "Público" : "Privado"}
                    aria-label={`Publicar el activo ${String(medio.id + 1)}`}
                  />
                </Box>
              </Card>
            );
          })}
        </SimpleGrid>
      </Box>

      <GlassSurface level="subtle" r="lg" withBorder p="md">
        <Rotulo>Sidecar del activo</Rotulo>
        <Box display="flex" direction="column" gap="sm">
          {SIDECAR.map((linea) => (
            <Box key={linea.campo}>
              <Text fz="caption" c="text.muted">
                {linea.campo}
              </Text>
              <Text fz="body3">{linea.valor}</Text>
            </Box>
          ))}
          <Box>
            <Text fz="caption" c="text.muted">
              Visibilidad
            </Text>
            <Text fz="body3">{publicos.has(0) ? "Público" : "Privado"}</Text>
          </Box>
        </Box>
        <Text fz="caption" c="text.muted" mt="md">
          El proveedor no expone semilla. Esta ficha es lo único que explica por qué la imagen salió
          como salió.
        </Text>
      </GlassSurface>
    </SimpleGrid>
  );
}

/* ── Chat y memoria ──────────────────────────────────────────────────────────
 * §9.2: la memoria no es un cuadro de texto con tope de caracteres. Son tres
 * capas, y solo la primera y la tercera viajan en cada turno.                  */

const TURNOS = [
  { de: "avatar", texto: "Marcador de posición de un turno del avatar.", memoria: 0 },
  { de: "usuario", texto: "Marcador de posición de un turno del miembro.", memoria: 0 },
  { de: "avatar", texto: "Marcador de posición con recuperación de memoria.", memoria: 2 },
];

function Capa({
  titulo,
  cuando,
  children,
}: {
  titulo: string;
  cuando: string;
  children: ReactNode;
}): ReactElement {
  return (
    <Card withBorder r="md" padding="none">
      <Box p="sm">
        <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
          <Text fz="body3" fw="semibold">
            {titulo}
          </Text>
          <Badge size="xs" variant="light">
            {cuando}
          </Badge>
        </Flex>
        <Box mt="xs">{children}</Box>
      </Box>
    </Card>
  );
}

function Chat(): ReactElement {
  return (
    <SimpleGrid cols={Cols({ base: 1, laptop: 3 })} spacing="md">
      <Box style={{ gridColumn: "span 2" }} miw={0}>
        <GlassSurface level="subtle" r="lg" withBorder p="md">
          <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
            <Flex align="center" gap="sm" miw={0}>
              <Avatar name={AVATAR_ACTIVO.nombre} size="sm" radius="full" />
              <Box miw={0}>
                <Text fz="body3" fw="semibold" truncate>
                  Tu hilo con {AVATAR_ACTIVO.nombre}
                </Text>
                <Text fz="caption" c="text.muted" truncate>
                  Cada miembro tiene el suyo · 1 roset por turno
                </Text>
              </Box>
            </Flex>
            <Segment defaultValue="auto" size="sm">
              <Segment.Control aria-label="Escalón de la conversación">
                <Segment.Control.Item value="A">A</Segment.Control.Item>
                <Segment.Control.Item value="B">B</Segment.Control.Item>
                <Segment.Control.Item value="C">C</Segment.Control.Item>
                <Segment.Control.Item value="D">D</Segment.Control.Item>
                <Segment.Control.Item value="auto">Auto</Segment.Control.Item>
              </Segment.Control>
            </Segment>
          </Flex>

          <Text fz="caption" c="text.muted" mt="xs">
            En <strong>auto</strong> el nivel lo decide el ritmo de escalada del canon, no la
            petición. El efectivo es siempre el mínimo entre lo pedido, el techo del avatar, el del
            estudio y tu permiso.
          </Text>

          <Divider my="md" />

          <Box display="flex" direction="column" gap="sm">
            {TURNOS.map((turno, index) => (
              <Flex
                key={index}
                justify={turno.de === "usuario" ? "flex-end" : "flex-start"}
                gap="sm"
              >
                <Box maw="80%">
                  <Card
                    withBorder
                    r="md"
                    padding="none"
                    variant={turno.de === "usuario" ? "light" : "outline"}
                  >
                    <Box p="sm">
                      <Text fz="body3">{turno.texto}</Text>
                      {turno.memoria > 0 ? (
                        <Tooltip
                          label="Resumen diario del 26/07 · Preferencia sobre el café"
                          trigger={
                            <Badge size="xs" variant="outline" mt="xxs">
                              {turno.memoria} notas de memoria usadas
                            </Badge>
                          }
                        />
                      ) : null}
                    </Box>
                  </Card>
                </Box>
              </Flex>
            ))}
          </Box>

          <Textarea aria-label="Escribe un turno" placeholder="Escribe…" rows={2} mt="md" />
          <Flex align="center" justify="space-between" gap="sm" mt="xs">
            <Text fz="caption" c="text.muted">
              1 roset por turno · medido sobre 1.000 turnos
            </Text>
            <Button size="sm" rightSection={<Icon name="send" />}>
              Enviar
            </Button>
          </Flex>
        </GlassSurface>
      </Box>

      <GlassSurface level="subtle" r="lg" withBorder p="md">
        <Rotulo>Memoria</Rotulo>
        <Box display="flex" direction="column" gap="sm">
          <Capa titulo="1 · Canon condensado" cuando="siempre">
            <Text fz="caption" c="text.muted">
              Identidad, personalidad, voz, ejes y estado del mundo. Es fijo por versión de canon
              —hoy v{AVATAR_ACTIVO.canon}— así que se cachea y no se recompone cada turno.
            </Text>
          </Capa>

          <Capa titulo="2 · Notas de memoria" cuando="solo si la búsqueda las trae">
            <Box display="flex" direction="column" gap="xxs">
              {[
                { fecha: "26/07", nota: "Resumen diario · automático" },
                { fecha: "24/07", nota: "Hecho · trabajó en Lisboa" },
                { fecha: "21/07", nota: "Preferencia · no le gusta el frío" },
              ].map((nota) => (
                <Flex key={nota.fecha} align="center" justify="space-between" gap="sm">
                  <Text fz="caption" c="text.muted" truncate>
                    {nota.nota}
                  </Text>
                  <Text fz="caption" c="text.disabled">
                    {nota.fecha}
                  </Text>
                </Flex>
              ))}
            </Box>
            <Text fz="caption" c="text.disabled" mt="xxs">
              El resumen diario lo escribe un trabajo programado y{" "}
              <strong>no consume tus rosets</strong>: es coste de operación.
            </Text>
          </Capa>

          <Capa titulo="3 · Ventana reciente" cuando="siempre">
            <Text fz="caption" c="text.muted">
              Los últimos 8 turnos, literales. No crece con la conversación — arrastrarla entera
              costaría 603 veces más.
            </Text>
          </Capa>
        </Box>

        <Button size="sm" variant="ghost" fullWidth mt="sm" rightSection={<Icon name="search" />}>
          Buscar y olvidar notas
        </Button>
      </GlassSurface>
    </SimpleGrid>
  );
}

/* ── Identidad · canon y anclas ─────────────────────────────────────────────── */

const CAMPOS = [
  { path: "identity.name", valor: "Rose Aldana", origen: "directed", confianza: null },
  { path: "physical.hair.color", valor: "castaño oscuro", origen: "extraido", confianza: "0,91" },
  { path: "physical.eyes", valor: "avellana", origen: "extraido", confianza: "0,78" },
  { path: "physical.build", valor: "media, curva", origen: "directed", confianza: null },
  { path: "renderDirectives.skin", valor: "descriptor + luz frontal difusa", origen: "derived", confianza: null },
  { path: "voice.timbre", valor: "grave, pausado", origen: "generated", confianza: null },
  { path: "intimacyAxes.declaredCeiling", valor: "D", origen: "directed", confianza: null },
];

const ORIGEN_TONO = {
  extraido: "info",
  generated: "accent",
  directed: "success",
  derived: "gray",
} as const;

const ANCLAS = [
  { n: 1, papel: "rostro", minimo: 7, estado: "validada" },
  { n: 2, papel: "manos", minimo: 4, estado: "validada" },
  { n: 3, papel: "pies", minimo: 3, estado: "validada" },
  { n: 4, papel: "cuerpo frontal", minimo: 6, estado: "validada" },
  { n: 5, papel: "cuerpo dorsal", minimo: 5, estado: "validada" },
  { n: 6, papel: "cuerpo perfil", minimo: 5, estado: "validada" },
  { n: 7, papel: "busto", minimo: 4, estado: "solo C y D" },
  { n: 8, papel: "trasero", minimo: 4, estado: "solo C y D" },
  { n: 9, papel: "detalle", minimo: 3, estado: "solo C y D" },
];

function Identidad(): ReactElement {
  return (
    <SimpleGrid cols={Cols({ base: 1, laptop: 2 })} spacing="md">
      <GlassSurface level="subtle" r="lg" withBorder p="md">
        <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
          <Rotulo>Canon</Rotulo>
          <Group gap="xs">
            <Badge variant="light" size="sm">
              v{AVATAR_ACTIVO.canon} vigente
            </Badge>
            <Button size="xs" variant="ghost">
              Changelog
            </Button>
          </Group>
        </Flex>
        <Box display="flex" direction="column" gap="xs">
          {CAMPOS.map((campo) => (
            <Box key={campo.path}>
              <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
                <Text fz="caption" ff="mono" c="text.muted" truncate>
                  {campo.path}
                </Text>
                <Badge
                  size="xs"
                  variant="light"
                  color={ORIGEN_TONO[campo.origen as keyof typeof ORIGEN_TONO]}
                >
                  {campo.origen}
                  {campo.confianza === null ? "" : ` · ${campo.confianza}`}
                </Badge>
              </Flex>
              <Text fz="body3" fw="semibold">
                {campo.valor}
              </Text>
              <Divider mt="xs" />
            </Box>
          ))}
        </Box>
        <Text fz="caption" c="text.muted" mt="sm">
          Editar a mano pasa el campo a <strong>directed</strong> y le quita la confianza: deja de
          ser una observación y pasa a ser una decisión. Cada edición crea versión y entrada de
          changelog.
        </Text>
      </GlassSurface>

      <GlassSurface level="subtle" r="lg" withBorder p="md">
        <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
          <Rotulo>Juego de anclas</Rotulo>
          <Badge variant="light" size="sm" color="success">
            {AVATAR_ACTIVO.anclas[0]} de {AVATAR_ACTIVO.anclas[1]}
          </Badge>
        </Flex>
        <SimpleGrid cols={Cols({ base: 3, tablet: 3, laptop: 3 })} spacing="sm">
          {ANCLAS.map((ancla) => (
            <Card key={ancla.n} withBorder r="md" padding="none" overflow="hidden">
              <Placeholder ratio={1} icon="anchor" />
              <Box p="xs">
                <Text fz="caption" fw="semibold" truncate>
                  {ancla.n} · {ancla.papel}
                </Text>
                <Text fz="caption" c="text.muted" truncate>
                  mínimo {ancla.minimo}
                </Text>
              </Box>
            </Card>
          ))}
        </SimpleGrid>
        <Text fz="caption" c="text.muted" mt="sm">
          El mínimo de cada ancla <strong>se mide</strong>, no se elige: es lo que conservan las
          generaciones normales. Las tres últimas solo viajan en trabajos de escalón C o D.
        </Text>
        <Button size="sm" variant="ghost" fullWidth mt="sm" rightSection={<Icon name="refresh" />}>
          Rehacer el juego · {Rosets(TARIFA.anclasDetalle)}
        </Button>
      </GlassSurface>
    </SimpleGrid>
  );
}

/* ── Assets del avatar ──────────────────────────────────────────────────────── */

const UBICACIONES = [
  { nombre: "Azotea al atardecer", outfits: 6, peinados: 2, conIcono: true },
  { nombre: "Gimnasio", outfits: 3, peinados: 1, conIcono: true },
  { nombre: "Cocina de casa", outfits: 4, peinados: 2, conIcono: false },
];

function Assets(): ReactElement {
  return (
    <Box>
      <Flex align="center" justify="space-between" gap="sm" wrap="wrap" mb="md">
        <Text fz="body3" c="text.muted">
          Outfits y peinados se categorizan por ubicación. La relación orienta, no restringe.
        </Text>
        <Button size="sm" variant="glass" rightSection={<Icon name="plus" />}>
          Nuevo asset
        </Button>
      </Flex>
      <SimpleGrid cols={Cols({ base: 1, tablet: 2, laptop: 3 })} spacing="md">
        {UBICACIONES.map((ubicacion) => (
          <Card key={ubicacion.nombre} withBorder r="lg" padding="none" overflow="hidden">
            <Placeholder
              ratio={16 / 9}
              icon="pin"
              label={ubicacion.conIcono ? undefined : `Sin icono · ${Rosets(TARIFA.iconoAsset)}`}
            />
            <Box p="sm">
              <Text fz="body3" fw="semibold" truncate>
                {ubicacion.nombre}
              </Text>
              <Text fz="caption" c="text.muted">
                {ubicacion.outfits} outfits · {ubicacion.peinados} peinados
              </Text>
            </Box>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}

/* ── La pantalla ────────────────────────────────────────────────────────────── */

const TRAIL: BreadcrumbItem[] = [
  { key: "avatares", label: "Avatares", href: "#avatares" },
  { key: "actual", label: AVATAR_ACTIVO.nombre },
];

const ACCIONES: MenuItemData[] = [
  { key: "exportar", label: "Exportar el canon", description: "gratis" },
  {
    key: "duplicar",
    label: "Duplicar",
    description: "hereda el juego de anclas, así que no genera nada",
  },
  { key: "archivar", label: "Archivar", danger: true },
];

const PESTANAS: TabItem[] = [
  { value: "taller", label: "Taller", content: <Taller /> },
  { value: "galeria", label: "Galería", content: <Galeria /> },
  { value: "chat", label: "Chat", content: <Chat /> },
  { value: "identidad", label: "Identidad", content: <Identidad /> },
  { value: "assets", label: "Assets", content: <Assets /> },
];

/* ── Ajustes ──────────────────────────────────────────────────────────────────
 * Decisiones del titular, 06/08/2026. Son dos interruptores y no uno, y el orden
 * importa: **clonable cuelga de público**. Un avatar privado no puede ser
 * clonable, así que el segundo se apaga y se explica en vez de desaparecer.    */

function Ajustes({ abierto, onClose }: { abierto: boolean; onClose: () => void }): ReactElement {
  const [publico, set_publico] = useState(AVATAR_ACTIVO.publico);
  const [clonable, set_clonable] = useState(AVATAR_ACTIVO.clonable);

  return (
    <Drawer opened={abierto} onClose={onClose} side="end" size={420} title="Ajustes del avatar">
      <Rotulo>Visibilidad</Rotulo>
      <Switch
        checked={publico}
        onChange={(valor) => {
          set_publico(valor);
          if (!valor) set_clonable(false);
        }}
        label="Avatar público"
      />
      <Text fz="caption" c="text.muted" mt="xxs">
        {publico
          ? "Aparece en Explorar. Qué imágenes, vídeos y audios suyos se ven se elige pieza a pieza en la Galería, y lo que no marques no sale."
          : "Solo lo ve quien entre a Casa Rosette. Ni el avatar ni ninguna de sus piezas aparecen fuera."}
      </Text>

      <Divider my="md" />

      <Rotulo>Clonar</Rotulo>
      <Switch
        checked={clonable}
        disabled={!publico}
        onChange={set_clonable}
        label="Otros estudios pueden clonarlo"
      />
      <Text fz="caption" c="text.muted" mt="xxs">
        {publico
          ? "El clon parte de este canon y de este juego de anclas. Lo decide el estudio, avatar por avatar: ser público no lo implica."
          : "Un avatar privado no se puede clonar. Enciende «público» primero."}
      </Text>

      {clonable ? (
        <Alert
          variant="light"
          color="warning"
          mt="sm"
          icon={<Icon name="warning" />}
          title="Lo que estás autorizando"
        >
          Un clon hereda la identidad en píxel, así que a partir de ahí habrá dos avatares que se
          parecen. Y el consentimiento sobre las fotos que construyeron a {AVATAR_ACTIVO.nombre} se
          aceptó <strong>aquí</strong>: el clon vivirá en otro estudio.
        </Alert>
      ) : null}

      <Divider my="md" />

      <Rotulo>Techo declarado</Rotulo>
      <Flex align="center" justify="space-between" gap="sm">
        <Text fz="body3">Escalón máximo de este avatar</Text>
        <Badge variant="light" size="lg">
          {AVATAR_ACTIVO.techo}
        </Badge>
      </Flex>
      <Text fz="caption" c="text.muted" mt="xxs">
        Gana el más restrictivo de los tres: el del estudio, el del avatar y el de tu permiso.
        Bajarlo no retira lo ya generado.
      </Text>
    </Drawer>
  );
}

function VistaDeAvatar({
  pestana = "taller",
  ajustesAbiertos = false,
}: {
  pestana?: string | undefined;
  ajustesAbiertos?: boolean | undefined;
}): ReactElement {
  const [ajustes, set_ajustes] = useState(ajustesAbiertos);

  return (
    <Shell active="avatares" title={`${AVATAR_ACTIVO.nombre} — Rosette`}>
      <AppShell.Section aria-label={AVATAR_ACTIVO.nombre}>
        <AppShell.Header
          sticky
          title={AVATAR_ACTIVO.nombre}
          subtitle={`Canon v${String(AVATAR_ACTIVO.canon)} · techo ${AVATAR_ACTIVO.techo} · ${String(AVATAR_ACTIVO.activos)} activos`}
          actions={
            <Group gap="sm">
              <StatusBadge
                status={AVATAR_ACTIVO.publico ? "publico" : "privado"}
                map={VISIBILIDAD}
                size="sm"
              />
              <StatusBadge status={AVATAR_ACTIVO.estado} map={ESTADO_AVATAR} size="sm" />
              <Button
                size="sm"
                variant="glass"
                onPress={() => {
                  set_ajustes(true);
                }}
                rightSection={<Icon name="settings" />}
              >
                Ajustes
              </Button>
              <Menu
                items={ACCIONES}
                aria-label="Acciones del avatar"
                trigger={
                  <ActionIcon variant="glass" size="sm" aria-label="Acciones del avatar">
                    <Icon name="more" />
                  </ActionIcon>
                }
              />
            </Group>
          }
        />
        <AppShell.Subbar sticky>
          <Breadcrumbs items={TRAIL} />
        </AppShell.Subbar>
        <AppShell.Content p="none">
          <Tabs data={PESTANAS} defaultValue={pestana} padded aria-label="Secciones del avatar" />
        </AppShell.Content>
      </AppShell.Section>

      <Ajustes
        abierto={ajustes}
        onClose={() => {
          set_ajustes(false);
        }}
      />
    </Shell>
  );
}

const meta: Meta = {
  title: "Patterns/Rosette/El avatar",
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj;

/**
 * **El avatar ES el taller.** Es la decisión que da forma a todo lo demás, y la recomendación
 * es esta, no la contraria.
 *
 * *Opción A — una sola vista.* Galería, chat, identidad y assets son pestañas del avatar. Coste
 * de navegación: cero saltos para ajustar una generación mirando el canon. Coste cognitivo: la
 * pestaña `Taller` es densa, y hay que entrar al avatar para generar.
 *
 * *Opción B — ficha y taller separados.* La vista del avatar es su ficha, y «generar» abre el
 * taller con él cargado. Coste de navegación: cada comprobación de canon, de ancla o de asset es
 * un viaje de ida y vuelta. Coste cognitivo: menor por pantalla, mayor en total —dos modelos
 * mentales del mismo objeto—.
 *
 * *Por qué gana A, y no es gusto.* El modelo ya lo impone por tres sitios: el canon está
 * versionado y **cada activo apunta a la versión con la que se generó**, los assets de escena
 * cuelgan del avatar, y el chat comparte con la generación el mismo canon condensado. Con la
 * opción B esas tres relaciones quedan repartidas entre dos pantallas y hay que reconstruirlas a
 * mano cada vez. Con la A viven donde viven en los datos.
 *
 * *Qué hace aquí un usuario que en ourdream le cuesta más.* Ver, **antes de gastar**, las siete
 * partes del prompt que se van a mandar y con qué versión de canon. En ourdream una imagen que
 * sale mal no se puede explicar; aquí el sidecar de cada activo dice el prompt literal, las
 * anclas enviadas y el modelo.
 *
 * Se corrigen además tres cosas del primer intento: «Estudio» pasa a ser el inquilino y esta
 * pantalla se llama **Taller**; los créditos son **rosets**; y la memoria deja de ser un cuadro
 * de texto con tope de caracteres para ser **las tres capas de §9.2**.
 */
export const ElTaller: Story = {
  name: "El avatar es el taller",
  render: () => (
    <Escena>
      <VistaDeAvatar />
    </Escena>
  ),
};

/**
 * **La galería es donde se elige qué sale del estudio.** Decisión del titular, 06/08/2026: el
 * avatar es público o privado, y si es público el estudio selecciona **qué imágenes, vídeos y
 * audios** lo son.
 *
 * La selección va **por pieza**, así que vive aquí y no en los ajustes: marcar el avatar como
 * público no publica nada por sí solo, y lo que no se marca no sale aunque el avatar lo esté. Es
 * la dirección segura —hay que decir que sí, pieza a pieza— y es la que deja el sidecar de cada
 * activo diciendo también su visibilidad.
 */
export const PiezasPublicas: Story = {
  name: "Qué piezas son públicas",
  render: () => (
    <Escena>
      <VistaDeAvatar pestana="galeria" />
    </Escena>
  ),
};

/**
 * **Dos interruptores, y el segundo cuelga del primero.** Público decide si el avatar aparece
 * fuera de Casa Rosette; **clonable** decide, aparte, si otro estudio puede partir de su canon y
 * de su juego de anclas. Ser público no implica ser clonable, y un avatar privado no puede serlo:
 * el interruptor se apaga y dice por qué en vez de desaparecer.
 *
 * Al encender «clonable» la pantalla dice lo que se está autorizando, que es lo que ninguna
 * casilla de términos explica: el clon **hereda la identidad en píxel** —a partir de ahí hay dos
 * avatares que se parecen— y el consentimiento sobre las fotos que construyeron a este se aceptó
 * en **este** estudio, mientras que el clon vivirá en otro.
 */
export const AjustesDelAvatar: Story = {
  name: "Público, privado y clonable",
  render: () => (
    <Escena>
      <VistaDeAvatar ajustesAbiertos />
    </Escena>
  ),
};
