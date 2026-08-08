import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import { ToCsv } from "../csv.js";
import { DataGrid } from "../DataGrid.js";
import { DATA_GRID_LABELS } from "../labels.js";

afterEach(cleanup);

interface Row {
  id: string;
  nombre: string;
  importe: number;
}

const FILAS: Row[] = [
  { id: "1", nombre: "Acme", importe: 1200 },
  { id: "2", nombre: "Beta", importe: 800 },
  { id: "3", nombre: "Gamma", importe: 450 },
];

const COLUMNS = [
  { id: "nombre", accessorKey: "nombre", header: "Nombre" },
  { id: "importe", accessorKey: "importe", header: "Importe" },
];

const Key = (row: Row): string => row.id;

describe("ToCsv", () => {
  it("escapa comillas y delimitadores", () => {
    const csv = ToCsv(["a", "b"], [['di "hola"', "uno,dos"]]);
    expect(csv).toBe('a,b\r\n"di ""hola""","uno,dos"');
  });

  it("entrecomilla los saltos de línea", () => {
    expect(ToCsv(["a"], [["uno\ndos"]])).toBe('a\r\n"uno\ndos"');
  });

  it("neutraliza la inyección de fórmulas", () => {
    expect(ToCsv(["a"], [["=SUM(A1:A9)"]])).toBe("a\r\n'=SUM(A1:A9)");
    expect(ToCsv(["a"], [["+1"]])).toBe("a\r\n'+1");
    expect(ToCsv(["a"], [["@dominio"]])).toBe("a\r\n'@dominio");
  });

  it("acepta otro delimitador", () => {
    expect(ToCsv(["a", "b"], [["1", "2"]], ";")).toBe("a;b\r\n1;2");
  });
});

describe("DataGrid — toolbar", () => {
  it("no monta toolbar si no se pide nada", () => {
    render(<DataGrid data={FILAS} columns={COLUMNS} getRowId={Key} />);
    expect(screen.queryByLabelText(DATA_GRID_LABELS.search)).toBeNull();
  });

  it("monta el buscador cuando hay onSearchChange", async () => {
    const user = userEvent.setup();
    const on_search = vi.fn();
    render(<DataGrid data={FILAS} columns={COLUMNS} getRowId={Key} onSearchChange={on_search} />);
    await user.type(screen.getByLabelText(DATA_GRID_LABELS.search), "ac");
    expect(on_search).toHaveBeenCalled();
  });

  it("pinta los filtros activos y deja quitarlos", async () => {
    const user = userEvent.setup();
    const on_clear = vi.fn();
    render(
      <DataGrid
        data={FILAS}
        columns={COLUMNS}
        getRowId={Key}
        activeFilters={[{ id: "f1", label: "Estado: activo", onClear: on_clear }]}
      />,
    );
    expect(screen.getByText("Estado: activo")).toBeDefined();
    await user.click(screen.getByRole("button", { name: /Quitar el filtro/ }));
    expect(on_clear).toHaveBeenCalledTimes(1);
  });

  it("la barra de bulk aparece solo con selección", async () => {
    const user = userEvent.setup();
    const on_action = vi.fn();
    render(
      <DataGrid
        data={FILAS}
        columns={COLUMNS}
        getRowId={Key}
        selectable
        bulkActions={[{ id: "del", label: "Borrar", onAction: on_action }]}
      />,
    );
    expect(screen.queryByRole("button", { name: "Borrar" })).toBeNull();

    await user.click(
      screen.getAllByRole("checkbox", { name: DATA_GRID_LABELS.selectRow })[0] as HTMLElement,
    );
    expect(screen.getByText(DATA_GRID_LABELS.selectedCount(1))).toBeDefined();

    await user.click(screen.getByRole("button", { name: "Borrar" }));
    expect(on_action).toHaveBeenCalledWith(["1"]);
  });

  it("el panel de filtros se anuncia como grupo", () => {
    render(
      <DataGrid
        data={FILAS}
        columns={COLUMNS}
        getRowId={Key}
        filterPanel={<p>Contenido del panel</p>}
      />,
    );
    expect(screen.getByRole("group", { name: DATA_GRID_LABELS.filters })).toBeDefined();
    expect(screen.getByText("Contenido del panel")).toBeDefined();
  });
});

describe("DataGrid — menú de columna", () => {
  it("cada columna tiene su menú con nombre", () => {
    render(<DataGrid data={FILAS} columns={COLUMNS} getRowId={Key} withColumnMenu />);
    expect(
      screen.getByRole("button", { name: DATA_GRID_LABELS.columnMenu("Nombre") }),
    ).toBeDefined();
  });

  it("oculta una columna desde el menú y deja restaurarla", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={FILAS} columns={COLUMNS} getRowId={Key} withColumnMenu />);

    await user.click(screen.getByRole("button", { name: DATA_GRID_LABELS.columnMenu("Importe") }));
    await user.click(screen.getByRole("menuitem", { name: DATA_GRID_LABELS.hideColumn }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: DATA_GRID_LABELS.resetColumns })).toBeDefined();
    });
    expect(screen.queryByRole("columnheader", { name: /Importe/ })).toBeNull();

    await user.click(screen.getByRole("button", { name: DATA_GRID_LABELS.resetColumns }));
    expect(screen.getByRole("columnheader", { name: /Importe/ })).toBeDefined();
  });

  it("respeta las columnas ocultas iniciales", () => {
    render(
      <DataGrid
        data={FILAS}
        columns={COLUMNS}
        getRowId={Key}
        withColumnMenu
        defaultHiddenColumns={["importe"]}
      />,
    );
    expect(screen.queryByRole("columnheader", { name: /Importe/ })).toBeNull();
  });
});

describe("DataGrid — resize", () => {
  it("sin resizable no hay asas", () => {
    render(<DataGrid data={FILAS} columns={COLUMNS} getRowId={Key} />);
    expect(screen.queryByRole("button", { name: DATA_GRID_LABELS.resize("Nombre") })).toBeNull();
  });

  it("cada columna redimensionable tiene un asa con nombre", () => {
    render(<DataGrid data={FILAS} columns={COLUMNS} getRowId={Key} resizable />);
    expect(screen.getByRole("button", { name: DATA_GRID_LABELS.resize("Nombre") })).toBeDefined();
  });

  it("el asa se opera con las flechas", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={FILAS} columns={COLUMNS} getRowId={Key} resizable />);
    const handle = screen.getByRole("button", { name: DATA_GRID_LABELS.resize("Nombre") });
    const header = screen.getByRole("columnheader", { name: /Nombre/ });
    const before = header.style.width;
    handle.focus();
    await user.keyboard("{ArrowRight}");
    expect(header.style.width).not.toBe(before);
  });
});

describe("DataGrid — patrón de teclado de grid", () => {
  it("la tabla tiene una sola parada de tabulación", () => {
    render(<DataGrid data={FILAS} columns={COLUMNS} getRowId={Key} />);
    const focusable = [...screen.getByRole("table").querySelectorAll("[data-grid-cell='true']")];
    const tabbable = focusable.filter((cell) => cell.getAttribute("tabindex") === "0");
    expect(tabbable).toHaveLength(1);
  });

  it("las flechas mueven el foco de celda en celda", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={FILAS} columns={COLUMNS} getRowId={Key} />);
    const first = screen.getAllByRole("columnheader")[0] as HTMLElement;
    first.focus();

    await user.keyboard("{ArrowRight}");
    expect(document.activeElement?.getAttribute("data-col")).toBe("1");

    await user.keyboard("{ArrowDown}");
    expect(document.activeElement?.getAttribute("data-row")).toBe("1");

    await user.keyboard("{ArrowLeft}{ArrowUp}");
    expect(document.activeElement).toBe(first);
  });

  it("no se sale de los límites del grid", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={FILAS} columns={COLUMNS} getRowId={Key} />);
    (screen.getAllByRole("columnheader")[0] as HTMLElement).focus();
    await user.keyboard("{ArrowUp}{ArrowLeft}");
    expect(document.activeElement?.getAttribute("data-row")).toBe("0");
    expect(document.activeElement?.getAttribute("data-col")).toBe("0");
  });

  it("Ctrl+End salta a la última celda y Ctrl+Home vuelve", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={FILAS} columns={COLUMNS} getRowId={Key} />);
    (screen.getAllByRole("columnheader")[0] as HTMLElement).focus();

    await user.keyboard("{Control>}{End}{/Control}");
    expect(document.activeElement?.getAttribute("data-row")).toBe("3");
    expect(document.activeElement?.getAttribute("data-col")).toBe("1");

    await user.keyboard("{Control>}{Home}{/Control}");
    expect(document.activeElement?.getAttribute("data-row")).toBe("0");
  });

  it("Home y End se mueven dentro de la fila", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={FILAS} columns={COLUMNS} getRowId={Key} />);
    (screen.getAllByRole("columnheader")[0] as HTMLElement).focus();
    await user.keyboard("{ArrowDown}{End}");
    expect(document.activeElement?.getAttribute("data-row")).toBe("1");
    expect(document.activeElement?.getAttribute("data-col")).toBe("1");
  });
});

describe("DataGrid — export CSV", () => {
  it("monta el botón cuando se pide", () => {
    render(<DataGrid data={FILAS} columns={COLUMNS} getRowId={Key} exportCsv />);
    expect(screen.getByRole("button", { name: DATA_GRID_LABELS.exportCsv })).toBeDefined();
  });

  it("sin exportCsv no hay botón", () => {
    render(<DataGrid data={FILAS} columns={COLUMNS} getRowId={Key} />);
    expect(screen.queryByRole("button", { name: DATA_GRID_LABELS.exportCsv })).toBeNull();
  });

  it("con selectionOnly exporta la selección entera, no la de la página visible", async () => {
    const user = userEvent.setup();
    const blobs: Blob[] = [];
    vi.spyOn(URL, "createObjectURL").mockImplementation((value) => {
      if (value instanceof Blob) blobs.push(value);
      return "blob:test";
    });
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);

    try {
      render(
        <DataGrid
          data={FILAS}
          columns={COLUMNS}
          getRowId={Key}
          selectable
          pageSize={2}
          selected={["1", "3"]}
          exportCsv={{ selectionOnly: true }}
        />,
      );
      await user.click(screen.getByRole("button", { name: DATA_GRID_LABELS.exportCsv }));

      const BOM = "﻿";
      const text = (await blobs[0]?.text()) ?? "";
      const lines = text.replace(BOM, "").trim().split("\r\n");

      expect(lines).toEqual(["Nombre,Importe", "Acme,1200", "Gamma,450"]);
    } finally {
      vi.restoreAllMocks();
    }
  });
});
