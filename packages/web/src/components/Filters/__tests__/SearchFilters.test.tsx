import { userEvent } from "@testing-library/user-event";
import { useState, type ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Search } from "../../Search/Search.js";
import { Filters } from "../Filters.js";
import { ActiveCount, JoinRange, RangeParts, StateAccessors } from "../filter-state.js";
import type { FilterDescriptor, FilterState } from "../Filters.types.js";

afterEach(cleanup);

const FILTERS: readonly FilterDescriptor[] = [
  {
    key: "estado",
    label: "Estado",
    type: "select",
    options: [
      { value: "pendiente", label: "Pendiente" },
      { value: "conciliado", label: "Conciliado" },
    ],
  },
  { key: "importe", label: "Importe", type: "range", min: 0, max: 1000 },
  { key: "cliente", label: "Cliente", type: "text" },
];

function Controlled(props: { onChange?: (state: FilterState) => void }): ReactElement {
  const [state, set_state] = useState<FilterState>({});
  return (
    <Filters
      filters={FILTERS}
      state={state}
      onChange={(next) => {
        set_state(next);
        props.onChange?.(next);
      }}
    />
  );
}

describe("filter-state", () => {
  it("StateAccessors normaliza valor simple y múltiple", () => {
    const accessors = StateAccessors({ a: "x", b: ["y", "z"] }, () => {});
    expect(accessors.value("a")).toBe("x");
    expect(accessors.values("a")).toEqual(["x"]);
    expect(accessors.value("b")).toBe("y");
    expect(accessors.values("b")).toEqual(["y", "z"]);
    expect(accessors.value("c")).toBeUndefined();
  });

  it("onDelete quita la clave en vez de dejarla vacía", () => {
    const set = vi.fn();
    StateAccessors({ a: "x", b: "y" }, set).onDelete("a");
    expect(set).toHaveBeenCalledWith({ b: "y" });
  });

  it("el recuento de activos ignora cadenas y listas vacías", () => {
    const accessors = StateAccessors({ a: "x", b: "", c: [] }, () => {});
    expect(ActiveCount(accessors, ["a", "b", "c"])).toBe(1);
  });

  it("el rango viaja en una sola clave y admite extremos abiertos", () => {
    expect(JoinRange("10", "250")).toBe("10..250");
    expect(JoinRange("", "250")).toBe("..250");
    expect(JoinRange("", "")).toBe("");
    expect(RangeParts("10..250")).toEqual(["10", "250"]);
    expect(RangeParts("..250")).toEqual(["", "250"]);
    expect(RangeParts(undefined)).toEqual(["", ""]);
  });
});

describe("Filters", () => {
  it("el disparador abre el panel con un filtro por descriptor", async () => {
    render(<Controlled />);
    await userEvent.click(screen.getByRole("button", { name: /Filtros/ }));
    await screen.findByLabelText("Cliente");
    const rendered = [...document.querySelectorAll("[data-filter]")].map((node) =>
      node.getAttribute("data-filter"),
    );
    expect(rendered).toEqual(["estado", "importe", "cliente"]);
  });

  it("escribir en un filtro de texto publica el estado", async () => {
    const on_change = vi.fn();
    render(<Controlled onChange={on_change} />);
    await userEvent.click(screen.getByRole("button", { name: /Filtros/ }));
    await screen.findByText("Cliente");
    await userEvent.type(screen.getByLabelText("Cliente"), "au");
    expect(on_change).toHaveBeenCalled();
    const last = on_change.mock.calls.at(-1)?.[0] as FilterState;
    expect(last["cliente"]).toBe("au");
  });

  it("sin filtros declarados el panel lo dice", async () => {
    render(<Filters filters={[]} />);
    await userEvent.click(screen.getByRole("button", { name: /Filtros/ }));
    expect(await screen.findByText("No hay filtros disponibles")).toBeDefined();
  });

  it("acepta accessors externos en vez de estado propio", async () => {
    const on_set = vi.fn();
    render(
      <Filters
        filters={FILTERS}
        accessors={{
          value: (key) => (key === "cliente" ? "aurora" : undefined),
          values: () => undefined,
          onSet: on_set,
          onDelete: vi.fn(),
        }}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Filtros/ }));
    expect(await screen.findByDisplayValue("aurora")).toBeDefined();
  });

  it("con filtros activos aparece el badge y el quitar todos", async () => {
    const on_delete = vi.fn();
    render(
      <Filters
        filters={FILTERS}
        accessors={{
          value: (key) => (key === "cliente" ? "aurora" : undefined),
          values: () => undefined,
          onSet: vi.fn(),
          onDelete: on_delete,
        }}
      />,
    );
    expect(screen.getByRole("button", { name: /Filtros/ }).textContent).toContain("1");
    await userEvent.click(screen.getByRole("button", { name: /Filtros/ }));
    await userEvent.click(await screen.findByRole("button", { name: "Quitar todos" }));
    expect(on_delete).toHaveBeenCalled();
  });
});

describe("Search", () => {
  it("compone el buscador y expone su nombre accesible", () => {
    render(<Search />);
    expect(screen.getByRole("searchbox", { name: "Buscar" })).toBeDefined();
  });

  it("hideSearch retira el campo y conserva los slots", () => {
    render(<Search hideSearch before={<span>antes</span>} after={<span>después</span>} />);
    expect(screen.queryByRole("searchbox")).toBeNull();
    expect(screen.getByText("antes")).toBeDefined();
    expect(screen.getByText("después")).toBeDefined();
  });

  it("onChange va por pulsación", async () => {
    const on_change = vi.fn();
    render(<Search onChange={on_change} />);
    await userEvent.type(screen.getByRole("searchbox"), "abc");
    expect(on_change).toHaveBeenCalledTimes(3);
  });

  it("el botón de refrescar solo existe cuando hay onRefresh", async () => {
    const on_refresh = vi.fn();
    const { unmount } = render(<Search />);
    expect(screen.queryByRole("button", { name: "Actualizar" })).toBeNull();
    unmount();

    render(<Search onRefresh={on_refresh} />);
    await userEvent.click(screen.getByRole("button", { name: "Actualizar" }));
    expect(on_refresh).toHaveBeenCalledTimes(1);
  });

  it("los filtros se delegan en Filters", async () => {
    render(<Search filters={FILTERS} />);
    await userEvent.click(screen.getByRole("button", { name: /Filtros/ }));
    await screen.findByLabelText("Cliente");
    expect(document.querySelectorAll("[data-filter]")).toHaveLength(3);
  });

  it("top y bottom son slots, no posicionamiento", () => {
    render(<Search top={<span>encima</span>} bottom={<span>debajo</span>} />);
    expect(screen.getByText("encima")).toBeDefined();
    expect(screen.getByText("debajo")).toBeDefined();
  });
});
