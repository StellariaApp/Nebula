import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";

import {
  Box,
  Button,
  Card,
  CurrencyDisplay,
  DateDisplay,
  EmptyModule,
  InfiniteList,
  QuickAction,
  SearchableList,
  SimpleGrid,
  StatusBadge,
  StatusMapProvider,
  Table,
  Text,
  Title,
  type StatusMap,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof StatusBadge> = {
  title: "Domain Generics/Overview",
  component: StatusBadge,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof StatusBadge>;

type Cobro = "pendiente" | "conciliado" | "en_ruta" | "devuelto";

const COBROS: StatusMap<Cobro> = {
  pendiente: { label: "Pendiente", color: "warning" },
  conciliado: { label: "Conciliado", color: "success" },
  en_ruta: { label: "En ruta", color: "info" },
  devuelto: {
    label: "Devuelto",
    color: "error",
    dot: true,
    description: "Devuelto por el banco emisor",
  },
};

const PARCIAL: StatusMap = { pendiente: { label: "Pendiente", color: "warning" } };

interface Movimiento {
  id: string;
  cliente: string;
  estado: Cobro;
  importe: number;
  fecha: string;
}

const MOVIMIENTOS: Movimiento[] = [
  {
    id: "M-1042",
    cliente: "Aurora S.A.",
    estado: "conciliado",
    importe: 12400,
    fecha: "2026-07-29",
  },
  {
    id: "M-1043",
    cliente: "Nébula Ltda.",
    estado: "pendiente",
    importe: 8900,
    fecha: "2026-07-28",
  },
  { id: "M-1044", cliente: "Stellaria", estado: "en_ruta", importe: 45300, fecha: "2026-07-22" },
  { id: "M-1045", cliente: "Cosmos", estado: "devuelto", importe: -2100, fecha: "2026-06-14" },
];

const NOW = new Date("2026-07-30T12:00:00Z");

const ICON_PLUS = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const ICON_UP = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

const ICON_CARD = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
);

const ICON_BOX = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8" />
  </svg>
);

export const Statuses: Story = {
  render: () => (
    <StatusMapProvider<Cobro> map={COBROS}>
      <Box display="flex" direction="column" gap="lg">
        <Box display="flex" gap="xs" wrap="wrap">
          <StatusBadge<Cobro> status="pendiente" />
          <StatusBadge<Cobro> status="conciliado" />
          <StatusBadge<Cobro> status="en_ruta" />
          <StatusBadge<Cobro> status="devuelto" />
        </Box>
        <Box display="flex" gap="xs" wrap="wrap">
          <StatusBadge<Cobro> status="conciliado" variant="filled" />
          <StatusBadge<Cobro> status="conciliado" variant="outline" />
          <StatusBadge<Cobro> status="conciliado" variant="light" />
          <StatusBadge<Cobro> status="conciliado" variant="ghost" />
          <StatusBadge<Cobro> status="conciliado" variant="gradient" />
        </Box>
        <Box>
          <Text fz="caption" c="text.muted" mb="xs">
            Un estado que ningún mapa declara se pinta en error con la clave cruda, nunca en gris.
          </Text>
          <StatusBadge status="reembolsado" map={PARCIAL} />
        </Box>
      </Box>
    </StatusMapProvider>
  ),
};

export const Formatters: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="lg">
      <Box display="flex" direction="column" gap="xs">
        <Title order={6}>CurrencyDisplay</Title>
        <Text fz="body3">
          <CurrencyDisplay amount={12400.5} currency="MXN" locale="es-MX" />
          {" · "}
          <CurrencyDisplay amount={12400.5} currency="EUR" locale="es-ES" />
          {" · "}
          <CurrencyDisplay amount={1250000} currency="USD" locale="en-US" compact />
          {" · "}
          <CurrencyDisplay amount={-2100} currency="MXN" locale="es-MX" colorBySign />
          {" · "}
          <CurrencyDisplay amount={null} fallback="sin dato" />
        </Text>
      </Box>
      <Box display="flex" direction="column" gap="xs">
        <Title order={6}>DateDisplay</Title>
        <Text fz="body3">
          <DateDisplay value="2026-07-30" locale="es-MX" timeZone="UTC" />
          {" · "}
          <DateDisplay value="2026-07-30" preset="long" locale="es-MX" timeZone="UTC" />
          {" · "}
          <DateDisplay value="2026-07-28T09:30:00Z" mode="relative" locale="es-MX" now={NOW} />
          {" · "}
          <DateDisplay
            value="2026-01-04T09:30:00Z"
            mode="auto"
            locale="es-MX"
            timeZone="UTC"
            now={NOW}
          />
        </Text>
      </Box>
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <StatusMapProvider<Cobro> map={COBROS}>
      <Box display="flex" direction="column" gap="xl">
        <SimpleGrid cols={{ base: 2, tablet: 4 }} spacing="sm">
          <QuickAction label="Nuevo cobro" icon={ICON_PLUS} description="Alta manual" />
          <QuickAction label="Conciliar" icon={ICON_UP} description="Subir extracto" color="info" />
          <QuickAction label="Cobrar" icon={ICON_CARD} description="Terminal" color="success" />
          <QuickAction label="Envíos" icon={ICON_BOX} description="Ver ruta" color="accent" />
        </SimpleGrid>

        <Card p="none" withBorder radius="md">
          <Table caption="Movimientos del mes" captionVisible highlightOnHover>
            <Table.Head>
              <Table.Row>
                <Table.Title>Folio</Table.Title>
                <Table.Title>Cliente</Table.Title>
                <Table.Title>Estado</Table.Title>
                <Table.Title>Fecha</Table.Title>
                <Table.Title numeric>Importe</Table.Title>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {MOVIMIENTOS.map((movimiento) => (
                <Table.Row key={movimiento.id}>
                  <Table.Cell>{movimiento.id}</Table.Cell>
                  <Table.Cell>{movimiento.cliente}</Table.Cell>
                  <Table.Cell>
                    <StatusBadge<Cobro> status={movimiento.estado} size="sm" />
                  </Table.Cell>
                  <Table.Cell>
                    <DateDisplay value={movimiento.fecha} mode="auto" locale="es-MX" now={NOW} />
                  </Table.Cell>
                  <Table.Cell numeric>
                    <CurrencyDisplay
                      amount={movimiento.importe}
                      currency="MXN"
                      locale="es-MX"
                      colorBySign
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      </Box>
    </StatusMapProvider>
  ),
};

export const Empty: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="lg">
      <EmptyModule
        title="Aún no hay movimientos"
        description="Cuando registres el primer cobro aparecerá en esta tabla."
        action={<Button size="sm">Registrar cobro</Button>}
        secondaryAction={
          <Button size="sm" variant="ghost">
            Importar CSV
          </Button>
        }
        footer="También puedes conectar tu banco desde Ajustes."
      />
      <EmptyModule title="Sin conciliaciones" surface="paper" size="sm" />
    </Box>
  ),
};

function ListsDemo(): React.ReactElement {
  const [pages, set_pages] = useState(1);
  const [loading, set_loading] = useState(false);

  const rows = useMemo(
    () =>
      Array.from({ length: pages * 5 }, (_, index) => ({
        id: `M-${String(2000 + index)}`,
        cliente: `Cliente ${String(index + 1)}`,
      })),
    [pages],
  );

  return (
    <Box display="flex" direction="column" gap="xl">
      <Box>
        <Title order={6} mb="sm">
          InfiniteList — props sueltas
        </Title>
        <InfiniteList
          items={rows}
          getKey={(row) => row.id}
          label="Movimientos"
          hasMore={pages < 3}
          loadingMore={loading}
          autoLoad={false}
          withEndMessage
          onLoadMore={() => {
            set_loading(true);
            setTimeout(() => {
              set_pages((current) => current + 1);
              set_loading(false);
            }, 600);
          }}
          renderItem={(row) => (
            <Card p="sm" withBorder radius="sm">
              <Text fz="body3">
                {row.id} · {row.cliente}
              </Text>
            </Card>
          )}
        />
      </Box>

      <Box>
        <Title order={6} mb="sm">
          SearchableList — filtrado en cliente
        </Title>
        <SearchableList
          items={MOVIMIENTOS}
          getKey={(row) => row.id}
          getSearchText={(row) => `${row.id} ${row.cliente}`}
          label="Movimientos"
          withCount
          noResults={<Text fz="body3">Ningún movimiento coincide con la búsqueda.</Text>}
          renderItem={(row) => (
            <Card p="sm" withBorder radius="sm">
              <Text fz="body3">
                {row.id} · {row.cliente}
              </Text>
            </Card>
          )}
        />
      </Box>
    </Box>
  );
}

export const Lists: Story = {
  render: () => <ListsDemo />,
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <StatusMapProvider<Cobro> map={COBROS}>
        <Box display="flex" direction="column" gap="md">
          <Box display="flex" gap="xxs" wrap="wrap">
            <StatusBadge<Cobro> status="pendiente" size="sm" />
            <StatusBadge<Cobro> status="conciliado" size="sm" />
            <StatusBadge<Cobro> status="devuelto" size="sm" />
          </Box>
          <QuickAction label="Nuevo cobro" icon={ICON_PLUS} size="sm" />
          <Text fz="body3">
            <CurrencyDisplay amount={12400.5} currency="MXN" locale="es-MX" />
          </Text>
        </Box>
      </StatusMapProvider>
    </ThemeMatrix>
  ),
};
