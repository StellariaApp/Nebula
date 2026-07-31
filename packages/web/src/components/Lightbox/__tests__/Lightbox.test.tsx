import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { LIGHTBOX_LABELS } from "../labels.js";
import { Lightbox } from "../Lightbox.js";
import type { LightboxImage } from "../Lightbox.types.js";

afterEach(cleanup);

const IMAGES: LightboxImage[] = [
  { src: "/a.jpg", alt: "Fachada", caption: "Fachada principal" },
  { src: "/b.jpg", alt: "Salón" },
  { src: "/c.jpg", alt: "Cocina", thumbnail: "/c-thumb.jpg" },
];

function Open(props: Partial<Parameters<typeof Lightbox>[0]> = {}) {
  return <Lightbox images={IMAGES} opened onClose={vi.fn()} {...props} />;
}

describe("Lightbox", () => {
  it("no pinta nada cuando está cerrado", () => {
    render(<Lightbox images={IMAGES} opened={false} onClose={vi.fn()} />);
    expect(screen.queryByAltText("Fachada")).toBeNull();
  });

  it("muestra la imagen del índice inicial con su texto alternativo", () => {
    render(<Open defaultIndex={1} />);
    expect(screen.getByAltText("Salón")).toBeDefined();
  });

  it("lleva contador de posición", () => {
    render(<Open />);
    expect(screen.getByText("1 de 3")).toBeDefined();
  });

  it("pinta el pie cuando la imagen lo trae", () => {
    render(<Open />);
    expect(screen.getByText("Fachada principal")).toBeDefined();
  });

  it("los controles de navegación tienen nombre accesible", () => {
    render(<Open />);
    expect(screen.getByRole("button", { name: LIGHTBOX_LABELS.previous }).tagName).toBe("BUTTON");
    expect(screen.getByRole("button", { name: LIGHTBOX_LABELS.next }).tagName).toBe("BUTTON");
  });

  it("desactiva la navegación con una sola imagen", () => {
    render(<Open images={[IMAGES[0] as LightboxImage]} />);
    const next = screen.getByRole("button", { name: LIGHTBOX_LABELS.next });
    expect(next.getAttribute("data-disabled")).toBe("true");
  });

  it("el escenario es enfocable para poder operar el zoom por teclado", () => {
    render(<Open />);
    const stage = screen.getByRole("group", { name: LIGHTBOX_LABELS.region });
    expect(stage.getAttribute("tabindex")).toBe("0");
  });

  it("arranca sin zoom y anuncia el nivel en una live region", () => {
    render(<Open />);
    const stage = screen.getByRole("group", { name: LIGHTBOX_LABELS.region });
    expect(stage.getAttribute("data-zoomed")).toBe("false");
    expect(screen.getByText("Zoom al 100 %")).toBeDefined();
  });

  it("el zoom sale por transform, no por width/height", () => {
    render(<Open />);
    const style = screen.getByRole("group", { name: LIGHTBOX_LABELS.region }).getAttribute("style") ?? "";
    expect(style).toMatch(/scale\(1\)/);
    expect(style).not.toMatch(/width|height/);
  });

  it("puede prescindir del zoom", () => {
    render(<Open withZoom={false} />);
    expect(screen.queryByRole("button", { name: LIGHTBOX_LABELS.zoomIn })).toBeNull();
  });

  it("el pase de diapositivas es opcional", () => {
    render(<Open />);
    expect(screen.queryByRole("button", { name: LIGHTBOX_LABELS.play })).toBeNull();
  });

  it("monta el control de pase cuando se pide", () => {
    render(<Open withSlideshow />);
    expect(screen.getByRole("button", { name: LIGHTBOX_LABELS.play })).toBeDefined();
  });

  it("la tira de miniaturas usa el thumbnail cuando existe", () => {
    render(<Open withThumbnails />);
    const thumbs = screen.getAllByRole("button", { name: /de 3/ });
    expect(thumbs).toHaveLength(3);
    const sources = thumbs.map((node) => node.querySelector("img")?.getAttribute("src"));
    expect(sources).toStrictEqual(["/a.jpg", "/b.jpg", "/c-thumb.jpg"]);
  });

  it("acepta etiquetas propias", () => {
    render(<Open labels={{ next: "Siguiente foto" }} />);
    expect(screen.getByRole("button", { name: "Siguiente foto" })).toBeDefined();
  });

  it("aguanta una colección vacía sin romper", () => {
    render(<Open images={[]} />);
    expect(screen.getByText("0 de 0")).toBeDefined();
  });
});
