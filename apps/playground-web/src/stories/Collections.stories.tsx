import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Badge,
  Banderole,
  Box,
  Button,
  Card,
  GridList,
  Paper,
  SimpleGrid,
  Stat,
  Table,
  Text,
  Timeline,
  Title,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof Table> = {
  title: "Data Display/Collections",
  component: Table,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Table>;

interface Factura {
  id: string;
  cliente: string;
  estado: string;
  importe: number;
}

const FACTURAS: Factura[] = [
  { id: "F-1042", cliente: "Aurora S.A.", estado: "Pagada", importe: 12400 },
  { id: "F-1043", cliente: "Nébula Ltda.", estado: "Pendiente", importe: 8900 },
  { id: "F-1044", cliente: "Stellaria", estado: "Vencida", importe: 45300 },
  { id: "F-1045", cliente: "Cosmos", estado: "Pagada", importe: 2100 },
];

const MXN = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

export const Tables: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="xl">
      <Table caption="Facturas del trimestre" captionVisible striped highlightOnHover withBorder>
        <Table.Head>
          <Table.Row>
            <Table.Title>Folio</Table.Title>
            <Table.Title>Cliente</Table.Title>
            <Table.Title>Estado</Table.Title>
            <Table.Title numeric>Importe</Table.Title>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {FACTURAS.map((factura) => (
            <Table.Row key={factura.id}>
              <Table.Cell>{factura.id}</Table.Cell>
              <Table.Cell>{factura.cliente}</Table.Cell>
              <Table.Cell>
                <Badge variant="light" color={factura.estado === "Vencida" ? "error" : "success"}>
                  {factura.estado}
                </Badge>
              </Table.Cell>
              <Table.Cell numeric>{MXN.format(factura.importe)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Foot>
          <Table.Row>
            <Table.Title scope="row" colSpan={3}>
              Total
            </Table.Title>
            <Table.Cell numeric>
              {MXN.format(FACTURAS.reduce((sum, f) => sum + f.importe, 0))}
            </Table.Cell>
          </Table.Row>
        </Table.Foot>
      </Table>

      <Box maw={420}>
        <Text fz="caption" c="text.muted" mb="xs">
          En ScrollContainer: la región es enfocable, así que se recorre con teclado.
        </Text>
        <Table.ScrollContainer minWidth={560} label="Facturas">
          <Table density="compact">
            <Table.Head>
              <Table.Row>
                <Table.Title>Folio</Table.Title>
                <Table.Title>Cliente</Table.Title>
                <Table.Title>Estado</Table.Title>
                <Table.Title numeric>Importe</Table.Title>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {FACTURAS.map((factura) => (
                <Table.Row key={factura.id}>
                  <Table.Cell>{factura.id}</Table.Cell>
                  <Table.Cell>{factura.cliente}</Table.Cell>
                  <Table.Cell>{factura.estado}</Table.Cell>
                  <Table.Cell numeric>{MXN.format(factura.importe)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Table.ScrollContainer>
      </Box>
    </Box>
  ),
};

export const Timelines: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="xl" maw={420}>
      {(["filled", "light", "outline"] as const).map((variant) => (
        <Box key={variant}>
          <Text fz="caption" c="text.muted" mb="xs">
            variant=&quot;{variant}&quot;
          </Text>
          <Timeline
            variant={variant}
            active={1}
            items={[
              { title: "Solicitud recibida", meta: "12 mar", description: "Alta por el portal" },
              { title: "En revisión", meta: "13 mar" },
              { title: "Aprobada", meta: "—" },
            ]}
          />
        </Box>
      ))}
    </Box>
  ),
};

export const Stats: Story = {
  render: () => (
    <SimpleGrid cols={{ base: 1, tablet: 3 }} spacing="md">
      <Paper p="lg" radius="md" withBorder>
        <Stat
          label="Ingresos"
          value={MXN.format(68700)}
          trend="up"
          diff="12,4 %"
          description="vs. mes anterior"
        />
      </Paper>
      <Paper p="lg" radius="md" withBorder>
        <Stat
          label="Cancelaciones"
          value="14"
          trend="down"
          diff="3,1 %"
          description="vs. mes anterior"
        />
      </Paper>
      <Paper p="lg" radius="md" withBorder>
        <Stat label="Clientes activos" value="1 284" trend="flat" diff="0 %" size="lg" />
      </Paper>
    </SimpleGrid>
  ),
};

export const Banderoles: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md">
      {(["filled", "outline", "light", "glass"] as const).map((variant) => (
        <Banderole key={variant} variant={variant} color="info" onClose={() => undefined}>
          variant=&quot;{variant}&quot; — mantenimiento programado el sábado a las 02:00.
        </Banderole>
      ))}
      <Banderole
        variant="light"
        color="warning"
        actions={
          <Button size="xs" variant="filled" color="warning">
            Renovar
          </Button>
        }
      >
        Tu plan caduca en 3 días.
      </Banderole>
    </Box>
  ),
};

export const Grids: Story = {
  render: () => (
    <GridList
      items={FACTURAS}
      getKey={(factura) => factura.id}
      label="Facturas"
      minColWidth={200}
      renderItem={(factura, mode) => (
        <Card p="md" radius="md" withBorder>
          <Title order={5}>{factura.id}</Title>
          <Text fz="caption" c="text.muted">
            {factura.cliente}
          </Text>
          <Text fz="body3" mt="xs">
            {MXN.format(factura.importe)}
          </Text>
          <Text fz="caption" c="text.muted" mt="xs">
            modo: {mode}
          </Text>
        </Card>
      )}
    />
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Box display="flex" direction="column" gap="md">
        <Stat label="Ingresos" value="68 700" trend="up" diff="12 %" />
        <Timeline active={0} items={[{ title: "Recibida" }, { title: "En revisión" }]} />
      </Box>
    </ThemeMatrix>
  ),
};
