import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Carousel } from "../Carousel.js";
import { CAROUSEL_LABELS } from "../labels.js";

afterEach(cleanup);

const SLIDES = ["uno", "dos", "tres"];

function Basic(props: Partial<Parameters<typeof Carousel<string>>[0]> = {}) {
  return (
    <Carousel
      items={SLIDES}
      getKey={(item) => item}
      renderItem={(item) => <span>{item}</span>}
      {...props}
    />
  );
}

describe("Carousel", () => {
  it("se anuncia como carrusel con su etiqueta por defecto", () => {
    render(<Basic />);
    const region = screen.getByRole("region", { name: CAROUSEL_LABELS.region });
    expect(region.getAttribute("aria-roledescription")).toBe("carousel");
  });

  it("acepta una etiqueta propia", () => {
    render(<Basic label="Novedades" />);
    expect(screen.getByRole("region", { name: "Novedades" })).toBeDefined();
  });

  it("marca cada slide con su posición", () => {
    render(<Basic />);
    const slides = screen.getAllByRole("group");
    expect(slides).toHaveLength(3);
    expect(slides[0]?.getAttribute("aria-label")).toBe("1 de 3");
    expect(slides[0]?.getAttribute("aria-roledescription")).toBe("slide");
  });

  it("usa el contrato de items de GridList: items + getKey + renderItem", () => {
    const render_item = vi.fn((item: string) => <span>{item}</span>);
    render(<Basic renderItem={render_item} />);
    const seen = new Set(render_item.mock.calls.map(([item]) => item));
    expect([...seen]).toStrictEqual(SLIDES);
    expect(screen.getByText("dos")).toBeDefined();
  });

  it("monta los controles con nombre accesible", () => {
    render(<Basic />);
    expect(screen.getByRole("button", { name: CAROUSEL_LABELS.previous }).tagName).toBe("BUTTON");
    expect(screen.getByRole("button", { name: CAROUSEL_LABELS.next }).tagName).toBe("BUTTON");
  });

  it("puede prescindir de los controles", () => {
    render(<Basic withControls={false} />);
    expect(screen.queryByRole("button", { name: CAROUSEL_LABELS.next })).toBeNull();
  });

  it("pinta un indicador por slide y marca el activo", () => {
    render(<Basic withIndicators />);
    const dots = screen.getAllByRole("button", { name: /Ir a la diapositiva/ });
    expect(dots).toHaveLength(3);
    expect(dots[0]?.getAttribute("aria-current")).toBe("true");
  });

  it("acepta etiquetas propias", () => {
    render(<Basic labels={{ next: "Avanzar" }} />);
    expect(screen.getByRole("button", { name: "Avanzar" })).toBeDefined();
  });

  it("muestra el vacío cuando no hay items", () => {
    render(
      <Carousel
        items={[]}
        getKey={(item: string) => item}
        renderItem={(item: string) => <span>{item}</span>}
        empty="Sin contenido"
      />,
    );
    expect(screen.getByText("Sin contenido")).toBeDefined();
  });

  it("el eje vertical cambia el contenedor, no el contrato", () => {
    render(<Basic axis="y" />);
    const track = screen.getAllByRole("group")[0]?.parentElement;
    expect(track?.getAttribute("data-axis")).toBe("y");
  });

  it("no hornea el tamaño de slide en la clase: va en una var", () => {
    render(<Basic slideSize="50%" />);
    const style = screen.getByRole("region").getAttribute("style") ?? "";
    expect(style).toMatch(/50%/);
  });
});
