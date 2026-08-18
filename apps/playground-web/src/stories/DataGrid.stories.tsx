import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState, type ReactElement } from "react";

import {
  Badge,
  Box,
  Text,
  Title,
} from "@stellaria/nebula-web";
import { DataGrid, type ColumnDef } from "@stellaria/nebula-web/datagrid";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof DataGrid> = {
  title: "Data Display/DataGrid",
  component: DataGrid,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof DataGrid>;

interface Movimiento {
  id: string;
  cliente: string;
  estado: "pendiente" | "conciliado" | "devuelto";
  importe: number;
}

const ESTADOS = ["pendiente", "conciliado", "devuelto"] as const;
const CLIENTES = ["Aurora S.A.", "Nébula Ltda.", "Stellaria", "Cosmos", "Vega", "Orión"];

function Dataset(count: number): Movimiento[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `M-${String(1000 + index)}`,
    cliente: CLIENTES[index % CLIENTES.length] ?? "Cliente",
    estado: ESTADOS[index % ESTADOS.length] ?? "pendiente",
    importe: ((index * 977) % 90000) + 500,
  }));
}

const MXN = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

const COLUMNS: ColumnDef<Movimiento>[] = [
  { accessorKey: "id", header: "Folio" },
  { accessorKey: "cliente", header: "Cliente" },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ getValue }) => (
      <Badge size="sm" variant="light">
        {String(getValue())}
      </Badge>
    ),
  },
  {
    accessorKey: "importe",
    header: "Importe",
    cell: ({ getValue }) => MXN.format(Number(getValue())),
  },
];

function Key(row: Movimiento): string {
  return row.id;
}

export const Default: Story = {
  render: () => (
    <DataGrid
      data={Dataset(24)}
      columns={COLUMNS}
      getRowId={Key}
      caption="Movimientos del trimestre"
      captionVisible
      pageSize={8}
    />
  ),
};

function Seleccionable(): ReactElement {
  const [selected, set_selected] = useState<string[]>([]);
  const data = useMemo(() => Dataset(12), []);

  return (
    <Box display="flex" direction="column" gap="sm">
      <Text fz="body3" c="text.secondary">
        {selected.length === 0
          ? "Ninguna fila seleccionada"
          : `${String(selected.length)} seleccionadas: ${selected.join(", ")}`}
      </Text>
      <DataGrid
        data={data}
        columns={COLUMNS}
        getRowId={Key}
        selectable
        selected={selected}
        onSelectedChange={set_selected}
        caption="Selección de filas"
        pageSize={6}
      />
    </Box>
  );
}

export const Seleccion: Story = {
  render: () => <Seleccionable />,
};

export const Virtualizado: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Title order={6}>1 000 filas, virtualización activa</Title>
      <Text fz="body3" c="text.secondary">
        Por encima de <code>virtualizeFrom</code> (50) solo se montan las filas visibles; el scroll
        lo sostienen dos filas de relleno con <code>aria-hidden</code>.
      </Text>
      <DataGrid
        data={Dataset(1000)}
        columns={COLUMNS}
        getRowId={Key}
        withPagination={false}
        maxHeight={420}
        caption="Movimientos históricos"
      />
    </Box>
  ),
};

export const Vacio: Story = {
  render: () => (
    <DataGrid
      data={[]}
      columns={COLUMNS}
      getRowId={Key}
      caption="Sin resultados"
      empty={<Text fz="body3">No hay movimientos para este filtro.</Text>}
    />
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <DataGrid
        data={Dataset(4)}
        columns={COLUMNS.slice(0, 3)}
        getRowId={Key}
        withPagination={false}
        maxHeight={240}
      />
    </ThemeMatrix>
  ),
};
