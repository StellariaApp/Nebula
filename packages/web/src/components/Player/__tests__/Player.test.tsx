import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Player } from "../Player.js";

vi.mock("react-player", () => ({
  default: (props: { src: string; controls?: boolean; className?: string }): ReactElement => (
    <div
      data-testid="react-player"
      data-src={props.src}
      data-controls={props.controls === true ? "true" : "false"}
      className={props.className}
    />
  ),
}));

afterEach(cleanup);

const SRC = "https://example.test/clip.mp4";

describe("Player", () => {
  it("monta el reproductor inline cuando no se le pasa opened", () => {
    render(<Player src={SRC} />);
    expect(screen.getByTestId("react-player").getAttribute("data-src")).toBe(SRC);
  });

  it("no pinta nada cuando el modal está cerrado", () => {
    render(<Player src={SRC} opened={false} onClose={vi.fn()} />);
    expect(screen.queryByTestId("react-player")).toBeNull();
  });

  it("abre el reproductor dentro de un diálogo con nombre accesible", () => {
    render(<Player src={SRC} opened onClose={vi.fn()} />);
    expect(screen.getByRole("dialog", { name: "Video player" })).toBeDefined();
    expect(screen.getByTestId("react-player")).toBeDefined();
  });

  it("usa el título como nombre del diálogo cuando se pasa", () => {
    render(<Player src={SRC} opened onClose={vi.fn()} title="Demo de Nebula" />);
    expect(screen.getByRole("dialog", { name: "Demo de Nebula" })).toBeDefined();
  });

  it("lleva controles nativos por defecto", () => {
    render(<Player src={SRC} />);
    expect(screen.getByTestId("react-player").getAttribute("data-controls")).toBe("true");
  });

  it("la relación de aspecto va en una var, no en la clase", () => {
    render(<Player src={SRC} ratio={4 / 3} data-testid="frame" />);
    const style = screen.getByTestId("frame").getAttribute("style") ?? "";
    expect(style).toMatch(/1\.33/);
  });

  it("acepta etiquetas propias para el cierre", () => {
    render(<Player src={SRC} opened onClose={vi.fn()} labels={{ close: "Salir" }} />);
    expect(screen.getByRole("button", { name: "Salir" })).toBeDefined();
  });
});
