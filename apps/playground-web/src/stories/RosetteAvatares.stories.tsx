import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactElement } from "react";

import {
  ActionIcon,
  Alert,
  AppShell,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Drawer,
  EmptyState,
  Filters,
  Flex,
  GridList,
  Group,
  SimpleGrid,
  Menu,
  Progress,
  StatusBadge,
  Switch,
  Text,
  Tooltip,
  type FilterDescriptor,
  type GridListMode,
  type MenuItemData,
} from "@stellaria/nebula-web";

import {
  AVATARES,
  Cols,
  Escena,
  ESTADO_AVATAR,
  Icon,
  PLAN,
  Placeholder,
  Rosets,
  Rotulo,
  SALDO,
  Shell,
  SIN_REVISAR,
  TARIFA,
  VISIBILIDAD,
  type AvatarFicha,
} from "../fixtures/rosette.js";

/* ── Qué se ve sin abrir ──────────────────────────────────────────────────────
 * Lo que el modelo ya sabe y que decide si merece la pena entrar: versión de
 * canon vigente, anclas completas o no, techo declarado, activos aprobados y
 * trabajos en cola. Nada de eso es decorativo: cada uno responde a «¿este avatar
 * puede producir ahora mismo?».                                                */

const ACCIONES: MenuItemData[] = [
  { key: "abrir", label: "Abrir el taller" },
  { key: "canon", label: "Ver el canon" },
  { key: "duplicar", label: "Duplicar", description: "hereda el juego de anclas" },
  { key: "archivar", label: "Archivar", danger: true },
];

/* ── Duplicar ─────────────────────────────────────────────────────────────────
 * Decisión del titular, 06/08/2026: **el duplicado hereda el juego de anclas**,
 * que es la opción barata. Y como §10.4 dice que solo se descuenta lo que el
 * sistema genera, heredar no genera nada: el duplicado no cuesta rosets. Lo que
 * se pague vendrá de lo que se genere después.                                 */

function Duplicar({
  avatar,
  abierto,
  onClose,
}: {
  avatar: AvatarFicha;
  abierto: boolean;
  onClose: () => void;
}): ReactElement {
  const [rehacer, set_rehacer] = useState(false);
  const juego = avatar.techo === "A" || avatar.techo === "B" ? TARIFA.anclasBase : TARIFA.anclasDetalle;

  return (
    <Drawer opened={abierto} onClose={onClose} side="end" size={420} title={`Duplicar ${avatar.nombre}`}>
      <Text fz="body3" c="text.secondary">
        El duplicado parte del canon v{avatar.canon} y <strong>hereda el juego de{" "}
        {avatar.anclas[1]} anclas y su validación</strong>. Nace en{" "}
        <strong>producible</strong>, listo para generar.
      </Text>

      <Rotulo mt="md">Lo que cuesta</Rotulo>
      <Box display="flex" direction="column" gap="xxs">
        {[
          { concepto: "Copia del canon", rosets: 0 },
          { concepto: `Juego de ${String(avatar.anclas[1])} anclas`, rosets: rehacer ? juego : 0 },
          { concepto: "Prueba de identidad", rosets: rehacer ? TARIFA.pruebaIdentidad : 0 },
        ].map((linea) => (
          <Flex key={linea.concepto} align="center" justify="space-between" gap="sm">
            <Text fz="caption" c="text.secondary" truncate>
              {linea.concepto}
            </Text>
            {linea.rosets === 0 ? (
              <Badge size="xs" variant="light" color="success">
                heredado
              </Badge>
            ) : (
              <Text fz="caption" fw="semibold" ws="nowrap">
                {Rosets(linea.rosets)}
              </Text>
            )}
          </Flex>
        ))}
      </Box>
      <Divider my="sm" />
      <Flex align="center" justify="space-between" gap="sm">
        <Text fz="body3" fw="semibold">
          Total
        </Text>
        <Badge variant="light" size="lg">
          {rehacer ? Rosets(juego + TARIFA.pruebaIdentidad) : "gratis"}
        </Badge>
      </Flex>
      <Text fz="caption" c="text.muted" mt="xxs">
        Heredar no genera nada, y solo se descuenta lo que el sistema genera. Lo que pagues vendrá
        de lo que produzcas con él.
      </Text>

      <Divider my="md" />

      <Switch
        checked={rehacer}
        onChange={set_rehacer}
        label="Rehacer el juego de anclas"
      />
      <Text fz="caption" c="text.muted" mt="xxs">
        Solo si quieres una identidad distinta. Es la opción cara y ya no es un duplicado: es un
        avatar nuevo con el canon copiado.
      </Text>

      {rehacer ? null : (
        <Alert variant="light" color="info" mt="md" icon={<Icon name="info" />}>
          Al heredar, los dos avatares comparten identidad en píxel. Es lo que hace barato el
          duplicado y lo que lo vuelve una <strong>variante</strong> —otro nombre, otro lore, otros
          assets— y no otra persona.
        </Alert>
      )}

      <Button fullWidth mt="md" rightSection={<Icon name="copy" />}>
        Duplicar
      </Button>
    </Drawer>
  );
}

/* ── Lo que te espera ─────────────────────────────────────────────────────────
 * Vivía en Home. Al retirarse Home —la raíz pasa a ser Explorar— se muda aquí,
 * que es donde se actúa sobre ello: la cuenta de sin revisar la lleva además el
 * propio carril, para que se vea desde el lado público del producto.           */

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
    <Card withBorder r="lg" padding="none">
      <Box p="md">
        <Flex align="center" gap="sm" mb="xs">
          <Box c={`${tono}.600`} display="flex">
            <Icon name={icono} size={18} />
          </Box>
          <Text fz="body3" fw="semibold">
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

function Dato({ label, valor }: { label: string; valor: string }): ReactElement {
  return (
    <Flex direction="column" miw={0}>
      <Text fz="caption" c="text.muted" truncate>
        {label}
      </Text>
      <Text fz="body3" fw="semibold" truncate>
        {valor}
      </Text>
    </Flex>
  );
}

function FichaGrande({ avatar }: { avatar: AvatarFicha }): ReactElement {
  const [puestas, total] = avatar.anclas;
  const completo = puestas === total;

  return (
    <Card withBorder r="lg" padding="none" overflow="hidden" interactive href="#avatar">
      <Box position="relative">
        <Placeholder ratio={4 / 3} label={avatar.estado === "borrador" ? "Sin base" : undefined} />
        <Box position="absolute" style={{ top: 10, left: 10 }}>
          <Group gap="xxs">
            <StatusBadge status={avatar.estado} map={ESTADO_AVATAR} size="xs" />
            <StatusBadge
              status={avatar.publico ? "publico" : "privado"}
              map={VISIBILIDAD}
              size="xs"
            />
          </Group>
        </Box>
        <Box position="absolute" style={{ top: 10, right: 10 }}>
          <Menu
            items={ACCIONES}
            aria-label={`Acciones de ${avatar.nombre}`}
            trigger={
              <ActionIcon
                variant="glass"
                glass="strong"
                size="xs"
                r="full"
                aria-label={`Acciones de ${avatar.nombre}`}
              >
                <Icon name="more" />
              </ActionIcon>
            }
          />
        </Box>
      </Box>

      <Box p="md">
        <Flex align="center" gap="sm" miw={0}>
          <Avatar name={avatar.nombre} size="sm" radius="full" />
          <Box miw={0} style={{ flex: 1 }}>
            <Text fz="body2" fw="semibold" truncate>
              {avatar.nombre}
            </Text>
            <Text fz="caption" c="text.muted" truncate>
              desde {avatar.origen} · canon v{avatar.canon}
            </Text>
          </Box>
        </Flex>

        <Divider my="sm" />

        <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
          <Tooltip
            label={
              completo
                ? "El juego está completo y validado"
                : `Faltan ${String(total - puestas)} anclas para poder producir`
            }
            trigger={
              <Badge
                size="xs"
                variant="light"
                color={completo ? "success" : "warning"}
                leftSection={<Icon name="anchor" size={11} />}
              >
                {puestas} de {total}
              </Badge>
            }
          />
          <Badge size="xs" variant="outline" color="gray">
            techo {avatar.techo}
          </Badge>
          <Badge size="xs" variant="outline" color="gray">
            {avatar.activos} activos
            {avatar.publico ? ` · ${String(avatar.activosPublicos)} públicos` : ""}
          </Badge>
          {avatar.clonable ? (
            <Tooltip
              label="El estudio permite que otros lo clonen"
              trigger={
                <Badge size="xs" variant="outline" color="accent">
                  clonable
                </Badge>
              }
            />
          ) : null}
          {avatar.cola > 0 ? (
            <Badge size="xs" variant="light" color="info">
              {avatar.cola} en cola
            </Badge>
          ) : null}
        </Flex>
      </Box>
    </Card>
  );
}

function FichaLista({ avatar }: { avatar: AvatarFicha }): ReactElement {
  const [puestas, total] = avatar.anclas;
  return (
    <Card withBorder r="md" padding="none">
      <Flex align="center" gap="md" p="sm" wrap="wrap">
        <Avatar name={avatar.nombre} size="md" radius="md" />
        <Box miw={160} style={{ flex: 1 }}>
          <Text fz="body3" fw="semibold" truncate>
            {avatar.nombre}
          </Text>
          <StatusBadge status={avatar.estado} map={ESTADO_AVATAR} size="xs" />
        </Box>
        <Dato label="Canon" valor={`v${String(avatar.canon)}`} />
        <Dato label="Anclas" valor={`${String(puestas)} de ${String(total)}`} />
        <Dato label="Techo" valor={avatar.techo} />
        <Dato label="Activos" valor={String(avatar.activos)} />
        <Dato label="En cola" valor={String(avatar.cola)} />
        <Menu
          items={ACCIONES}
          aria-label={`Acciones de ${avatar.nombre}`}
          trigger={
            <ActionIcon variant="ghost" size="sm" aria-label={`Acciones de ${avatar.nombre}`}>
              <Icon name="more" />
            </ActionIcon>
          }
        />
      </Flex>
    </Card>
  );
}

const FILTROS: FilterDescriptor[] = [
  {
    key: "estado",
    label: "Estado",
    type: "multiselect",
    options: [
      { value: "borrador", label: "Borrador" },
      { value: "completado", label: "Completado" },
      { value: "anclado", label: "Anclado" },
      { value: "producible", label: "Producible" },
      { value: "archivado", label: "Archivado" },
    ],
  },
  {
    key: "techo",
    label: "Techo",
    type: "multiselect",
    options: [
      { value: "A", label: "A" },
      { value: "B", label: "B" },
      { value: "C", label: "C" },
      { value: "D", label: "D" },
    ],
  },
];

function Saldo(): ReactElement {
  const asignado = PLAN.rosetsMes;
  const usado = asignado - SALDO.rosets;
  return (
    <Card withBorder r="lg" padding="none">
      <Box p="md">
        <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
          <Flex align="center" gap="xs" c="primary.600">
            <Icon name="roset" size={16} />
            <Text fz="body3" fw="semibold" c="text.primary">
              {Rosets(SALDO.rosets)}
            </Text>
          </Flex>
          <Text fz="caption" c="text.muted">
            {Math.round((usado / asignado) * 100)} % del ciclo consumido
          </Text>
        </Flex>
        <Progress value={(usado / asignado) * 100} size="xs" mt="xs" label="Consumo del ciclo" />
        <Text fz="caption" c="text.muted" mt="xs">
          Crear un avatar cuesta {Rosets(TARIFA.anclasBase + TARIFA.pruebaIdentidad + TARIFA.canon)}{" "}
          con techo A y {Rosets(TARIFA.anclasDetalle + TARIFA.pruebaIdentidad + TARIFA.canon)} con
          techo C o D. <strong>El único freno aquí es el saldo</strong>: el plan no topa avatares,
          Rosette cobra medido.
        </Text>
      </Box>
    </Card>
  );
}

function Avatares({ duplicando = false }: { duplicando?: boolean | undefined }): ReactElement {
  const [modo, set_modo] = useState<GridListMode>("grid");
  const [archivados, set_archivados] = useState(false);
  const [duplicar, set_duplicar] = useState(duplicando);

  const items = AVATARES.filter((avatar) =>
    archivados ? avatar.estado === "archivado" : avatar.estado !== "archivado",
  );

  return (
    <Shell active="avatares" title="Avatares del estudio — Rosette">
      <AppShell.Section aria-label="Avatares del estudio">
        <AppShell.Header
          sticky
          title="Avatares del estudio"
          subtitle="Cuelgan de Casa Rosette, no de ti: quien entre al estudio los ve"
          actions={
            <Group gap="sm">
              <Button
                size="sm"
                variant="ghost"
                onPress={() => {
                  set_duplicar(true);
                }}
                rightSection={<Icon name="copy" />}
              >
                Duplicar
              </Button>
              <Button size="sm" rightSection={<Icon name="plus" />}>
                Crear avatar
              </Button>
            </Group>
          }
        />
        <AppShell.Subbar sticky>
          <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
            <Filters filters={FILTROS} size="sm" />
            <Button
              size="sm"
              variant="ghost"
              onPress={() => {
                set_archivados((valor) => !valor);
              }}
            >
              {archivados ? "Ver activos" : "Ver archivados"}
            </Button>
          </Flex>
        </AppShell.Subbar>
        <AppShell.Content>
          <SimpleGrid cols={Cols({ base: 1, tablet: 2, laptop: 4 })} spacing="md" mb="md">
            <Pendiente
              icono="check-square"
              tono="accent"
              titulo={`${String(SIN_REVISAR)} sin revisar`}
              detalle="En Rose Aldana y en Nadia Ortiz. Sin ratón: 40 caben en 15 minutos."
              accion="Revisar"
            />
            <Pendiente
              icono="loader"
              tono="info"
              titulo={`${String(SALDO.trabajosEnCurso)} trabajos en curso`}
              detalle={`De los ${String(PLAN.trabajos)} que permite el plan ${PLAN.nombre}.`}
              accion="Ver la cola"
            />
            <Pendiente
              icono="warning"
              tono="warning"
              titulo="1 avatar a medias"
              detalle="Nadia Ortiz tiene 8 de 9 anclas: la dorsal salió contradicha."
              accion="Terminar Nadia Ortiz"
            />
            <Saldo />
          </SimpleGrid>

          <GridList
            items={items}
            mode={modo}
            onModeChange={set_modo}
            modes={["grid", "list"]}
            getKey={(avatar) => avatar.id}
            minColWidth={260}
            label="Avatares del estudio"
            empty={
              <EmptyState
                title={archivados ? "No hay avatares archivados" : "Todavía no hay avatares"}
                description="Archivar es organización, no un tope: un avatar archivado sigue existiendo y se puede devolver."
                icon={<Icon name="users" size={24} />}
              />
            }
            renderItem={(avatar, mode) =>
              mode === "list" ? (
                <FichaLista avatar={avatar} />
              ) : (
                <FichaGrande avatar={avatar} />
              )
            }
          />
        </AppShell.Content>
      </AppShell.Section>

      <Duplicar
        avatar={AVATARES[0] as AvatarFicha}
        abierto={duplicar}
        onClose={() => {
          set_duplicar(false);
        }}
      />
    </Shell>
  );
}

const meta: Meta = {
  title: "Patterns/Rosette/Avatares del estudio",
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj;

/**
 * **Rejilla con conmutador a lista, y no carril.** Un carril obliga a recorrer para comparar, y
 * aquí lo que se hace es comparar: qué avatar puede producir ya y cuál está a medias.
 *
 * *Qué se ve sin abrir, y por qué esos cinco datos.* Versión de canon vigente, anclas puestas
 * sobre las que hacen falta, techo declarado, activos aprobados y trabajos en cola. Los cinco
 * responden a una sola pregunta —**¿este avatar puede producir ahora mismo?**— y el modelo ya los
 * tiene: no hay que inventar ninguno. En rejilla van como fichas; en lista, como columnas
 * comparables. `GridList` trae el conmutador, así que la story no lo reconstruye.
 *
 * *No lleva medidor de plan, y es a propósito.* El avatar no es «entidad principal» y el plan no
 * lo topa: Rosette cobra **medido**, y el avatar ya se paga en rosets al crearse. Poner aquí una
 * barra de «3 de 6 avatares» sería inventarse un tope que el corpus retiró. El único freno visible
 * es el saldo, y por eso la tarjeta de saldo dice lo que cuesta crear uno **antes** de que se pulse
 * el botón.
 *
 * *Archivar sí, y no toca ningún tope.* Un estudio con doce avatares acumula borradores; archivar
 * es organización. Un avatar archivado sigue existiendo, sigue contando y se devuelve.
 *
 * *Duplicar hereda* — decisión del titular, 06/08/2026. Ver la historia de al lado.
 *
 * *Y la visibilidad se ve sin abrir.* Público o privado por avatar, cuántas de sus piezas están
 * publicadas, y si el estudio permite clonarlo. Son tres cosas distintas y aquí se leen de un
 * vistazo, que es lo que evita publicar algo creyendo que era privado.
 */
export const ListaDeAvatares: Story = {
  name: "Rejilla o lista, sin medidor de plan",
  render: () => (
    <Escena>
      <Avatares />
    </Escena>
  ),
};

/**
 * **Duplicar hereda el juego de anclas**, que es la opción barata — decisión del titular,
 * 06/08/2026.
 *
 * *Y heredar sale gratis, que no es una concesión sino aritmética.* §10.4 dice que solo se
 * descuenta lo que el sistema **genera**; un duplicado que hereda no genera nada, así que no hay
 * nada que cobrar. Lo que se pague vendrá de lo que se produzca con él después. El interruptor de
 * «rehacer el juego» está al lado para que se vea el otro lado de la cuenta: 100 o 150 más la
 * prueba de identidad.
 *
 * *Lo que la pantalla dice y una casilla de términos no diría:* al heredar, los dos avatares
 * comparten **identidad en píxel**. Eso es exactamente lo que hace barato al duplicado, y lo que
 * lo convierte en una **variante** —otro nombre, otro lore, otros assets— y no en otra persona.
 * Quien quiera otra identidad tiene que rehacer las anclas, y entonces ya no está duplicando.
 */
export const DuplicarAvatar: Story = {
  name: "Duplicar hereda las anclas",
  render: () => (
    <Escena>
      <Avatares duplicando />
    </Escena>
  ),
};
