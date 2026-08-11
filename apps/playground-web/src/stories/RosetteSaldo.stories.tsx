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
  Group,
  NumberInput,
  Progress,
  Segment,
  SimpleGrid,
  Stat,
  Switch,
  Table,
  Text,
  Tooltip,
} from "@stellaria/nebula-web";

import {
  Cols,
  Escena,
  Icon,
  Miles,
  PLAN,
  PLANES,
  Rosets,
  Rotulo,
  SALDO,
  Shell,
} from "../fixtures/rosette.js";

/* ── El ledger ────────────────────────────────────────────────────────────────
 * Asientos inmutables. El saldo es la suma de los asientos del ciclo, no un
 * campo que alguien incrementa: dos contadores mintieron el mismo día y se
 * arreglaron reconciliando contra disco.                                       */

const ASIENTOS = [
  {
    fecha: "05/08 14:12",
    concepto: "Tanda de 3 candidatas · Rose Aldana",
    tipo: "consumo",
    rosets: -30,
    coste: "$0,2520",
  },
  {
    fecha: "05/08 14:02",
    concepto: "Reserva · 3 trabajos",
    tipo: "reserva",
    rosets: -30,
    coste: "—",
  },
  {
    fecha: "05/08 13:58",
    concepto: "Trabajo fallido · transporte",
    tipo: "devolución",
    rosets: 10,
    coste: "$0,0000",
  },
  {
    fecha: "05/08 11:20",
    concepto: "Juego de 9 anclas · Nadia Ortiz",
    tipo: "consumo",
    rosets: -150,
    coste: "$0,7152",
  },
  {
    fecha: "05/08 09:04",
    concepto: "Recarga automática",
    tipo: "recarga",
    rosets: 1428,
    coste: "$50,00",
  },
  {
    fecha: "01/08 00:00",
    concepto: "Asignación del ciclo · plan Pro",
    tipo: "asignación",
    rosets: 11900,
    coste: "—",
  },
];

const TIPO_TONO = {
  consumo: "gray",
  reserva: "info",
  devolución: "success",
  recarga: "accent",
  asignación: "primary",
} as const;

function Recarga(): ReactElement {
  const [activa, set_activa] = useState(true);

  return (
    <GlassSurface level="subtle" r="lg" withBorder p="md">
      <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
        <Rotulo>Recarga automática y límite del ciclo</Rotulo>
        <Switch
          checked={activa}
          onChange={set_activa}
          label="Recarga automática"
          aria-label="Recarga automática"
        />
      </Flex>

      <Text fz="body3" c="text.secondary">
        Los dos ajustes son <strong>una sola función</strong> y por eso están en la misma tarjeta:
        una recarga automática sin tope es la forma más rápida de vaciarle la tarjeta a un cliente.
      </Text>

      <SimpleGrid cols={Cols({ base: 1, tablet: 2 })} spacing="md" mt="md">
        <NumberInput
          label="Cuando el saldo baje de"
          description="El umbral se expresa en rosets"
          defaultValue={SALDO.umbralRecarga}
          min={0}
          step={100}
          disabled={!activa}
        />
        <NumberInput
          label="Compra por"
          description="El importe, en dinero y en la moneda del estudio"
          defaultValue={50}
          min={25}
          step={25}
          disabled={!activa}
        />
      </SimpleGrid>

      <Divider my="md" />

      <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
        <Box miw={0}>
          <Text fz="body3" fw="semibold">
            Límite de gasto del ciclo
          </Text>
          <Text fz="caption" c="text.muted">
            Obligatorio. Es el freno de mano de la recarga automática, recargas incluidas.
          </Text>
        </Box>
        <Badge variant="light" size="lg">
          {Rosets(SALDO.limiteCiclo)}
        </Badge>
      </Flex>
      <Progress
        value={(SALDO.gastadoCiclo / SALDO.limiteCiclo) * 100}
        size="sm"
        mt="sm"
        color={SALDO.gastadoCiclo / SALDO.limiteCiclo > 0.8 ? "warning" : "primary"}
        label="Gasto del ciclo contra su límite"
      />
      <Text fz="caption" c="text.muted" mt="xxs">
        {Rosets(SALDO.gastadoCiclo)} de {Rosets(SALDO.limiteCiclo)}. Al llegar, la API contesta{" "}
        <strong>402</strong> y no sale trabajo nuevo — pero{" "}
        <strong>un lote ya reservado termina siempre</strong>: el límite se evalúa al reservar,
        nunca a mitad de ejecución.
      </Text>
    </GlassSurface>
  );
}

function Planes(): ReactElement {
  return (
    <Box>
      <Rotulo>Los tres planes</Rotulo>
      <SimpleGrid cols={Cols({ base: 1, tablet: 3 })} spacing="md">
        {PLANES.map((plan) => {
          const actual = plan.nombre === PLAN.nombre;
          return (
            <Card
              key={plan.nombre}
              withBorder
              r="lg"
              padding="none"
              variant={actual ? "light" : "outline"}
            >
              <Box p="md">
                <Flex align="center" justify="space-between" gap="sm">
                  <Text fz="body2" fw="semibold">
                    {plan.nombre}
                  </Text>
                  {actual ? (
                    <Badge size="xs" variant="light">
                      tu plan
                    </Badge>
                  ) : null}
                </Flex>
                <Text fz="h4" fw="bold" mt="xxs">
                  {plan.precio}
                  <Text component="span" fz="caption" c="text.muted">
                    {" "}
                    / mes
                  </Text>
                </Text>
                <Divider my="sm" />
                <Box display="flex" direction="column" gap="xxs">
                  {[
                    { label: "Rosets al mes", valor: Miles(plan.rosetsMes) },
                    { label: "Avatares", valor: String(plan.avatares) },
                    { label: "Trabajos a la vez", valor: String(plan.trabajos) },
                  ].map((linea) => (
                    <Flex key={linea.label} align="center" justify="space-between" gap="sm">
                      <Text fz="caption" c="text.muted">
                        {linea.label}
                      </Text>
                      <Text fz="caption" fw="semibold">
                        {linea.valor}
                      </Text>
                    </Flex>
                  ))}
                </Box>
              </Box>
            </Card>
          );
        })}
      </SimpleGrid>
      <Text fz="caption" c="text.muted" mt="sm">
        Los rosets se renuevan cada mes y no se acumulan; en anual, arrastre de hasta la mitad de lo
        no usado a un solo mes siguiente.{" "}
        <strong>Subir de plan siempre sale mejor que comprar saldo suelto</strong>, y eso no es una
        promesa comercial: el roset extra más barato queda a $0,028 y ninguno de los tres planes
        llega ahí.
      </Text>
    </Box>
  );
}

function Ledger(): ReactElement {
  return (
    <Box>
      <Flex align="center" justify="space-between" gap="sm" wrap="wrap" mb="sm">
        <Rotulo>Movimientos del ciclo</Rotulo>
        <Group gap="xs">
          <Segment defaultValue="ciclo" size="sm">
            <Segment.Control aria-label="Periodo del ledger">
              <Segment.Control.Item value="ciclo">Este ciclo</Segment.Control.Item>
              <Segment.Control.Item value="todo">Todo</Segment.Control.Item>
            </Segment.Control>
          </Segment>
          <Button size="sm" variant="ghost" rightSection={<Icon name="download" />}>
            Exportar
          </Button>
        </Group>
      </Flex>

      <Table.ScrollContainer>
        <Table density="comfortable" caption="Asientos del ledger de rosets">
          <Table.Head>
            <Table.Row>
              <Table.Title>Fecha</Table.Title>
              <Table.Title>Concepto</Table.Title>
              <Table.Title>Tipo</Table.Title>
              <Table.Title align="end">Rosets</Table.Title>
              <Table.Title align="end">Coste real</Table.Title>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {ASIENTOS.map((asiento) => (
              <Table.Row key={asiento.fecha}>
                <Table.Cell>
                  <Text fz="caption" c="text.muted" ws="nowrap">
                    {asiento.fecha}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text fz="body3">{asiento.concepto}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge size="xs" variant="light" color={TIPO_TONO[asiento.tipo as "consumo"]}>
                    {asiento.tipo}
                  </Badge>
                </Table.Cell>
                <Table.Cell align="end">
                  <Text fz="body3" fw="semibold" c={asiento.rosets > 0 ? "success.500" : undefined}>
                    {asiento.rosets > 0 ? "+" : ""}
                    {Miles(asiento.rosets)}
                  </Text>
                </Table.Cell>
                <Table.Cell align="end">
                  <Text fz="caption" c="text.muted" ff="mono">
                    {asiento.coste}
                  </Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Table.ScrollContainer>

      <Text fz="caption" c="text.muted" mt="sm">
        Los asientos son inmutables: un error se corrige con un asiento de ajuste que cita al
        anterior, nunca editando. El saldo es la suma de los asientos del ciclo — el campo del saldo
        es una caché reconstruible, no la verdad. Y cada consumo guarda el{" "}
        <strong>coste real del proveedor</strong>, que es lo único que permite auditar el margen en
        vez de creérselo.
      </Text>
    </Box>
  );
}

function SaldoYGasto({ consumido }: { consumido: number }): ReactElement {
  const asignado = PLAN.rosetsMes;
  const pct = Math.round((consumido / asignado) * 100);

  return (
    <Shell active="saldo" title="Saldo y gasto — Rosette">
      <AppShell.Section aria-label="Saldo y gasto">
        <AppShell.Header
          sticky
          title="Saldo y gasto"
          subtitle="Prepago. El saldo nunca entra en negativo"
          actions={
            <Group gap="sm">
              <Button size="sm" variant="ghost">
                Comprar rosets
              </Button>
              <Button size="sm">Cambiar de plan</Button>
            </Group>
          }
        />
        <AppShell.Content>
          {pct >= 80 ? (
            <Alert
              variant="light"
              color="warning"
              icon={<Icon name="warning" />}
              title={`Has consumido el ${String(pct)} % de la asignación del ciclo`}
              mb="md"
            >
              El porcentaje se mide contra <strong>lo asignado</strong>, no contra lo disponible: lo
              disponible baja también con las reservas abiertas, y avisaría por trabajos que todavía
              pueden fallar y devolver lo suyo. El aviso sale una vez por ciclo.
            </Alert>
          ) : null}

          <SimpleGrid cols={Cols({ base: 1, tablet: 2, laptop: 4 })} spacing="md">
            <Card withBorder r="lg" padding="none">
              <Box p="md">
                <Stat label="Saldo" value={Rosets(SALDO.rosets)} description="disponible ahora" />
              </Box>
            </Card>
            <Card withBorder r="lg" padding="none">
              <Box p="md">
                <Stat
                  label="Consumido"
                  value={`${String(pct)} %`}
                  description={`${Rosets(consumido)} de ${Rosets(asignado)}`}
                />
                <Progress value={pct} size="xs" mt="xs" label="Consumo del ciclo" />
              </Box>
            </Card>
            <Card withBorder r="lg" padding="none">
              <Box p="md">
                <Tooltip
                  label="Rosets de trabajos ya admitidos. Se convierten en consumo o vuelven"
                  trigger={
                    <Box>
                      <Stat
                        label="Retenido"
                        value={Rosets(SALDO.retenido)}
                        description={`${String(SALDO.trabajosEnCurso)} trabajos en curso`}
                      />
                    </Box>
                  }
                />
              </Box>
            </Card>
            <Card withBorder r="lg" padding="none">
              <Box p="md">
                <Stat
                  label="Trabajos a la vez"
                  value={`${String(SALDO.trabajosEnCurso)} de ${String(PLAN.trabajos)}`}
                  description={`lo fija el plan ${PLAN.nombre}`}
                />
              </Box>
            </Card>
          </SimpleGrid>

          <Box mt="md">
            <Recarga />
          </Box>

          <Box mt="lg">
            <Planes />
          </Box>

          <Box mt="lg">
            <Ledger />
          </Box>
        </AppShell.Content>
      </AppShell.Section>
    </Shell>
  );
}

const meta: Meta = {
  title: "Patterns/Rosette/Saldo y gasto",
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj;

/**
 * **Vive en su propia sección del carril, no encima del trabajo.** El saldo aparece en el pie del
 * carril —cifra y trabajos en curso— y el aviso de gasto aparece dentro del taller, antes de cada
 * botón. Todo lo demás —recarga, límite, planes, ledger— está aquí, donde no le roba sitio a
 * producir.
 *
 * *La recarga automática y el límite del ciclo van en la misma tarjeta, y no es maquetación.* El
 * corpus lo exige con estas palabras: quien enciende la recarga tiene que ver el tope en la misma
 * pantalla, porque una recarga automática sin tope es la forma más rápida de vaciarle la tarjeta a
 * un cliente. El umbral se expresa **en rosets** y el importe **en dinero**, que son unidades
 * distintas a propósito.
 *
 * *El aviso del 80 % dice contra qué se mide.* Contra lo **asignado**, no contra lo disponible: lo
 * disponible baja también con las reservas abiertas y avisaría por trabajos que aún pueden fallar
 * y devolver lo suyo.
 *
 * *El ledger enseña el coste real del proveedor por asiento.* Es lo que separa auditar el margen
 * de creérselo, y es la razón de que los asientos sean inmutables: un error se corrige con un
 * ajuste que cita al anterior.
 */
export const Saldo: Story = {
  name: "Prepago, recarga y límite del ciclo",
  render: () => (
    <Escena>
      <SaldoYGasto consumido={SALDO.gastadoCiclo} />
    </Escena>
  ),
};

/**
 * El mismo panel cruzando el umbral. El aviso del 80 % llega por correo y aparece aquí, **una vez
 * por ciclo**, y dice contra qué se mide para que nadie lo confunda con el saldo disponible.
 */
export const AlOchenta: Story = {
  name: "Al 80 % de la asignación",
  render: () => (
    <Escena>
      <SaldoYGasto consumido={Math.round(PLAN.rosetsMes * 0.83)} />
    </Escena>
  ),
};
