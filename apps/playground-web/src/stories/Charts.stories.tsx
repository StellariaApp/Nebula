import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Box,
  Card,
  SimpleGrid,
  Stat,
  Text,
  Title,
} from "@stellaria/nebula-web";
import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  SparkLine,
  TrendIndicator,
  type ChartDatum,
  type ChartSeries,
} from "@stellaria/nebula-web/charts";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof BarChart> = {
  title: "Data Display/Charts",
  component: BarChart,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof BarChart>;

const MESES: ChartDatum[] = [
  { name: "Ene", cobros: 42000, devoluciones: 3200 },
  { name: "Feb", cobros: 51000, devoluciones: 2800 },
  { name: "Mar", cobros: 48500, devoluciones: 4100 },
  { name: "Abr", cobros: 62000, devoluciones: 2600 },
  { name: "May", cobros: 58000, devoluciones: 3900 },
  { name: "Jun", cobros: 71000, devoluciones: 3100 },
];

const SERIES: ChartSeries[] = [
  { key: "cobros", label: "Cobros", color: "primary" },
  { key: "devoluciones", label: "Devoluciones", color: "error" },
];

const CANALES: ChartDatum[] = [
  { canal: "SPEI", total: 48 },
  { canal: "Tarjeta", total: 32 },
  { canal: "Efectivo", total: 20 },
];

const RESUMEN =
  "Los cobros crecen de 42 000 en enero a 71 000 en junio, con un repunte en abril; " +
  "las devoluciones se mantienen entre 2 600 y 4 100.";

export const Barras: Story = {
  render: () => (
    <BarChart
      data={MESES}
      series={SERIES}
      title="Cobros y devoluciones por mes"
      summary={RESUMEN}
      withDataTable
      withLegend
      xAxis={{ key: "name", label: "Mes" }}
    />
  ),
};

export const Lineas: Story = {
  render: () => (
    <LineChart
      data={MESES}
      series={SERIES}
      title="Tendencia mensual"
      summary={RESUMEN}
      withLegend
      withDots
    />
  ),
};

export const Area: Story = {
  render: () => (
    <AreaChart
      data={MESES}
      series={[{ key: "cobros", label: "Cobros", color: "accent" }]}
      title="Volumen acumulado"
      summary="El volumen de cobros sube de forma sostenida durante el semestre."
    />
  ),
};

export const Donut: Story = {
  render: () => (
    <PieChart
      data={CANALES}
      valueKey="total"
      labelKey="canal"
      donut
      title="Reparto por canal"
      summary="SPEI concentra el 48 % de los cobros, tarjeta el 32 % y efectivo el 20 %."
      withDataTable
    />
  ),
};

export const Ligeros: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="lg">
      <Box display="flex" direction="column" gap="xs">
        <Title order={6}>SparkLine y TrendIndicator</Title>
        <Text fz="body3" c="text.secondary">
          Los dos se dibujan con SVG propio y no arrastran Recharts: 12 y 10 kB frente a los 114 de
          un BarChart. Por eso pueden vivir dentro de una tarjeta o de una fila de tabla.
        </Text>
      </Box>

      <SimpleGrid cols={{ base: 1, tablet: 3 }} spacing="md">
        <Card p="md" withBorder r="md">
          <Stat label="Cobros" value="71 000" diff={<TrendIndicator value={22} />} />
          <Box mt="sm">
            <SparkLine data={[42, 51, 48, 62, 58, 71]} label="Cobros del semestre" withArea />
          </Box>
        </Card>
        <Card p="md" withBorder r="md">
          <Stat
            label="Devoluciones"
            value="3 100"
            diff={<TrendIndicator value={-12} invertColors />}
          />
          <Box mt="sm">
            <SparkLine data={[32, 28, 41, 26, 39, 31]} color="error" label="Devoluciones" />
          </Box>
        </Card>
        <Card p="md" withBorder r="md">
          <Stat label="Ticket medio" value="1 240" diff={<TrendIndicator value={0} />} />
          <Box mt="sm">
            <SparkLine data={[12, 12, 12, 12, 12, 12]} color="gray" label="Ticket medio" />
          </Box>
        </Card>
      </SimpleGrid>
    </Box>
  ),
};

export const Accesibilidad: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Text fz="body3" c="text.secondary">
        Cada chart es un <code>figure</code> con <code>role=&quot;img&quot;</code> nombrado por su
        título y descrito por el resumen textual; la tabla de datos alternativa vive en un
        <code>details</code> plegable, como pide docs/03 §1.
      </Text>
      <BarChart
        data={MESES}
        series={SERIES}
        title="Cobros y devoluciones por mes"
        summary={RESUMEN}
        withDataTable
        dataTableLabel="Ver los datos en tabla"
        height={200}
      />
    </Box>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Box display="flex" direction="column" gap="sm">
        <SparkLine data={[42, 51, 48, 62, 58, 71]} label="Cobros" withArea />
        <TrendIndicator value={22} />
        <BarChart
          data={MESES.slice(0, 4)}
          series={[SERIES[0]!]}
          title="Cobros del primer cuatrimestre"
          height={120}
          withGrid={false}
        />
      </Box>
    </ThemeMatrix>
  ),
};
