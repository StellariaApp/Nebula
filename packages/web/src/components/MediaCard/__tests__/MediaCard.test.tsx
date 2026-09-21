import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { MediaCard } from "../MediaCard.js";

afterEach(cleanup);

describe("MediaCard (ADR-198)", () => {
  it("con href es un enlace entero; el título es un h3 y la primera lámina lleva el nombre", () => {
    render(
      <MediaCard
        avatar={{ name: "Rose" }}
        frames={["a.jpg", "b.jpg", "a.jpg"]}
        href="/explore/rose"
        subtitle="Estudio Aurora"
        title="Rose"
      />,
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/explore/rose");
    expect(screen.getByRole("heading", { level: 3, name: "Rose" })).toBeDefined();
    expect(screen.getAllByRole("img", { name: "Rose" }).length).toBeGreaterThan(0);
    expect(link.querySelectorAll("img").length).toBe(2 + 0);
  });

  it("sin href y con onOpen pinta una lámina que abre, hermana del botón de acción", async () => {
    const on_open = vi.fn();
    const user = userEvent.setup();
    render(
      <MediaCard
        action={<button type="button">menú</button>}
        frames={["a.jpg"]}
        onOpen={on_open}
        openLabel="Abrir la pieza"
        title="Pieza"
      />,
    );
    expect(screen.queryByRole("link")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Abrir la pieza" }));
    expect(on_open).toHaveBeenCalledTimes(1);
    const menu = screen.getByRole("button", { name: "menú" });
    expect(menu.closest("button")).toBe(menu);
  });

  it("los rótulos de esquina y el reloj se pintan; con actionStart el rótulo baja junto al reloj", () => {
    const { container, rerender } = render(
      <MediaCard
        clock="0:05"
        cornerEnd={{ text: "nueva", tone: "accent" }}
        cornerStart={{ text: "Pública", tone: "plain" }}
        frames={["a.jpg"]}
        title="Pieza"
      />,
    );
    expect(screen.getByText("nueva")).toBeDefined();
    expect(screen.getByText("Pública")).toBeDefined();
    expect(screen.getByText("0:05")).toBeDefined();
    rerender(
      <MediaCard
        actionStart={<button type="button">guardar</button>}
        clock="0:05"
        cornerStart={{ text: "Pública", tone: "plain" }}
        frames={["a.jpg"]}
        title="Pieza"
      />,
    );
    const stamped = screen.getByText("Pública").closest("div[data-hidden]");
    expect(stamped?.contains(screen.getByText("0:05"))).toBe(true);
    expect(container.querySelector("video")).toBeNull();
  });

  it("el sello y las cifras comparten fila sobre el pie", () => {
    render(
      <MediaCard
        ceiling="E"
        ceilingLabel="Escalón"
        clock="0:05"
        count={{ icon: <span />, label: "Versión", value: "v10" }}
        frames={["a.jpg"]}
        stamp={{ text: "Clon digital", tone: "plain" }}
        title="Pieza"
      />,
    );
    const row = screen.getByText("Clon digital").parentElement?.parentElement;
    expect(row?.contains(screen.getByText("0:05"))).toBe(true);
    expect(row?.contains(screen.getByText("v10"))).toBe(true);
    expect(row?.contains(screen.getByText("E"))).toBe(true);
  });

  it("playable monta el reproductor diferido en vez de las láminas", () => {
    render(<MediaCard clip="clip.mp4" frames={["a.jpg"]} playable seconds={5} title="Clip" />);
    expect(screen.getByRole("button", { name: "Play" })).toBeDefined();
    expect(screen.getByText("0:00/0:05")).toBeDefined();
  });
});
