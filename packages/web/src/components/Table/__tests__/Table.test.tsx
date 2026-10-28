import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Table } from "../index.js";

afterEach(cleanup);

interface SampleProps {
  onPress?: () => void;
  selected?: boolean;
  caption?: string;
}

function Sample(props: SampleProps): React.ReactElement {
  const { onPress, selected, caption = "Facturas del mes" } = props;
  return (
    <Table caption={caption}>
      <Table.Head>
        <Table.Row>
          <Table.Title>Folio</Table.Title>
          <Table.Title numeric>Importe</Table.Title>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row
          {...(onPress === undefined ? {} : { onPress })}
          {...(selected === undefined ? {} : { selected })}
        >
          <Table.Title scope="row">F-1042</Table.Title>
          <Table.Cell numeric>1,240.00</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Title scope="row">F-1043</Table.Title>
          <Table.Cell numeric>310.50</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Foot>
        <Table.Row>
          <Table.Title scope="row">Total</Table.Title>
          <Table.Cell numeric>1,550.50</Table.Cell>
        </Table.Row>
      </Table.Foot>
    </Table>
  );
}

describe("Table", () => {
  it("expone la semántica nativa: table, columnheader, rowheader y cell", () => {
    render(<Sample />);
    expect(screen.getByRole("table", { name: "Facturas del mes" })).toBeDefined();
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(screen.getAllByRole("rowheader")).toHaveLength(3);
    expect(screen.getAllByRole("cell")).toHaveLength(3);
    expect(screen.getAllByRole("row")).toHaveLength(4);
  });

  it("el caption oculto sigue nombrando la tabla para el lector de pantalla", () => {
    render(<Sample caption="Solo para lectores" />);
    expect(screen.getByRole("table", { name: "Solo para lectores" })).toBeDefined();
  });

  it("sin accesibilidad rota: axe no encuentra violaciones", async () => {
    const { container } = render(<Sample />);
    await ExpectNoViolations(container);
  });

  it("una fila pulsable es alcanzable con Tab y se activa con Enter y Espacio", async () => {
    const user = userEvent.setup();
    const on_press = vi.fn();
    render(<Sample onPress={on_press} />);

    await user.tab();
    const fila = screen.getByRole("row", { name: /F-1042/ });
    expect(document.activeElement).toBe(fila);

    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(on_press).toHaveBeenCalledTimes(2);
  });

  it("una fila pulsable conserva el rol row y axe no encuentra violaciones", async () => {
    const { container } = render(<Sample onPress={() => {}} selected />);
    expect(screen.getAllByRole("row")).toHaveLength(4);
    await ExpectNoViolations(container);
  });

  it("la fila seleccionada se anuncia como seleccionada", () => {
    render(<Sample onPress={() => {}} selected />);
    expect(screen.getByRole("row", { name: /F-1042/ }).getAttribute("aria-selected")).toBe("true");
  });

  it("el contenedor con scroll es una región enfocable con nombre", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Table.ScrollContainer label="Facturas">
        <Sample />
      </Table.ScrollContainer>,
    );
    const region = screen.getByRole("region", { name: "Facturas" });
    await user.tab();
    expect(document.activeElement).toBe(region);
    await ExpectNoViolations(container);
  });
});
