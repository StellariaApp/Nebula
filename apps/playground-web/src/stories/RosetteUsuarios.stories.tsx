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
  Flex,
  GlassSurface,
  Group,
  Menu,
  Segment,
  Select,
  SimpleGrid,
  Table,
  Text,
  TextInput,
  Tooltip,
  type MenuItemData,
} from "@stellaria/nebula-web";

import { Cols, Escena, Icon, PLAN, Rotulo, Shell } from "../fixtures/rosette.js";

/* ── Los usuarios del estudio ─────────────────────────────────────────────────
 * Aquí vive el TERCER techo. §5.1 regla 4: el escalón se comprueba contra el
 * techo del estudio, el del avatar y **el permiso del miembro**, y gana el más
 * restrictivo. Los dos primeros ya tenían pantalla; este no tenía ninguna.
 *
 * Y un techo por miembro no es un adorno: es lo que deja meter a un asistente a
 * producir sin darle acceso a todo lo que el estudio puede producir.           */

type Papel = "Propietario" | "Administrador" | "Operador" | "Invitado";

interface Miembro {
  id: string;
  nombre: string;
  correo: string;
  papel: Papel;
  techo: "A" | "B" | "C" | "D";
  ultimoAcceso: string;
  pendiente?: boolean | undefined;
}

const PAPEL_TONO: Record<Papel, "primary" | "accent" | "info" | "gray"> = {
  Propietario: "primary",
  Administrador: "accent",
  Operador: "info",
  Invitado: "gray",
};

const MIEMBROS: Miembro[] = [
  {
    id: "1",
    nombre: "William Covarrubias",
    correo: "will@casarosette.app",
    papel: "Propietario",
    techo: "D",
    ultimoAcceso: "ahora",
  },
  {
    id: "2",
    nombre: "Marta Ibáñez",
    correo: "marta@casarosette.app",
    papel: "Administrador",
    techo: "D",
    ultimoAcceso: "hace 2 h",
  },
  {
    id: "3",
    nombre: "Diego Serrano",
    correo: "diego@casarosette.app",
    papel: "Operador",
    techo: "A",
    ultimoAcceso: "ayer",
  },
  {
    id: "4",
    nombre: "Lucía Prats",
    correo: "lucia@casarosette.app",
    papel: "Invitado",
    techo: "A",
    ultimoAcceso: "—",
    pendiente: true,
  },
];

const ACCIONES: MenuItemData[] = [
  { key: "papel", label: "Cambiar el papel" },
  { key: "techo", label: "Cambiar su techo", description: "queda con autor y fecha" },
  { key: "reenviar", label: "Reenviar la invitación" },
  { key: "quitar", label: "Quitar del estudio", danger: true },
];

const PAPELES = [
  {
    papel: "Propietario" as const,
    puede: "Todo, incluido el plan, el techo del estudio y quitar a cualquiera.",
  },
  {
    papel: "Administrador" as const,
    puede: "Crear avatares, gestionar usuarios y ver el saldo. No cambia el plan.",
  },
  {
    papel: "Operador" as const,
    puede: "Producir y revisar. Ve lo que cuesta lo que va a generar, no el ledger entero.",
  },
  { papel: "Invitado" as const, puede: "Mirar la galería. No genera y no gasta." },
];

function Invitar({ abierto, onClose }: { abierto: boolean; onClose: () => void }): ReactElement {
  const [papel, set_papel] = useState("Operador");
  const [techo, set_techo] = useState("A");

  return (
    <Drawer opened={abierto} onClose={onClose} side="end" size={420} title="Invitar al estudio">
      <TextInput
        label="Correo"
        placeholder="asistente@ejemplo.com"
        description="Si no tiene cuenta, la invitación se la crea."
      />

      <Rotulo mt="md">Papel</Rotulo>
      <Select
        aria-label="Papel del miembro"
        value={papel}
        onChange={set_papel}
        data={PAPELES.map((fila) => ({ value: fila.papel, label: fila.papel }))}
      />
      <Text fz="caption" c="text.muted" mt="xxs">
        {PAPELES.find((fila) => fila.papel === papel)?.puede}
      </Text>

      <Rotulo mt="md">Su techo</Rotulo>
      <Segment value={techo} onChange={set_techo} fullWidth size="sm">
        <Segment.Control aria-label="Techo del miembro">
          {["A", "B", "C", "D"].map((nivel) => (
            <Segment.Control.Item key={nivel} value={nivel}>
              {nivel}
            </Segment.Control.Item>
          ))}
        </Segment.Control>
      </Segment>
      <Text fz="caption" c="text.muted" mt="xxs">
        Es el <strong>tercer techo</strong>. Un asistente con techo A no puede producir por encima
        de A aunque el estudio y el avatar lleguen a D: gana el más restrictivo de los tres.
      </Text>

      <Alert variant="light" color="info" mt="md" icon={<Icon name="info" />}>
        El tope de asientos se comprueba <strong>antes</strong> de resolver a quién se invita.
        Invitar por correo a alguien que no existe le crea una cuenta, así que comprobar después
        dejaría un usuario huérfano por cada intento fallido.
      </Alert>

      <Button fullWidth mt="md" rightSection={<Icon name="send" />}>
        Enviar la invitación
      </Button>
    </Drawer>
  );
}

function Asientos({ gratis }: { gratis: boolean }): ReactElement {
  return (
    <GlassSurface level="subtle" r="lg" withBorder p="md">
      <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
        <Rotulo>Asientos</Rotulo>
        <Badge variant="light" size="sm" color={gratis ? "warning" : "success"}>
          plan {gratis ? "gratis" : PLAN.nombre}
        </Badge>
      </Flex>

      <Flex align="baseline" gap="xs">
        <Text fz="h3" fw="bold" lh="tight">
          {gratis ? 1 : MIEMBROS.length}
        </Text>
        <Text fz="body3" c="text.secondary">
          {gratis ? "de 1" : "sin tope"}
        </Text>
      </Flex>

      <Text fz="caption" c="text.muted" mt="xs">
        {gratis
          ? "El plan gratis es para una sola persona. Para invitar hace falta una suscripción de pago."
          : "Rosette no topa usuarios: el modelo de cobro es medido, no limitado. Un miembro de más no cuesta por sí mismo — cuesta lo que genere."}
      </Text>

      {gratis ? (
        <Button fullWidth mt="sm">
          Subir de plan
        </Button>
      ) : null}

      <Divider my="md" />

      <Rotulo>Los tres techos</Rotulo>
      <Box display="flex" direction="column" gap="xxs">
        {[
          { que: "Del estudio", valor: "D", donde: "ajustes del estudio" },
          { que: "Del avatar", valor: "D", donde: "ajustes de cada avatar" },
          { que: "Del miembro", valor: "A – D", donde: "esta pantalla" },
        ].map((fila) => (
          <Flex key={fila.que} align="center" justify="space-between" gap="sm">
            <Box miw={0}>
              <Text fz="body3">{fila.que}</Text>
              <Text fz="caption" c="text.muted" truncate>
                {fila.donde}
              </Text>
            </Box>
            <Badge size="xs" variant="outline" color="gray">
              {fila.valor}
            </Badge>
          </Flex>
        ))}
      </Box>
      <Text fz="caption" c="text.muted" mt="xs">
        Gana el más restrictivo, y se comprueba en cada generación. Bajar uno no retira lo que ya se
        produjo.
      </Text>
    </GlassSurface>
  );
}

function Tabla(): ReactElement {
  return (
    <Table.ScrollContainer>
      <Table highlightOnHover density="comfortable" caption="Usuarios de Casa Rosette">
        <Table.Head>
          <Table.Row>
            <Table.Title>Persona</Table.Title>
            <Table.Title>Papel</Table.Title>
            <Table.Title>Su techo</Table.Title>
            <Table.Title>Último acceso</Table.Title>
            <Table.Title align="end">Acciones</Table.Title>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {MIEMBROS.map((miembro) => (
            <Table.Row key={miembro.id}>
              <Table.Cell>
                <Flex align="center" gap="sm">
                  <Avatar name={miembro.nombre} size="sm" radius="full" />
                  <Box miw={0}>
                    <Flex align="center" gap="xs" wrap="wrap">
                      <Text fz="body3" fw="semibold" truncate>
                        {miembro.nombre}
                      </Text>
                      {miembro.pendiente === true ? (
                        <Badge size="xs" variant="outline" color="warning">
                          invitación pendiente
                        </Badge>
                      ) : null}
                    </Flex>
                    <Text fz="caption" c="text.muted" truncate>
                      {miembro.correo}
                    </Text>
                  </Box>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Badge variant="light" color={PAPEL_TONO[miembro.papel]}>
                  {miembro.papel}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Tooltip
                  label="El más restrictivo de los tres techos gana"
                  trigger={
                    <Badge size="xs" variant="outline" color="gray">
                      {miembro.techo}
                    </Badge>
                  }
                />
              </Table.Cell>
              <Table.Cell>
                <Text fz="caption" c="text.muted">
                  {miembro.ultimoAcceso}
                </Text>
              </Table.Cell>
              <Table.Cell align="end">
                <Menu
                  items={ACCIONES}
                  aria-label={`Acciones de ${miembro.nombre}`}
                  trigger={
                    <ActionIcon
                      variant="ghost"
                      size="sm"
                      aria-label={`Acciones de ${miembro.nombre}`}
                    >
                      <Icon name="more" />
                    </ActionIcon>
                  }
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Table.ScrollContainer>
  );
}

function Papeles(): ReactElement {
  return (
    <Box>
      <Rotulo mt="lg">Qué puede cada papel</Rotulo>
      <SimpleGrid cols={Cols({ base: 1, tablet: 2, laptop: 4 })} spacing="md">
        {PAPELES.map((fila) => (
          <Card key={fila.papel} withBorder r="md" p="none">
            <Box p="md">
              <Badge variant="light" color={PAPEL_TONO[fila.papel]} size="sm">
                {fila.papel}
              </Badge>
              <Text fz="caption" c="text.muted" mt="xs">
                {fila.puede}
              </Text>
            </Box>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}

function Usuarios({ gratis = false }: { gratis?: boolean | undefined }): ReactElement {
  const [invitar, set_invitar] = useState(false);

  return (
    <Shell active="usuarios" title="Usuarios — Rosette">
      <AppShell.Section aria-label="Usuarios del estudio">
        <AppShell.Header
          sticky
          title="Usuarios"
          subtitle="Quién entra a Casa Rosette, con qué papel y hasta qué escalón"
          actions={
            <Group gap="sm">
              <Button
                onPress={() => {
                  set_invitar(true);
                }}
                rightSection={<Icon name="plus" />}
              >
                Invitar
              </Button>
            </Group>
          }
        />
        <AppShell.Content>
          {gratis ? (
            <Alert
              variant="light"
              color="warning"
              icon={<Icon name="warning" />}
              title="El plan gratis es para una sola persona"
              mb="md"
              actions={<Button size="xs">Ver planes</Button>}
            >
              Invitar devuelve <strong>402</strong>, no 403: no es que no puedas, es que{" "}
              <strong>no puedes todavía</strong>. Es la diferencia entre un muro y una venta.
            </Alert>
          ) : null}

          <SimpleGrid cols={Cols({ base: 1, laptop: 4 })} spacing="md">
            <Box style={{ gridColumn: "span 3" }} miw={0}>
              <Tabla />
            </Box>
            <Asientos gratis={gratis} />
          </SimpleGrid>

          <Papeles />
        </AppShell.Content>
      </AppShell.Section>

      <Invitar
        abierto={invitar}
        onClose={() => {
          set_invitar(false);
        }}
      />
    </Shell>
  );
}

const meta: Meta = {
  title: "Patterns/Rosette/Usuarios",
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj;

/**
 * **Aquí vive el tercer techo, que hasta ahora no tenía pantalla.** §5.1 regla 4: el escalón se
 * comprueba contra el techo del estudio, el del avatar **y el permiso del miembro**, y gana el más
 * restrictivo. Los dos primeros ya se veían; el tercero no estaba en ningún sitio, así que el
 * modelo tenía una regla que la interfaz no podía cumplir.
 *
 * *Y no es un adorno.* Un techo por miembro es lo que deja meter a un asistente a producir sin
 * darle acceso a todo lo que el estudio puede producir. Es exactamente el caso que abre esta
 * sección del carril.
 *
 * *Rosette no topa usuarios.* El modelo de cobro es **medido, no limitado**: un miembro de más no
 * cuesta por sí mismo, cuesta lo que genere. Por eso la tarjeta de asientos dice «sin tope» en vez
 * de pintar un medidor que no existe — y por eso `null` y `0` no se pueden representar igual.
 *
 * *El aviso del cupo se comprueba antes de resolver a quién se invita*, y eso se dice en el cajón:
 * invitar por correo a alguien que no existe **le crea una cuenta**, así que comprobar después
 * dejaría un usuario huérfano por cada intento fallido.
 */
export const Equipo: Story = {
  name: "Papeles y el tercer techo",
  render: () => (
    <Escena>
      <Usuarios />
    </Escena>
  ),
};

/**
 * El mismo panel con el plan gratis, que es **un asiento y una entidad**. Invitar devuelve `402`,
 * no `403`, y la diferencia es de producto: un `403` dice *«no puedes»* y no deja nada que
 * ofrecer; un `402` dice *«no puedes todavía»* y lleva a un botón. Es la diferencia entre un muro
 * y una venta.
 */
export const PlanGratis: Story = {
  name: "Con el plan gratis · 402, no 403",
  render: () => (
    <Escena>
      <Usuarios gratis />
    </Escena>
  ),
};
