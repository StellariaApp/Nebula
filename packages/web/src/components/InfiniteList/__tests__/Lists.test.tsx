import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import { SearchableList } from "../../SearchableList/SearchableList.js";
import { InfiniteList } from "../InfiniteList.js";

interface Row {
  id: string;
  name: string;
}

const ROWS: readonly Row[] = [
  { id: "1", name: "Ana" },
  { id: "2", name: "Bruno" },
  { id: "3", name: "Carla" },
];

function Key(row: Row): string {
  return row.id;
}

function Render(row: Row): string {
  return row.name;
}

class FakeObserver {
  static instances: FakeObserver[] = [];
  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    FakeObserver.instances.push(this);
  }

  observe(): void {}
  disconnect(): void {}
  unobserve(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  Intersect(): void {
    this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this as never);
  }
}

beforeEach(() => {
  FakeObserver.instances = [];
  vi.stubGlobal("IntersectionObserver", FakeObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("InfiniteList — props sueltas", () => {
  it("pinta los items y respeta la clave", () => {
    render(<InfiniteList items={ROWS} getKey={Key} renderItem={Render} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("sin items pinta el vacío", () => {
    render(<InfiniteList items={[]} getKey={Key} renderItem={Render} empty={<p>Sin datos</p>} />);
    expect(screen.getByText("Sin datos")).toBeDefined();
  });

  it("el botón de cargar más existe aunque autoLoad esté activo", async () => {
    const on_load = vi.fn();
    render(
      <InfiniteList items={ROWS} getKey={Key} renderItem={Render} hasMore onLoadMore={on_load} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Cargar más" }));
    expect(on_load).toHaveBeenCalledTimes(1);
  });

  it("el sentinel dispara la carga al intersecar", async () => {
    const on_load = vi.fn();
    render(
      <InfiniteList items={ROWS} getKey={Key} renderItem={Render} hasMore onLoadMore={on_load} />,
    );
    await waitFor(() => {
      expect(FakeObserver.instances.length).toBeGreaterThan(0);
    });
    FakeObserver.instances[0]?.Intersect();
    expect(on_load).toHaveBeenCalledTimes(1);
  });

  it("sin hasMore no hay botón ni observer", () => {
    render(<InfiniteList items={ROWS} getKey={Key} renderItem={Render} />);
    expect(screen.queryByRole("button", { name: "Cargar más" })).toBeNull();
    expect(FakeObserver.instances).toHaveLength(0);
  });

  it("loadingMore anuncia en la región viva y marca aria-busy", () => {
    render(<InfiniteList items={ROWS} getKey={Key} renderItem={Render} loadingMore />);
    expect(screen.getByRole("status").textContent).toBe("Cargando más elementos");
    expect(screen.getByRole("list").getAttribute("aria-busy")).toBe("true");
  });
});

describe("InfiniteList — objeto de query duck-typed", () => {
  it("aplana data.pages cuando las páginas son arrays", () => {
    render(
      <InfiniteList
        query={{ data: { pages: [ROWS.slice(0, 2), ROWS.slice(2)] } }}
        getKey={Key}
        renderItem={Render}
      />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("getPageItems desenvuelve páginas con cursor", () => {
    render(
      <InfiniteList<Row, { items: readonly Row[]; next: string | null }>
        query={{ data: { pages: [{ items: ROWS, next: null }] } }}
        getPageItems={(page) => page.items}
        getKey={Key}
        renderItem={Render}
      />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("sin getPageItems una página que no es array devuelve lista vacía", () => {
    render(
      <InfiniteList<Row, { items: readonly Row[] }>
        query={{ data: { pages: [{ items: ROWS }] } }}
        getKey={Key}
        renderItem={Render}
        empty={<p>Sin datos</p>}
      />,
    );
    expect(screen.getByText("Sin datos")).toBeDefined();
  });

  it("hasNextPage y fetchNextPage del query gobiernan el pie", async () => {
    const fetch_next = vi.fn();
    render(
      <InfiniteList
        query={{ data: { pages: [ROWS] }, hasNextPage: true, fetchNextPage: fetch_next }}
        getKey={Key}
        renderItem={Render}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Cargar más" }));
    expect(fetch_next).toHaveBeenCalledTimes(1);
  });

  it("isPending se lee igual que isLoading", () => {
    render(
      <InfiniteList
        query={{ isPending: true }}
        getKey={Key}
        renderItem={Render}
        skeleton={<p>Cargando</p>}
      />,
    );
    expect(screen.getByText("Cargando")).toBeDefined();
  });

  it("una prop suelta gana al objeto de query", async () => {
    const fetch_next = vi.fn();
    const on_load = vi.fn();
    render(
      <InfiniteList
        query={{ data: { pages: [ROWS] }, hasNextPage: true, fetchNextPage: fetch_next }}
        onLoadMore={on_load}
        getKey={Key}
        renderItem={Render}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Cargar más" }));
    expect(on_load).toHaveBeenCalledTimes(1);
    expect(fetch_next).not.toHaveBeenCalled();
  });
});

describe("SearchableList", () => {
  it("filtra en cliente por getSearchText", async () => {
    render(
      <SearchableList
        items={ROWS}
        getKey={Key}
        renderItem={Render}
        getSearchText={(row) => row.name}
        debounce={0}
      />,
    );
    await userEvent.type(screen.getByRole("searchbox"), "car");
    await waitFor(() => {
      expect(screen.getAllByRole("listitem")).toHaveLength(1);
    });
    expect(screen.getByText("Carla")).toBeDefined();
  });

  it("mode server no filtra y delega en onSearchChange", async () => {
    const on_search = vi.fn();
    render(
      <SearchableList
        items={ROWS}
        mode="server"
        getKey={Key}
        renderItem={Render}
        onSearchChange={on_search}
        debounce={0}
      />,
    );
    await userEvent.type(screen.getByRole("searchbox"), "car");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    await waitFor(() => {
      expect(on_search).toHaveBeenCalled();
    });
  });

  it("una búsqueda sin resultados usa noResults, no empty", async () => {
    render(
      <SearchableList
        items={ROWS}
        getKey={Key}
        renderItem={Render}
        getSearchText={(row) => row.name}
        debounce={0}
        empty={<p>Sin datos</p>}
        noResults={<p>Nada coincide</p>}
      />,
    );
    await userEvent.type(screen.getByRole("searchbox"), "zzz");
    await waitFor(() => {
      expect(screen.getByText("Nada coincide")).toBeDefined();
    });
    expect(screen.queryByText("Sin datos")).toBeNull();
  });

  it("minLength retrasa el filtrado", async () => {
    render(
      <SearchableList
        items={ROWS}
        getKey={Key}
        renderItem={Render}
        getSearchText={(row) => row.name}
        debounce={0}
        minLength={3}
      />,
    );
    await userEvent.type(screen.getByRole("searchbox"), "ca");
    await waitFor(() => {
      expect(screen.getAllByRole("listitem")).toHaveLength(3);
    });
  });

  it("withCount publica el recuento en una región viva", () => {
    render(<SearchableList items={ROWS} getKey={Key} renderItem={Render} withCount />);
    expect(screen.getByText("3 resultados")).toBeDefined();
  });

  it("un filtro propio sustituye a la comparación por defecto", async () => {
    render(
      <SearchableList
        items={ROWS}
        getKey={Key}
        renderItem={Render}
        filter={(row, search) => row.id === search}
        debounce={0}
      />,
    );
    await userEvent.type(screen.getByRole("searchbox"), "2");
    await waitFor(() => {
      expect(screen.getAllByRole("listitem")).toHaveLength(1);
    });
    expect(screen.getByText("Bruno")).toBeDefined();
  });
});
