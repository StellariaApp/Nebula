import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { ColorSwatch } from "../../ColorSwatch/ColorSwatch.js";
import { Indicator } from "../../Indicator/Indicator.js";
import { Kbd } from "../../Kbd/Kbd.js";
import { Spoiler } from "../../Spoiler/Spoiler.js";
import { ThemeIcon } from "../../ThemeIcon/ThemeIcon.js";
import { Tag } from "../Tag.js";

afterEach(cleanup);

describe("Tag", () => {
  it("pinta la etiqueta sin botón cuando no es removible", () => {
    render(<Tag>Diseño</Tag>);
    expect(screen.getByText("Diseño")).toBeDefined();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("el botón de quitar nombra la etiqueta que quita", async () => {
    const on_remove = vi.fn();
    render(<Tag onRemove={on_remove}>Motion</Tag>);
    const remove = screen.getByRole("button", { name: "Quitar: Motion" });
    await userEvent.click(remove);
    expect(on_remove).toHaveBeenCalledTimes(1);
  });

  it("cada variante del subconjunto resuelve una receta distinta", () => {
    const seen = new Set<string>();
    for (const variant of ["filled", "outline", "light", "ghost"] as const) {
      const view = render(<Tag variant={variant}>X</Tag>);
      seen.add(screen.getByText("X").parentElement?.getAttribute("style") ?? "");
      view.unmount();
    }
    expect(seen.size).toBe(4);
  });
});

describe("ThemeIcon", () => {
  it("es decorativo por defecto y nombrado cuando lleva label", () => {
    const { unmount } = render(<ThemeIcon data-testid="i">★</ThemeIcon>);
    expect(screen.queryByRole("img")).toBeNull();
    unmount();
    render(<ThemeIcon label="Favorito">★</ThemeIcon>);
    expect(screen.getByRole("img", { name: "Favorito" })).toBeDefined();
  });
});

describe("Kbd", () => {
  it("usa el elemento semántico kbd", () => {
    render(<Kbd>Ctrl</Kbd>);
    expect(screen.getByText("Ctrl").tagName).toBe("KBD");
  });
});

describe("ColorSwatch", () => {
  it("acepta un hex crudo y un rol del tema", () => {
    const { unmount } = render(<ColorSwatch color="#ff0000" label="Rojo" />);
    expect(screen.getByRole("img", { name: "Rojo" }).getAttribute("style")).toMatch(/#ff0000/);
    unmount();
    render(<ColorSwatch color="primary" label="Marca" />);
    expect(screen.getByRole("img", { name: "Marca" })).toBeDefined();
  });

  it("es un botón cuando se puede pulsar", async () => {
    const on_press = vi.fn();
    render(<ColorSwatch color="#00ff00" label="Verde" onPress={on_press} />);
    await userEvent.click(screen.getByRole("button", { name: "Verde" }));
    expect(on_press).toHaveBeenCalledTimes(1);
  });
});

describe("Indicator", () => {
  it("recorta el contador en max", () => {
    render(
      <Indicator count={150} max={99}>
        <span>Bandeja</span>
      </Indicator>,
    );
    expect(screen.getByText("99+")).toBeDefined();
  });

  it("oculta el cero salvo que se pida", () => {
    const { unmount } = render(
      <Indicator count={0}>
        <span>A</span>
      </Indicator>,
    );
    expect(screen.queryByText("0")).toBeNull();
    unmount();
    render(
      <Indicator count={0} showZero>
        <span>A</span>
      </Indicator>,
    );
    expect(screen.getByText("0")).toBeDefined();
  });

  it("el punto es decorativo y el anuncio va aparte", () => {
    render(
      <Indicator count={3} announce="3 mensajes sin leer">
        <span>Bandeja</span>
      </Indicator>,
    );
    expect(screen.getByText("3").getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByText("3 mensajes sin leer")).toBeDefined();
  });

  it("disabled lo apaga", () => {
    render(
      <Indicator count={5} disabled>
        <span>A</span>
      </Indicator>,
    );
    expect(screen.queryByText("5")).toBeNull();
  });
});

describe("Spoiler", () => {
  it("sin desbordamiento no ofrece el conmutador", () => {
    render(<Spoiler maxHeight={9999}>Texto corto</Spoiler>);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("Texto corto")).toBeDefined();
  });
});
