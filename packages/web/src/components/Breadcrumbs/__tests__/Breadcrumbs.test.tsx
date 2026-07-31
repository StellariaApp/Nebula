import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Breadcrumbs, CollapseItems } from "../Breadcrumbs.js";
import { BREADCRUMBS_LABELS } from "../labels.js";
import type { BreadcrumbItem } from "../Breadcrumbs.types.js";

afterEach(cleanup);

const ITEMS: BreadcrumbItem[] = [
  { key: "inicio", label: "Inicio", href: "/" },
  { key: "cartera", label: "Cartera", href: "/cartera" },
  { key: "expediente", label: "Expediente 40-118" },
];

const LONG: BreadcrumbItem[] = Array.from({ length: 7 }, (_, index) => ({
  key: `n${String(index)}`,
  label: `Nivel ${String(index)}`,
  href: `/n${String(index)}`,
}));

describe("CollapseItems", () => {
  it("no colapsa por debajo del umbral", () => {
    expect(CollapseItems(ITEMS, 5, false)).toHaveLength(3);
  });

  it("colapsa los intermedios conservando el primero y los dos últimos", () => {
    const slots = CollapseItems(LONG, 5, false);
    expect(slots).toHaveLength(4);
    expect(slots[0]?.item?.key).toBe("n0");
    expect(slots[1]?.kind).toBe("collapsed");
    expect(slots[1]?.hidden).toBe(4);
    expect(slots[3]?.item?.key).toBe("n6");
  });

  it("expandido devuelve todo", () => {
    expect(CollapseItems(LONG, 5, true)).toHaveLength(7);
  });

  it("collapseFrom 0 desactiva el colapso", () => {
    expect(CollapseItems(LONG, 0, false)).toHaveLength(7);
  });
});

describe("Breadcrumbs", () => {
  it("es una navegación etiquetada con una lista ordenada", () => {
    render(<Breadcrumbs items={ITEMS} />);
    expect(screen.getByRole("navigation", { name: BREADCRUMBS_LABELS.nav })).toBeDefined();
    expect(screen.getByRole("list")).toBeDefined();
  });

  it("el último item es la página actual y no es enlace", () => {
    render(<Breadcrumbs items={ITEMS} />);
    const current = screen.getByText("Expediente 40-118");
    expect(current.getAttribute("aria-current")).toBe("page");
    expect(screen.queryByRole("link", { name: "Expediente 40-118" })).toBeNull();
  });

  it("los anteriores son enlaces cuando traen href", () => {
    render(<Breadcrumbs items={ITEMS} />);
    expect(screen.getByRole("link", { name: "Inicio" }).getAttribute("href")).toBe("/");
  });

  it("sin href y con onSelect son botones", async () => {
    const user = userEvent.setup();
    const on_select = vi.fn();
    render(
      <Breadcrumbs
        items={[{ key: "a", label: "Volver", onSelect: on_select }, { key: "b", label: "Aquí" }]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Volver" }));
    expect(on_select).toHaveBeenCalledTimes(1);
  });

  it("acepta un adapter de router por prop component", () => {
    function RouterLink(props: { href?: string; children?: React.ReactNode }) {
      return <a data-router="true" href={props.href}>{props.children}</a>;
    }
    render(
      <Breadcrumbs
        items={[
          { key: "a", label: "Inicio", href: "/", component: RouterLink },
          { key: "b", label: "Aquí" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Inicio" }).getAttribute("data-router")).toBe("true");
  });

  it("los separadores no llegan al lector de pantalla", () => {
    render(<Breadcrumbs items={ITEMS} data-testid="bc" />);
    const seps = screen.getByTestId("bc").querySelectorAll("[aria-hidden='true']");
    expect(seps.length).toBeGreaterThan(0);
  });

  it("colapsa una ruta larga y la expande al pulsar", async () => {
    const user = userEvent.setup();
    render(<Breadcrumbs items={LONG} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);

    await user.click(screen.getByRole("button", { name: BREADCRUMBS_LABELS.collapsed }));
    expect(screen.getAllByRole("listitem")).toHaveLength(7);
  });

  it("acepta un separador propio", () => {
    render(<Breadcrumbs items={ITEMS} separator=">" data-testid="bc" />);
    expect(screen.getByTestId("bc").textContent).toContain(">");
  });

  it("acepta etiquetas propias", () => {
    render(<Breadcrumbs items={ITEMS} labels={{ nav: "Migas" }} />);
    expect(screen.getByRole("navigation", { name: "Migas" })).toBeDefined();
  });

  it("aguanta una ruta de un solo item", () => {
    render(<Breadcrumbs items={[{ key: "a", label: "Único" }]} />);
    expect(screen.getByText("Único").getAttribute("aria-current")).toBe("page");
  });
});
