import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState, type ReactElement } from "react";

import {
  Badge,
  Box,
  Button,
  Card,
  Filters,
  Search,
  Table,
  Text,
  Title,
  type FilterDescriptor,
  type FilterState,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof Search> = {
  title: "Search/Search y Filters",
  component: Search,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Search>;

const FILTERS: readonly FilterDescriptor[] = [
  {
    key: "estado",
    label: "Estado",
    type: "select",
    placeholder: "Cualquiera",
    options: [
      { value: "pendiente", label: "Pendiente" },
      { value: "conciliado", label: "Conciliado" },
      { value: "devuelto", label: "Devuelto" },
    ],
  },
  {
    key: "canal",
    label: "Canal",
    type: "multiselect",
    placeholder: "Todos",
    options: [
      { value: "spei", label: "SPEI" },
      { value: "tarjeta", label: "Tarjeta" },
      { value: "efectivo", label: "Efectivo" },
    ],
  },
  { key: "importe", label: "Importe", type: "range", min: 0, max: 100000 },
  { key: "cliente", label: "Cliente", type: "text", placeholder: "Nombre o RFC" },
  { key: "emitida", label: "Emitida", type: "date" },
];

interface Fila {
  id: string;
  cliente: string;
  estado: string;
  canal: string;
  importe: number;
}

const FILAS: Fila[] = [
  { id: "M-1042", cliente: "Aurora S.A.", estado: "conciliado", canal: "spei", importe: 12400 },
  { id: "M-1043", cliente: "Nébula Ltda.", estado: "pendiente", canal: "tarjeta", importe: 8900 },
  { id: "M-1044", cliente: "Stellaria", estado: "devuelto", canal: "efectivo", importe: 45300 },
  { id: "M-1045", cliente: "Cosmos", estado: "conciliado", canal: "spei", importe: 2100 },
];

const MXN = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

function Demo(): ReactElement {
  const [query, set_query] = useState("");
  const [filters, set_filters] = useState<FilterState>({});

  const rows = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return FILAS.filter((fila) => {
      if (needle !== "" && !`${fila.id} ${fila.cliente}`.toLocaleLowerCase().includes(needle)) {
        return false;
      }
      const estado = filters["estado"];
      if (typeof estado === "string" && estado !== "" && fila.estado !== estado) return false;
      const canal = filters["canal"];
      if (Array.isArray(canal) && canal.length > 0 && !canal.includes(fila.canal)) return false;
      return true;
    });
  }, [query, filters]);

  return (
    <Box display="flex" direction="column" gap="lg">
      <Search
        filters={FILTERS}
        filterState={filters}
        onFilterChange={set_filters}
        value={query}
        onChange={set_query}
        onRefresh={() => {
          set_query("");
          set_filters({});
        }}
        after={<Button size="md">Exportar</Button>}
      />

      <Card p="none" withBorder r="md">
        <Table caption={`${String(rows.length)} movimientos`} captionVisible highlightOnHover>
          <Table.Head>
            <Table.Row>
              <Table.Title>Folio</Table.Title>
              <Table.Title>Cliente</Table.Title>
              <Table.Title>Estado</Table.Title>
              <Table.Title numeric>Importe</Table.Title>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {rows.map((fila) => (
              <Table.Row key={fila.id}>
                <Table.Cell>{fila.id}</Table.Cell>
                <Table.Cell>{fila.cliente}</Table.Cell>
                <Table.Cell>
                  <Badge size="sm" variant="light">
                    {fila.estado}
                  </Badge>
                </Table.Cell>
                <Table.Cell numeric>{MXN.format(fila.importe)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </Box>
  );
}

export const Default: Story = {
  render: () => <Demo />,
};

export const SoloFiltros: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Title order={6}>Filters suelto</Title>
      <Text fz="body3" c="text.secondary">
        El panel se puede usar sin la barra: mismo descriptor, mismo estado.
      </Text>
      <Filters filters={FILTERS} />
    </Box>
  ),
};

export const SinBuscador: Story = {
  render: () => (
    <Search
      hideSearch
      filters={FILTERS}
      before={<Title order={6}>Movimientos</Title>}
      after={
        <Button size="md" variant="ghost">
          Nuevo
        </Button>
      }
    />
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Search filters={FILTERS.slice(0, 2)} size="sm" />
    </ThemeMatrix>
  ),
};
