import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactElement } from "react";

import {
  ActionIcon,
  AppShell,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  EmptyState,
  Filters,
  Flex,
  GridList,
  Group,
  Menu,
  Progress,
  StatusBadge,
  Text,
  Tooltip,
  type FilterDescriptor,
  type GridListMode,
  type MenuItemData,
} from "@stellaria/nebula-web";

import {
  AVATARES,
  Escena,
  ESTADO_AVATAR,
  Icon,
  PLAN,
  Placeholder,
  Rosets,
  SALDO,
  Shell,
  TARIFA,
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
  { key: "duplicar", label: "Duplicar", description: "pendiente: ¿hereda las anclas o las rehace?" },
  { key: "archivar", label: "Archivar", danger: true },
];

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
    <Card withBorder radius="lg" padding="none" overflow="hidden" interactive href="#avatar">
      <Box position="relative">
        <Placeholder ratio={4 / 3} label={avatar.estado === "borrador" ? "Sin base" : undefined} />
        <Box position="absolute" style={{ top: 10, left: 10 }}>
          <StatusBadge status={avatar.estado} map={ESTADO_AVATAR} size="xs" />
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
          </Badge>
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
    <Card withBorder radius="md" padding="none">
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
    <Card withBorder radius="lg" padding="none">
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

function Avatares(): ReactElement {
  const [modo, set_modo] = useState<GridListMode>("grid");
  const [archivados, set_archivados] = useState(false);

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
              <Button size="sm" variant="ghost" rightSection={<Icon name="upload" />}>
                Desde fotos
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
          <Box mb="md" maw={520}>
            <Saldo />
          </Box>

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
 * *Duplicar queda propuesto y sin cerrar.* Está en el menú marcado como pendiente porque su precio
 * depende de algo que el corpus no dice: si el duplicado **hereda el juego de anclas** —y entonces
 * es gratis, y dos avatares comparten identidad en píxel— o **lo regenera** —y entonces cuesta 100
 * o 150 rosets—. Es pregunta para el propietario, no decisión de esta pantalla.
 */
export const ListaDeAvatares: Story = {
  name: "Rejilla o lista, sin medidor de plan",
  render: () => (
    <Escena>
      <Avatares />
    </Escena>
  ),
};
