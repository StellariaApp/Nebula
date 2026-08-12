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
    <GlobalSearch
      results={RESULTS}
      onQueryChange={vi.fn()}
      opened
      onOpenChange={vi.fn()}
      {...props}
    />
  );
}

describe("un resultado con href es un enlace de verdad", () => {
  const LINKED: GlobalSearchResult[] = [
    { id: "1", title: "Cliente Acme", group: "Clientes", href: "/clientes/acme" },
  ];

  it("se pinta como ancla con su destino, para el clic central y la pestaña nueva", () => {
    render(<Open results={LINKED} />);
    const option = screen.getByRole("option", { name: /Cliente Acme/ });
    expect(option.tagName).toBe("A");
    expect(option.getAttribute("href")).toBe("/clientes/acme");
  });

  it("sin nadie que lo reclame el navegador sigue el enlace", async () => {
    const user = userEvent.setup();
    render(<Open results={LINKED} />);
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    screen.getByRole("option", { name: /Cliente Acme/ }).dispatchEvent(event);
    await user.tab();
    expect(event.defaultPrevented).toBe(false);
  });

  it("con onSelect manda el consumidor y no se navega dos veces", () => {
    const on_select = vi.fn();
    render(<Open results={LINKED} onSelect={on_select} />);
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    screen.getByRole("option", { name: /Cliente Acme/ }).dispatchEvent(event);
    expect(on_select).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it("sin href sigue siendo una opcion, no un ancla", () => {
    render(<Open />);
    expect(screen.getByRole("option", { name: /Cliente Acme/ }).tagName).not.toBe("A");
  });
});

describe("los rotulos por defecto estan en ingles (ADR-114)", () => {
  it("el recuento no mezcla idiomas", () => {
    expect(GLOBAL_SEARCH_LABELS.results(0)).toBe("No results");
    expect(GLOBAL_SEARCH_LABELS.results(1)).toBe("1 result");
    expect(GLOBAL_SEARCH_LABELS.results(3)).toBe("3 results");
  });
});

describe("GlobalSearch", () => {
  it("pinta un disparador con atajo", () => {
    render(<GlobalSearch results={[]} onQueryChange={vi.fn()} />);
    const trigger = screen.getByRole("button", { name: /Search/ });
    expect(trigger.textContent).toContain(GLOBAL_SEARCH_LABELS.shortcut);
  });

  it("puede prescindir del disparador", () => {
    render(<GlobalSearch results={[]} onQueryChange={vi.fn()} withTrigger={false} />);
    expect(screen.queryByRole("button", { name: /Search/ })).toBeNull();
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
