import type { ColumnDef } from "@tanstack/react-table";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { DataGrid } from "../DataGrid.js";

afterEach(cleanup);

interface Fila {
  id: string;
  cliente: string;
  importe: number;
}

const FILAS: Fila[] = [
  { id: "1", cliente: "Aurora", importe: 300 },
  { id: "2", cliente: "Bruno", importe: 100 },
  { id: "3", cliente: "Carla", importe: 200 },
];

const COLUMNS: ColumnDef<Fila>[] = [
  { accessorKey: "cliente", header: "Cliente" },
  { accessorKey: "importe", header: "Importe" },
];

function Key(row: Fila): string {
  return row.id;
}

describe("DataGrid", () => {
  it("pinta cabeceras y filas", () => {
    render(<DataGrid data={FILAS} columns={COLUMNS} getRowId={Key} />);
    expect(screen.getByRole("columnheader", { name: /Cliente/ })).toBeDefined();
    expect(screen.getAllByRole("row")).toHaveLength(4);
  });

  it("sin datos muestra el vacío", () => {
    render(<DataGrid data={[]} columns={COLUMNS} getRowId={Key} empty={<span>Nada</span>} />);
    expect(screen.getByText("Nada")).toBeDefined();
  });

  it("una columna numérica ordena descendente primero y publica aria-sort", async () => {
    render(<DataGrid data={FILAS} columns={COLUMNS} getRowId={Key} />);
    const header = screen.getByRole("button", { name: /Importe/ });

    await userEvent.click(header);
    expect(screen.getAllByRole("row")[1]?.textContent).toContain("Aurora");
    expect(screen.getByRole("columnheader", { name: /Importe/ }).getAttribute("aria-sort")).toBe(
      "descending",
    );

    await userEvent.click(header);
    expect(screen.getAllByRole("row")[1]?.textContent).toContain("Bruno");
    expect(screen.getByRole("columnheader", { name: /Importe/ }).getAttribute("aria-sort")).toBe(
      "ascending",
    );
  });

  it("una columna de texto ordena ascendente primero", async () => {
    render(<DataGrid data={FILAS} columns={COLUMNS} getRowId={Key} />);
    await userEvent.click(screen.getByRole("button", { name: /Cliente/ }));
    expect(screen.getAllByRole("row")[1]?.textContent).toContain("Aurora");
    expect(screen.getByRole("columnheader", { name: /Cliente/ }).getAttribute("aria-sort")).toBe(
      "ascending",
    );
  });

  it("el orden se puede controlar desde fuera", () => {
    render(
      <DataGrid
        data={FILAS}
        columns={COLUMNS}
        getRowId={Key}
        sorting={[{ id: "cliente", desc: true }]}
      />,
    );
    expect(screen.getAllByRole("row")[1]?.textContent).toContain("Carla");
  });

  it("selectable añade la columna de casillas y emite las claves", async () => {
    const on_selected = vi.fn();
    render(
      <DataGrid
        data={FILAS}
        columns={COLUMNS}
        getRowId={Key}
        selectable
        onSelectedChange={on_selected}
      />,
    );
    await userEvent.click(screen.getAllByRole("checkbox", { name: "Select row" })[0]!);
    expect(on_selected).toHaveBeenCalledWith(["1"]);
  });

  it("la casilla de cabecera selecciona todo", async () => {
    const on_selected = vi.fn();
    render(
      <DataGrid
        data={FILAS}
        columns={COLUMNS}
        getRowId={Key}
        selectable
        onSelectedChange={on_selected}
      />,
    );
    await userEvent.click(screen.getByRole("checkbox", { name: "Select all rows" }));
    expect(on_selected).toHaveBeenCalledWith(["1", "2", "3"]);
  });

  it("pagina cuando hay más filas que pageSize", async () => {
    const many = Array.from({ length: 12 }, (_, index) => ({
      id: String(index),
      cliente: `Cliente ${String(index)}`,
      importe: index,
    }));
    render(<DataGrid data={many} columns={COLUMNS} getRowId={Key} pageSize={5} />);
    expect(screen.getAllByRole("row")).toHaveLength(6);
    expect(screen.getByText("Page 1 of 3")).toBeDefined();

    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Page 2 of 3")).toBeDefined();
  });

  it("no virtualiza por debajo del umbral", () => {
    const { container } = render(
      <DataGrid data={FILAS} columns={COLUMNS} getRowId={Key} virtualizeFrom={50} />,
    );
    expect(container.querySelector("[data-virtual='true']")).toBeNull();
  });

  it("virtualiza a partir del umbral", () => {
    const many = Array.from({ length: 60 }, (_, index) => ({
      id: String(index),
      cliente: `Cliente ${String(index)}`,
      importe: index,
    }));
    const { container } = render(
      <DataGrid
        data={many}
        columns={COLUMNS}
        getRowId={Key}
        virtualizeFrom={50}
        withPagination={false}
      />,
    );
    expect(container.querySelector("[data-virtual='true']")).not.toBeNull();
  });

  it("una fila pulsable responde a Enter desde la celda enfocada", async () => {
    const on_click = vi.fn();
    render(<DataGrid data={FILAS} columns={COLUMNS} getRowId={Key} onRowClick={on_click} />);
    const cell = screen.getAllByRole("row")[1]?.querySelector<HTMLElement>("td");
    cell?.focus();
    await userEvent.keyboard("{Enter}");
    expect(on_click).toHaveBeenCalledWith(FILAS[0]);
  });

  it("loading marca aria-busy", () => {
    render(<DataGrid data={[]} columns={COLUMNS} getRowId={Key} loading />);
    expect(screen.getByRole("table").getAttribute("aria-busy")).toBe("true");
  });
});
