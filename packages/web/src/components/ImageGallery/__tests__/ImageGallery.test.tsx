import { afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import type { LightboxImage } from "../../Lightbox/Lightbox.types.js";
import { ImageGallery } from "../ImageGallery.js";

afterEach(cleanup);

const IMAGES: LightboxImage[] = [
  { src: "/a.jpg", alt: "Fachada" },
  { src: "/b.jpg", alt: "Salón", thumbnail: "/b-thumb.jpg" },
  { src: "/c.jpg", alt: "Cocina" },
];

describe("ImageGallery", () => {
  it("pinta una lista con un botón por imagen", () => {
    render(<ImageGallery images={IMAGES} label="Galería" />);
    expect(screen.getByRole("list", { name: "Galería" })).toBeDefined();
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("usa el alt como nombre accesible de cada botón", () => {
    render(<ImageGallery images={IMAGES} />);
    expect(screen.getByRole("button", { name: "Fachada" })).toBeDefined();
  });

  it("prefiere el thumbnail cuando la imagen lo trae", () => {
    render(<ImageGallery images={IMAGES} />);
    const sources = screen
      .getAllByRole("button")
      .map((node) => node.querySelector("img")?.getAttribute("src"));
    expect(sources).toStrictEqual(["/a.jpg", "/b-thumb.jpg", "/c.jpg"]);
  });

  it("carga las miniaturas en diferido", () => {
    render(<ImageGallery images={IMAGES} />);
    const first = screen.getAllByRole("button")[0]?.querySelector("img");
    expect(first?.getAttribute("loading")).toBe("lazy");
  });

  it("abre el visor al activar una miniatura", async () => {
    const user = userEvent.setup();
    render(<ImageGallery images={IMAGES} />);
    await user.click(screen.getByRole("button", { name: "Salón" }));
    expect(screen.getByText("2 de 3")).toBeDefined();
  });

  it("avisa de la selección aunque el visor esté desactivado", async () => {
    const user = userEvent.setup();
    const on_select = vi.fn();
    render(<ImageGallery images={IMAGES} withLightbox={false} onSelect={on_select} />);
    await user.click(screen.getByRole("button", { name: "Cocina" }));
    expect(on_select).toHaveBeenCalledWith(2);
    expect(screen.queryByText("3 de 3")).toBeNull();
  });

  it("sin visor ni onSelect las celdas no son interactivas", () => {
    render(<ImageGallery images={IMAGES} withLightbox={false} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.getByAltText("Fachada")).toBeDefined();
  });

  it("muestra el vacío declarado", () => {
    render(<ImageGallery images={[]} empty="Sin imágenes" />);
    expect(screen.getByText("Sin imágenes")).toBeDefined();
  });

  it("la retícula sale de vars, no de clases por número de columnas", () => {
    render(<ImageGallery images={IMAGES} cols={4} label="G" />);
    const style = screen.getByRole("list", { name: "G" }).getAttribute("style") ?? "";
    expect(style).toMatch(/repeat\(4, minmax\(0, 1fr\)\)/);
  });

  it("por defecto la retícula es fluida por ancho mínimo", () => {
    render(<ImageGallery images={IMAGES} minColWidth={200} label="G" />);
    const style = screen.getByRole("list", { name: "G" }).getAttribute("style") ?? "";
    expect(style).toMatch(/auto-fill, minmax\(200px, 1fr\)/);
  });
});
