import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Pagination } from "../Pagination.js";

afterEach(cleanup);

describe("Pagination", () => {
  it("marca la página actual con aria-current='page'", () => {
    render(<Pagination total={5} defaultValue={3} />);
    expect(screen.getByRole("button", { name: "3" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("button", { name: "2" }).getAttribute("aria-current")).toBeNull();
  });

  it("navega al hacer click en una página y notifica onChange", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination total={5} defaultValue={1} onChange={OnChange} />);

    await user.click(screen.getByRole("button", { name: "3" }));
    expect(OnChange).toHaveBeenCalledWith(3);
  });

  it("los controles anterior/siguiente avanzan y se deshabilitan en los extremos", async () => {
    const user = userEvent.setup();
    render(<Pagination total={3} defaultValue={1} />);

    const prev = screen.getByRole("button", { name: "Página anterior" });
    const next = screen.getByRole("button", { name: "Página siguiente" });
    expect(prev.hasAttribute("disabled")).toBe(true);

    await user.click(next);
    expect(screen.getByRole("button", { name: "2" }).getAttribute("aria-current")).toBe("page");

    await user.click(next);
    expect(next.hasAttribute("disabled")).toBe(true);
  });

  it("inserta elipsis cuando hay más páginas que las visibles", () => {
    render(<Pagination total={20} defaultValue={10} />);
    expect(screen.getAllByText("…").length).toBeGreaterThan(0);
  });

  it("respeta el modo controlado", () => {
    render(<Pagination total={5} value={4} onChange={() => undefined} />);
    expect(screen.getByRole("button", { name: "4" }).getAttribute("aria-current")).toBe("page");
  });

  it("deshabilitado no navega", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination total={5} defaultValue={1} onChange={OnChange} disabled />);

    await user.click(screen.getByRole("button", { name: "2" }));
    expect(OnChange).not.toHaveBeenCalled();
  });

  it("nav expone aria-label", () => {
    render(<Pagination total={5} aria-label="Resultados" />);
    expect(screen.getByRole("navigation", { name: "Resultados" })).not.toBeNull();
  });
});
