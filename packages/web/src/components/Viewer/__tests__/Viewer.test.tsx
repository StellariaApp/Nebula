import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Viewer } from "../Viewer.js";

afterEach(cleanup);

const IMAGES = [
  { src: "a.jpg", alt: "Primera", thumbnail: "a-thumb.jpg" },
  { src: "b.jpg", alt: "Segunda" },
  { src: "c.jpg", alt: "Tercera" },
];

describe("Viewer (ADR-196)", () => {
  it("cerrado no pinta nada", () => {
    render(
      <Viewer images={IMAGES} index={0} onClose={vi.fn()} onIndexChange={vi.fn()} opened={false} />,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("abierto es un diálogo con contador, tira y las tres piezas", () => {
    render(<Viewer images={IMAGES} index={1} onClose={vi.fn()} onIndexChange={vi.fn()} opened />);
    expect(screen.getByRole("dialog", { name: "Image viewer" })).toBeDefined();
    expect(screen.getByText("2 / 3")).toBeDefined();
    const thumbs = screen.getByRole("group", { name: "Image viewer" });
    expect(thumbs.querySelectorAll("button")).toHaveLength(3);
    expect(thumbs.querySelector("[aria-current='true']")?.getAttribute("aria-label")).toBe(
      "Segunda",
    );
    expect(thumbs.querySelector("img")?.getAttribute("src")).toBe("a-thumb.jpg");
  });

  it("las flechas del teclado cambian de pieza y Escape cierra", async () => {
    const on_index = vi.fn();
    const on_close = vi.fn();
    const user = userEvent.setup();
    render(<Viewer images={IMAGES} index={1} onClose={on_close} onIndexChange={on_index} opened />);
    await user.keyboard("{ArrowRight}");
    expect(on_index).toHaveBeenLastCalledWith(2);
    await user.keyboard("{ArrowLeft}");
    expect(on_index).toHaveBeenLastCalledWith(0);
    await user.keyboard("{Escape}");
    expect(on_close).toHaveBeenCalledTimes(1);
  });

  it("una sola pieza: sin contador, sin tira, sin flechas", () => {
    render(
      <Viewer
        images={IMAGES.slice(0, 1)}
        index={0}
        onClose={vi.fn()}
        onIndexChange={vi.fn()}
        opened
      />,
    );
    expect(screen.queryByText("1 / 1")).toBeNull();
    expect(screen.queryByRole("group")).toBeNull();
    expect(screen.queryByRole("button", { name: "Next" })).toBeNull();
  });

  it("withDownload pinta un enlace de descarga de la pieza a la vista, y los rótulos se traducen", () => {
    render(
      <Viewer
        images={IMAGES}
        index={2}
        labels={{ close: "Cerrar", download: "Descargar" }}
        onClose={vi.fn()}
        onIndexChange={vi.fn()}
        opened
        withDownload
      />,
    );
    const link = screen.getByRole("link", { name: "Descargar" });
    expect(link.getAttribute("href")).toBe("c.jpg");
    expect(link.hasAttribute("download")).toBe(true);
    expect(screen.getByRole("button", { name: "Cerrar" })).toBeDefined();
  });
});
