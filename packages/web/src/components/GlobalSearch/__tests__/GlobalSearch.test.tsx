import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { GLOBAL_SEARCH_LABELS } from "../labels.js";
import { GlobalSearch } from "../GlobalSearch.js";
import type { GlobalSearchResult } from "../GlobalSearch.types.js";

afterEach(cleanup);

const RESULTS: GlobalSearchResult[] = [
  { id: "1", title: "Cliente Acme", group: "Clientes", description: "RFC ACM010101" },
  { id: "2", title: "Cliente Beta", group: "Clientes" },
  { id: "3", title: "Factura 40-118", group: "Facturas" },
];

function Open(props: Partial<Parameters<typeof GlobalSearch>[0]> = {}) {
  return (
    <GlobalSearch results={RESULTS} onQueryChange={vi.fn()} opened onOpenChange={vi.fn()} {...props} />
  );
}

describe("GlobalSearch", () => {
  it("pinta un disparador con atajo", () => {
    render(<GlobalSearch results={[]} onQueryChange={vi.fn()} />);
    const trigger = screen.getByRole("button", { name: /Buscar/ });
    expect(trigger.textContent).toContain(GLOBAL_SEARCH_LABELS.shortcut);
  });

  it("puede prescindir del disparador", () => {
    render(<GlobalSearch results={[]} onQueryChange={vi.fn()} withTrigger={false} />);
    expect(screen.queryByRole("button", { name: /Buscar/ })).toBeNull();
  });

  it("el campo es un combobox con la lista vinculada", () => {
    render(<Open />);
    const input = screen.getByRole("combobox", { name: GLOBAL_SEARCH_LABELS.input });
    const list = screen.getByRole("listbox", { name: GLOBAL_SEARCH_LABELS.input });
    expect(input.getAttribute("aria-controls")).toBe(list.getAttribute("id"));
  });

  it("agrupa los resultados y etiqueta cada grupo", () => {
    render(<Open />);
    expect(screen.getByRole("group", { name: "Clientes" })).toBeDefined();
    expect(screen.getByRole("group", { name: "Facturas" })).toBeDefined();
  });

  it("la primera opción arranca activa", () => {
    render(<Open />);
    const options = screen.getAllByRole("option");
    expect(options[0]?.getAttribute("aria-selected")).toBe("true");
    expect(options[1]?.getAttribute("aria-selected")).toBe("false");
  });

  it("las flechas mueven el foco virtual y ciclan", async () => {
    const user = userEvent.setup();
    render(<Open />);
    const input = screen.getByRole("combobox", { name: GLOBAL_SEARCH_LABELS.input });
    input.focus();

    await user.keyboard("{ArrowDown}");
    expect(screen.getAllByRole("option")[1]?.getAttribute("aria-selected")).toBe("true");

    await user.keyboard("{ArrowUp}{ArrowUp}");
    expect(screen.getAllByRole("option")[2]?.getAttribute("aria-selected")).toBe("true");
  });

  it("Home y End saltan a los extremos", async () => {
    const user = userEvent.setup();
    render(<Open />);
    screen.getByRole("combobox", { name: GLOBAL_SEARCH_LABELS.input }).focus();
    await user.keyboard("{End}");
    expect(screen.getAllByRole("option")[2]?.getAttribute("aria-selected")).toBe("true");
    await user.keyboard("{Home}");
    expect(screen.getAllByRole("option")[0]?.getAttribute("aria-selected")).toBe("true");
  });

  it("Enter elige el resultado activo", async () => {
    const user = userEvent.setup();
    const on_select = vi.fn();
    render(<Open onSelect={on_select} />);
    screen.getByRole("combobox", { name: GLOBAL_SEARCH_LABELS.input }).focus();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(on_select).toHaveBeenCalledWith(RESULTS[1]);
  });

  it("el clic también elige", async () => {
    const user = userEvent.setup();
    const on_select = vi.fn();
    render(<Open onSelect={on_select} />);
    await user.click(screen.getByRole("option", { name: /Factura 40-118/ }));
    expect(on_select).toHaveBeenCalledWith(RESULTS[2]);
  });

  it("anuncia el recuento en una live region", () => {
    render(<Open />);
    expect(screen.getByText(GLOBAL_SEARCH_LABELS.results(3))).toBeDefined();
  });

  it("muestra el vacío cuando no hay resultados", () => {
    render(<Open results={[]} />);
    expect(screen.getByText(GLOBAL_SEARCH_LABELS.empty)).toBeDefined();
  });

  it("con la consulta vacía enseña los recientes", () => {
    const recent: GlobalSearchResult[] = [{ id: "r1", title: "Último visitado" }];
    render(<Open results={[]} recent={recent} />);
    expect(screen.getByRole("option", { name: /Último visitado/ })).toBeDefined();
  });

  it("anuncia la carga mientras busca", () => {
    render(<Open loading />);
    expect(screen.getAllByText(GLOBAL_SEARCH_LABELS.loading).length).toBeGreaterThan(0);
  });
});
