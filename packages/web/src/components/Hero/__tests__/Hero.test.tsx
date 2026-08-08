import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Hero } from "../index.js";

afterEach(cleanup);

describe("Hero", () => {
  it("el titulo nombra la region y respeta el nivel pedido", () => {
    render(<Hero title="Nebula" order={2} />);
    expect(screen.getByRole("heading", { name: "Nebula", level: 2 })).toBeDefined();
    expect(screen.getByRole("region", { name: "Nebula" })).toBeDefined();
  });

  it("con props pinta las acciones al final del cuerpo", () => {
    render(
      <Hero
        title="Nebula"
        description="Una libreria"
        actions={<button type="button">Empezar</button>}
      />,
    );
    const body = screen.getByRole("heading", { name: "Nebula" }).closest("div")?.parentElement;
    const texts = [...(body?.querySelectorAll("h1, p, button") ?? [])].map((n) => n.textContent);
    expect(texts).toEqual(["Nebula", "Una libreria", "Empezar"]);
  });
});

describe("Hero compound", () => {
  it("el titulo como parte sigue nombrando la region y respeta el nivel", () => {
    render(
      <Hero order={2}>
        <Hero.Header>
          <Hero.Title>Nebula</Hero.Title>
        </Hero.Header>
      </Hero>,
    );
    expect(screen.getByRole("heading", { name: "Nebula", level: 2 })).toBeDefined();
    expect(screen.getByRole("region", { name: "Nebula" })).toBeDefined();
  });

  it("las acciones pueden ir sobre la descripcion, que con props no se puede", () => {
    render(
      <Hero>
        <Hero.Header>
          <Hero.Title>Nebula</Hero.Title>
          <Hero.Actions>
            <button type="button">Empezar</button>
          </Hero.Actions>
          <Hero.Description>Una libreria</Hero.Description>
        </Hero.Header>
      </Hero>,
    );
    const header = screen.getByRole("heading", { name: "Nebula" }).parentElement;
    const texts = [...(header?.querySelectorAll("h1, p, button") ?? [])].map((n) => n.textContent);
    expect(texts).toEqual(["Nebula", "Empezar", "Una libreria"]);
  });

  it("las regiones se reparten aunque vengan en cualquier orden", () => {
    render(
      <Hero>
        <Hero.Bottom>pie</Hero.Bottom>
        <Hero.Header>
          <Hero.Title>Nebula</Hero.Title>
        </Hero.Header>
        <Hero.Left>izquierda</Hero.Left>
      </Hero>,
    );
    expect(screen.getByText("izquierda")).toBeDefined();
    expect(screen.getByText("pie")).toBeDefined();
  });

  it("lo que no es una parte se queda en el cuerpo, como hasta ahora", () => {
    render(
      <Hero title="Nebula">
        <p>contenido suelto</p>
      </Hero>,
    );
    expect(screen.getByText("contenido suelto")).toBeDefined();
    expect(screen.getByRole("heading", { name: "Nebula" })).toBeDefined();
  });

  it("una parte fuera de su Hero avisa en vez de fallar en silencio", () => {
    expect(() => render(<Hero.Title>huerfano</Hero.Title>)).toThrow(/debe usarse dentro de <Hero>/);
  });
});
