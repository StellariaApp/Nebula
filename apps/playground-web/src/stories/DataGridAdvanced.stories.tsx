import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState, type ReactElement } from "react";

import { Badge, Box, Text, Title } from "@stellaria/nebula-web";
import { DataGrid, type ColumnDef } from "@stellaria/nebula-web/datagrid";
import { ChartLegend, ChartPanel, ChartTooltip, RadarChart } from "@stellaria/nebula-web/charts";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof DataGrid> = {
  title: "Data/DataGrid avanzado y charts",
  component: DataGrid,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof DataGrid>;

interface Credito {
  id: string;
  cliente: string;
  sucursal: string;
  importe: number;
  estado: string;
}

const ESTADOS = ["Al corriente", "En mora", "Liquidado"];
const SUCURSALES = ["Norte", "Centro", "Sur"];

const CREDITOS: Credito[] = Array.from({ length: 60 }, (_, index) => ({
  id: `c${String(index)}`,
  cliente: `Cliente ${String(index + 1).padStart(3, "0")}`,
  sucursal: SUCURSALES[index % SUCURSALES.length] as string,
  importe: 25_000 + index * 1350,
  estado: ESTADOS[index % ESTADOS.length] as string,
}));

const COLUMNS: ColumnDef<Credito>[] = [
  { id: "cliente", accessorKey: "cliente", header: "Cliente" },
  { id: "sucursal", accessorKey: "sucursal", header: "Sucursal" },
  {
    id: "importe",
    accessorKey: "importe",
    header: "Importe",
    cell: ({ getValue }) => (getValue<number>() / 1000).toFixed(1) + " k",
  },
  {
    id: "estado",
    accessorKey: "estado",
    header: "Estado",
    cell: ({ getValue }) => <Badge variant="light">{getValue<string>()}</Badge>,
  },
];

const Key = (row: Credito): string => row.id;

function Grid(): ReactElement {
  const [query, set_query] = useState("");
  const [estado, set_estado] = useState<string | null>("En mora");
  const [selected, set_selected] = useState<string[]>([]);

  const data = useMemo(
    () =>
      CREDITOS.filter(
        (row) =>
          (estado === null || row.estado === estado) &&
          (query === "" || row.cliente.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, estado],
  );

  return (
    <DataGrid
      data={data}
      columns={COLUMNS}
      getRowId={Key}
      caption="Cartera de créditos"
      selectable
      selected={selected}
      onSelectedChange={set_selected}
      search={query}
      onSearchChange={set_query}
      searchPlaceholder="Busca un cliente"
      activeFilters={
        estado === null
          ? []
          : [
              {
                id: "estado",
                label: `Estado: ${estado}`,
                onClear: () => {
                  set_estado(null);
                },
              },
            ]
      }
      onClearFilters={() => {
        set_estado(null);
      }}
      bulkActions={[
        { id: "notify", label: "Notificar", onAction: () => undefined },
        { id: "close", label: "Cerrar", destructive: true, onAction: () => undefined },
      ]}
      withColumnMenu
      resizable
      exportCsv={{ filename: "cartera" }}
      pageSize={10}
    />
  );
}

export const Default: Story = { render: () => <Grid /> };

export const Teclado: Story = {
  render: () => (
    <Box maw={860}>
      <Text component="p" fz="caption" c="text.muted" mb="sm">
        Tabula una vez para entrar en la tabla y muévete con las flechas. <code>Home</code> y{" "}
        <code>End</code> van a los extremos de la fila; con <code>Ctrl</code>, a la primera y última
        celda. <code>PageUp</code> y <code>PageDown</code> saltan diez filas.
      </Text>
      <DataGrid
        data={CREDITOS.slice(0, 12)}
        columns={COLUMNS}
        getRowId={Key}
        caption="Navegación por celdas"
        withPagination={false}
      />
    </Box>
  ),
};

const RADAR = [
  { eje: "Cobertura", cartera: 82, objetivo: 90 },
  { eje: "Recuperación", cartera: 64, objetivo: 75 },
  { eje: "Originación", cartera: 91, objetivo: 80 },
  { eje: "Calidad", cartera: 73, objetivo: 85 },
  { eje: "Coste", cartera: 58, objetivo: 60 },
];

const RADAR_SERIES = [
  { key: "cartera", label: "Cartera" },
  { key: "objetivo", label: "Objetivo" },
];

export const Radar: Story = {
  render: () => (
    <Box maw={520}>
      <RadarChart
        data={RADAR}
        series={RADAR_SERIES}
        angleKey="eje"
        title="Salud de la cartera"
        summary="La cartera supera el objetivo en originación y queda por debajo en recuperación."
        withDataTable
      />
    </Box>
  ),
};

export const LeyendaYTooltip: Story = {
  render: () => {
    const [hidden, set_hidden] = useState<string[]>([]);
    const entries = [
      { key: "cartera", label: "Cartera", color: "#3f37c9" },
      { key: "objetivo", label: "Objetivo", color: "#9d4edd" },
    ];
    return (
      <Box display="flex" direction="column" gap="md" maw={420}>
        <ChartLegend
          entries={entries}
          hidden={hidden}
          label="Series del gráfico"
          onToggle={(key) => {
            set_hidden((current) =>
              current.includes(key) ? current.filter((k) => k !== key) : [...current, key],
            );
          }}
        />
        <ChartTooltip
          title="Recuperación"
          items={[
            { key: "cartera", label: "Cartera", value: 64, color: "#3f37c9" },
            { key: "objetivo", label: "Objetivo", value: 75, color: "#9d4edd" },
          ]}
          format={(value) => `${String(value)} %`}
        />
      </Box>
    );
  },
};

export const Paneles: Story = {
  render: () => (
    <ChartPanel
      label="Panel de cartera"
      cols={2}
      panels={[
        {
          id: "radar",
          title: "Salud de la cartera",
          description: "Frente al objetivo del trimestre",
          content: <RadarChart data={RADAR} series={RADAR_SERIES} angleKey="eje" height={220} />,
        },
        {
          id: "tabla",
          title: "Créditos en mora",
          content: (
            <DataGrid
              data={CREDITOS.filter((row) => row.estado === "En mora").slice(0, 5)}
              columns={COLUMNS.slice(0, 3)}
              getRowId={Key}
              withPagination={false}
              caption="Créditos en mora"
            />
          ),
        },
      ]}
    />
  ),
};

export const Dark: Story = {
  globals: { theme: "nebula-dark" },
  render: () => (
    <Box maw={520}>
      <RadarChart data={RADAR} series={RADAR_SERIES} angleKey="eje" title="Dark first" />
    </Box>
  ),
};

export const ReducedMotion: Story = {
  globals: { reducedMotion: "reduce" },
  render: () => <Grid />,
};

export const Composition: Story = {
  render: () => (
    <Box maw={980}>
      <Title order={3} mb="xxs">
        Cartera del trimestre
      </Title>
      <Text component="p" c="text.secondary" mb="lg" maw={560}>
        Tabla operativa con búsqueda, filtros activos, acciones masivas y export, junto al panel de
        indicadores. Las dos superficies comparten tokens y ninguna sale del entry principal.
      </Text>
      <Grid />
    </Box>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <RadarChart data={RADAR} series={RADAR_SERIES} angleKey="eje" height={200} />
    </ThemeMatrix>
  ),
};
