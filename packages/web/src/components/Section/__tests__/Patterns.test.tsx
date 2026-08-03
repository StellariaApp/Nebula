import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Hero } from "../../Hero/Hero.js";
import { Feature } from "../../Feature/Feature.js";
import { Main } from "../../Main/Main.js";
import { Section } from "../Section.js";

afterEach(cleanup);

describe("Section", () => {
  it("el título nombra la región y respeta el nivel pedido", () => {
    render(
      <Section title="Movimientos" order={3}>
        contenido
      </Section>,
    );
    const heading = screen.getByRole("heading", { name: "Movimientos", level: 3 });
    expect(heading).toBeDefined();
    expect(screen.getByRole("region", { name: "Movimientos" })).toBeDefined();
  });

  it("sin título cae al aria-label", () => {
    render(<Section aria-label="Resumen">contenido</Section>);
    expect(screen.getByRole("region", { name: "Resumen" })).toBeDefined();
  });

  it("el error sustituye al contenido y se anuncia", () => {
    render(
      <Section title="Movimientos" error="No se pudo cargar">
        contenido
      </Section>,
    );
    expect(screen.getByRole("alert").textContent).toContain("No se pudo cargar");
    expect(screen.queryByText("contenido")).toBeNull();
  });

  it("isEmpty pinta el vacío en lugar del contenido", () => {
    render(
      <Section title="Movimientos" isEmpty empty={<p>Sin datos</p>}>
        contenido
      </Section>,
    );
    expect(screen.getByText("Sin datos")).toBeDefined();
    expect(screen.queryByText("contenido")).toBeNull();
  });

  it("loading superpone sin retirar el contenido", () => {
    render(
      <Section title="Movimientos" loading>
        contenido
      </Section>,
    );
    expect(screen.getByText("contenido")).toBeDefined();
    expect(screen.getByRole("status")).toBeDefined();
  });
});

describe("Main", () => {
  it("expone un landmark main enfocable por programa", () => {
    render(<Main>contenido</Main>);
    const main = screen.getByRole("main");
    expect(main.getAttribute("tabindex")).toBe("-1");
  });

  it("el skip-link apunta al contenido", () => {
    render(
      <Main withSkipLink id="contenido-principal">
        cuerpo
      </Main>,
    );
    const skip = screen.getByRole("link", { name: "Saltar al contenido" });
    expect(skip.getAttribute("href")).toBe("#contenido-principal");
    expect(screen.getByRole("main").getAttribute("id")).toBe("contenido-principal");
  });

  it("sin withSkipLink no hay enlace", () => {
    render(<Main>cuerpo</Main>);
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("el fondo es decorativo", () => {
    render(<Main background={<span>adorno</span>}>cuerpo</Main>);
    expect(screen.getByText("adorno").closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("sin contentWidth ni spacing el main no cambia respecto a hoy", () => {
    render(<Main>cuerpo</Main>);
    const main = screen.getByRole("main");

    expect(main.getAttribute("data-railed")).toBeNull();
    expect(main.getAttribute("data-spacing")).toBeNull();
    expect(main.getAttribute("style") ?? "").toBe("");
  });

  it("contentWidth acota el contenido y viaja como var", () => {
    render(<Main contentWidth={1180}>cuerpo</Main>);
    const main = screen.getByRole("main");

    expect(main.getAttribute("data-railed")).toBe("true");
    expect(main.getAttribute("style") ?? "").toContain("1180px");
    expect(main.getAttribute("style") ?? "").not.toContain("max-width");
  });

  it("spacing acepta un token de espaciado y lo resuelve a var del contrato", () => {
    render(<Main spacing="xxl">cuerpo</Main>);
    const main = screen.getByRole("main");

    expect(main.getAttribute("data-spacing")).toBe("true");
    expect(main.getAttribute("style") ?? "").toContain("var(--");
  });

  it("el carril va en el main, no en la raíz: el fondo sigue a sangre", () => {
    const { container } = render(
      <Main contentWidth={960} background={<span>adorno</span>}>
        cuerpo
      </Main>,
    );
    const backdrop = screen.getByText("adorno").closest("[aria-hidden='true']");

    expect(container.firstElementChild?.getAttribute("data-railed")).toBeNull();
    expect(backdrop?.getAttribute("data-railed")).toBeNull();
    expect(screen.getByRole("main").getAttribute("data-railed")).toBe("true");
  });
});

describe("Hero", () => {
  it("pinta la jerarquía completa de textos", () => {
    render(
      <Hero
        hiper="Novedad"
        title="Concilia en un clic"
        subtitle="Sin hojas de cálculo"
        description="Conecta tu banco."
      />,
    );
    expect(screen.getByText("Novedad")).toBeDefined();
    expect(screen.getByText("Concilia en un clic")).toBeDefined();
    expect(screen.getByText("Sin hojas de cálculo")).toBeDefined();
    expect(screen.getByText("Conecta tu banco.")).toBeDefined();
  });

  it("cada variante del subconjunto resuelve una receta distinta", () => {
    const seen = new Set<string>();
    for (const variant of ["filled", "outline", "light", "glass"] as const) {
      const view = render(<Hero title="X" variant={variant} color="primary" />);
      seen.add(screen.getByText("X").closest("section")?.getAttribute("style") ?? "");
      view.unmount();
    }
    expect(seen.size).toBe(4);
  });

  it('el color por defecto es "transparent": la banda no pinta fondo propio', () => {
    render(<Hero title="X" />);
    const inline = screen.getByText("X").closest("section")?.getAttribute("style") ?? "";
    const bg = /--bg[^:]*:\s*([^;]+);/.exec(inline)?.[1]?.trim();

    expect(bg).toBe("transparent");
  });

  it("la imagen de fondo lleva alt y su velo es decorativo", () => {
    const { container } = render(<Hero title="X" image="hero.png" imageAlt="Equipo trabajando" />);
    expect(screen.getByRole("img", { name: "Equipo trabajando" })).toBeDefined();
    expect(container.querySelector("[aria-hidden='true']")).not.toBeNull();
  });
});

describe("Feature", () => {
  it("pinta título, descripción y enlace", () => {
    render(
      <Feature title="Conciliación" description="Automática" href="/docs" linkText="Ver guía" />,
    );
    expect(screen.getByText("Conciliación")).toBeDefined();
    expect(screen.getByText("Automática")).toBeDefined();
    expect(screen.getByRole("link", { name: "Ver guía" }).getAttribute("href")).toBe("/docs");
  });

  it("sin href no hay enlace", () => {
    render(<Feature title="Conciliación" />);
    expect(screen.queryByRole("link")).toBeNull();
  });
});

describe("Section — la banda de cristal", () => {
  it("sin glass no marca nada", () => {
    render(
      <Section id="s" title="T">
        cuerpo
      </Section>,
    );
    expect(document.getElementById("s")?.getAttribute("data-glass")).toBeNull();
  });

  it("con glass marca la banda, no el carril", () => {
    render(
      <Section id="s" glass title="T">
        cuerpo
      </Section>,
    );
    const band = document.getElementById("s");

    expect(band?.getAttribute("data-glass")).toBe("true");
    expect(band?.querySelector(":scope > div")?.getAttribute("data-glass")).toBeNull();
  });

  it("el carril sigue llevando el divisor, para que no cruce la banda entera", () => {
    render(
      <Section id="s" divided glass title="T">
        cuerpo
      </Section>,
    );
    const band = document.getElementById("s");

    expect(band?.getAttribute("data-divided")).toBeNull();
    expect(band?.querySelector(":scope > div")?.getAttribute("data-divided")).toBe("true");
  });

  it("el ancho de carril viaja como var en la banda y el contenido cuelga del carril", () => {
    render(
      <Section id="s" contentWidth={900} title="Capacidades">
        cuerpo
      </Section>,
    );
    const band = document.getElementById("s");
    const rail = band?.querySelector(":scope > div");

    expect(band?.getAttribute("style") ?? "").toContain("900px");
    expect(rail?.textContent).toContain("cuerpo");
  });
});
