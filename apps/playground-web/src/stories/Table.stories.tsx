import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactElement } from "react";
import { expect, userEvent, within } from "storybook/test";

import { Badge, Table, Text } from "@stellaria/nebula-web";

const meta: Meta<typeof Table> = {
  title: "Data Display/Table",
  component: Table,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Table>;

const ROWS = [
  { folio: "F-1042", cliente: "Acme", estado: "Pagada", importe: "1,240.00" },
  { folio: "F-1043", cliente: "Globex", estado: "Pendiente", importe: "310.50" },
  { folio: "F-1044", cliente: "Initech", estado: "Vencida", importe: "5,980.00" },
] as const;

const TONE = { Pagada: "success", Pendiente: "warning", Vencida: "error" } as const;

function Invoices(props: {
  density?: "compact" | "normal" | "comfortable";
  striped?: boolean;
  onPress?: (folio: string) => void;
  selected?: string;
}): ReactElement {
  return (
    <Table
      caption="Facturas del mes"
      {...(props.density === undefined ? {} : { density: props.density })}
      striped={props.striped ?? false}
      highlightOnHover
      withBorder
    >
      <Table.Head>
        <Table.Row>
          <Table.Title>Folio</Table.Title>
          <Table.Title>Cliente</Table.Title>
          <Table.Title>Estado</Table.Title>
          <Table.Title numeric>Importe</Table.Title>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {ROWS.map((row) => (
          <Table.Row
            key={row.folio}
            selected={props.selected === row.folio}
            {...(props.onPress === undefined ? {} : { onPress: () => props.onPress?.(row.folio) })}
          >
            <Table.Title scope="row">{row.folio}</Table.Title>
            <Table.Cell>{row.cliente}</Table.Cell>
            <Table.Cell>
              <Badge color={TONE[row.estado]} dot>
                {row.estado}
              </Badge>
            </Table.Cell>
            <Table.Cell numeric>{row.importe}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Foot>
        <Table.Row>
          <Table.Title scope="row" colSpan={3}>
            Total
          </Table.Title>
          <Table.Cell numeric>7,530.50</Table.Cell>
        </Table.Row>
      </Table.Foot>
    </Table>
  );
}

export const Default: Story = { render: () => <Invoices /> };

export const Densities: Story = {
  render: () => (
    <>
      {(["compact", "normal", "comfortable"] as const).map((density) => (
        <div key={density}>
          <Text>{density}</Text>
          <Invoices density={density} striped />
        </div>
      ))}
    </>
  ),
};

export const InContext: Story = {
  render: () => (
    <Table.ScrollContainer label="Facturas del mes" minWidth={520}>
      <Invoices striped />
    </Table.ScrollContainer>
  ),
};

export const Dark: Story = { ...InContext, globals: { theme: "dark" } };

function Selectable(): ReactElement {
  const [selected, set_selected] = useState<string | undefined>(undefined);
  return <Invoices {...(selected === undefined ? {} : { selected })} onPress={set_selected} />;
}

export const SelectableRows: Story = {
  render: () => <Selectable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("row", { name: /F-1042/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  },
};
