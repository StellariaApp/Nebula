import { act } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { NebulaTheme } from "@stellaria/nebula-tokens";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import { MotionAt } from "../../../__tests__/theme-tweaks.js";
import { NebulaProvider } from "../../../provider/nebula-provider.js";
import { Reveal } from "../Reveal.js";
import { Section } from "../../Section/Section.js";

let observed: FakeObserver[] = [];

class FakeObserver {
  callback: IntersectionObserverCallback;
  options: IntersectionObserverInit | undefined;
  disconnected = false;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options;
    observed.push(this);
  }

  observe(): void {
    return undefined;
  }

  unobserve(): void {
    return undefined;
  }

  disconnect(): void {
    this.disconnected = true;
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  Enter(): void {
    this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this as never);
  }

  Leave(): void {
    this.callback([{ isIntersecting: false } as IntersectionObserverEntry], this as never);
  }
}

function RenderIn(ui: ReactNode, theme: NebulaTheme) {
  return render(
    <NebulaProvider defaultTheme={theme} storage={null}>
      {ui}
    </NebulaProvider>,
  );
}

beforeEach(() => {
  observed = [];
  vi.stubGlobal("IntersectionObserver", FakeObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Reveal — la regla de visibilidad", () => {
  it("rinde el contenido, no lo esconde", () => {
    render(
      <Reveal>
        <p>contenido</p>
      </Reveal>,
    );
    expect(screen.getByText("contenido")).toBeDefined();
  });

  it("sin IntersectionObserver no arma el mecanismo y el contenido queda visible", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { container } = render(
      <Reveal>
        <p>contenido</p>
      </Reveal>,
    );

    expect(screen.getByText("contenido")).toBeDefined();
    /*
     * Desde que el estado oculto vive en la hoja, "no armar" ya no puede ser "no emitir nada": el
     * servidor sirvio el elemento oculto, asi que sin observador hay que DESTAPARLO explicitamente.
     * `shown` es justo eso, y la regla `[data-reveal='shown']` lo devuelve a opacidad uno.
     */
    expect(container.querySelector("[data-reveal='hidden']")).toBeNull();
  });

  it("con reduced-motion no arma el mecanismo ni suscribe nada", () => {
    const { container } = RenderIn(
      <Reveal>
        <p>contenido</p>
      </Reveal>,
      MotionAt("minimal"),
    );

    expect(screen.getByText("contenido")).toBeDefined();
    expect(container.querySelector("[data-reveal]")).toBeNull();
    expect(observed).toHaveLength(0);
  });

  it("armado arranca oculto y pasa a mostrado al entrar", () => {
    const { container } = render(
      <Reveal>
        <p>contenido</p>
      </Reveal>,
    );
    const node = container.querySelector("[data-reveal]");

    expect(node?.getAttribute("data-reveal")).toBe("hidden");
    expect(observed).toHaveLength(1);

    act(() => {
      observed[0]?.Enter();
    });
    expect(container.querySelector("[data-reveal]")?.getAttribute("data-reveal")).toBe("shown");
  });
});

describe("Reveal — once", () => {
  it("por defecto no vuelve a esconderse al salir", () => {
    const { container } = render(
      <Reveal>
        <p>contenido</p>
      </Reveal>,
    );

    act(() => {
      observed[0]?.Enter();
    });
    act(() => {
      observed[0]?.Leave();
    });
    expect(container.querySelector("[data-reveal]")?.getAttribute("data-reveal")).toBe("shown");
  });

  it("once=false vuelve a esconderse al salir", () => {
    const { container } = render(
      <Reveal once={false}>
        <p>contenido</p>
      </Reveal>,
    );

    act(() => {
      observed[0]?.Enter();
    });
    expect(container.querySelector("[data-reveal]")?.getAttribute("data-reveal")).toBe("shown");

    act(() => {
      observed[0]?.Leave();
    });
    expect(container.querySelector("[data-reveal]")?.getAttribute("data-reveal")).toBe("hidden");
  });
});

describe("Reveal — configuración del observer", () => {
  it("amount viaja como threshold", () => {
    render(
      <Reveal amount={0.75}>
        <p>contenido</p>
      </Reveal>,
    );
    expect(observed[0]?.options?.threshold).toBe(0.75);
  });

  it("rootMargin se pasa tal cual y no colisiona con la style prop margin", () => {
    render(
      <Reveal rootMargin="0px 0px -120px 0px" m="lg">
        <p>contenido</p>
      </Reveal>,
    );
    expect(observed[0]?.options?.rootMargin).toBe("0px 0px -120px 0px");
  });

  it("desuscribe al desmontar", () => {
    const { unmount } = render(
      <Reveal>
        <p>contenido</p>
      </Reveal>,
    );
    unmount();
    expect(observed[0]?.disconnected).toBe(true);
  });

  it("aplica style props y className al mismo nodo", () => {
    const { container } = render(
      <Reveal className="propia" mt="lg">
        <p>contenido</p>
      </Reveal>,
    );
    const node = container.querySelector(".propia");

    expect(node).not.toBeNull();
    expect(node?.contains(screen.getByText("contenido"))).toBe(true);
  });
});

describe("Section reveal", () => {
  it("sin reveal no envuelve ni arma nada", () => {
    const { container } = render(<Section title="Capacidades">cuerpo</Section>);

    expect(container.querySelector("[data-reveal]")).toBeNull();
    expect(observed).toHaveLength(0);
    expect(screen.getByRole("heading", { name: "Capacidades" })).toBeDefined();
  });

  it("con reveal anima el propio section, sin envoltorio de por medio", () => {
    const { container } = render(
      <Section reveal title="Capacidades">
        cuerpo
      </Section>,
    );
    const node = container.querySelector("[data-reveal]");

    expect(node?.tagName).toBe("SECTION");
    expect(screen.getByRole("heading", { name: "Capacidades" })).toBeDefined();
    expect(screen.getByText("cuerpo")).toBeDefined();
  });

  it("las style props y className siguen yendo al section", () => {
    const { container } = render(
      <Section reveal className="propia" title="Capacidades">
        cuerpo
      </Section>,
    );
    const node = container.querySelector(".propia");

    expect(node?.tagName).toBe("SECTION");
    expect(node?.getAttribute("data-reveal")).toBe("hidden");
  });

  it("id llega al section: es lo que ancla el scroll-spy de Nav", () => {
    render(
      <Section id="capacidades" title="Capacidades">
        cuerpo
      </Section>,
    );
    expect(document.getElementById("capacidades")?.tagName).toBe("SECTION");
  });

  it("el carril vale 1180 por defecto y viaja como var", () => {
    const { container } = render(<Section className="propia">cuerpo</Section>);
    const inline = container.querySelector(".propia")?.getAttribute("style") ?? "";

    expect(inline).toContain("1180px");
    expect(inline).not.toContain("max-width");
  });

  it('contentWidth="none" devuelve la seccion al ancho de su hueco', () => {
    const { container } = render(
      <Section className="propia" contentWidth="none">
        cuerpo
      </Section>,
    );
    const inline = container.querySelector(".propia")?.getAttribute("style") ?? "";

    expect(inline).toContain("none");
    expect(inline).not.toContain("1180px");
  });
});

describe("el estado oculto se pinta, no solo se anuncia", () => {
  /*
   * La opacidad ya no se escribe en linea: la pone una regla de clase sobre `[data-reveal]`, porque
   * la entrada dejo de ser una animacion de JavaScript y paso a ser una transicion de CSS. jsdom no
   * carga esa hoja, asi que lo que se comprueba es que el nodo lleve LAS TRES cosas que la hacen
   * pintar — la clase, el atributo de estado y la variable con el transform de partida—, que es lo
   * mismo que decia la prueba anterior expresado donde ahora vive.
   */
  it("Reveal armado sale con clase, estado oculto y el transform de partida", () => {
    const { container } = render(
      <Reveal>
        <p>contenido</p>
      </Reveal>,
    );
    const node = container.querySelector<HTMLElement>("[data-reveal]");

    expect(node?.getAttribute("data-reveal")).toBe("hidden");
    expect(node?.className).not.toBe("");
    expect(node?.getAttribute("style")).toContain("translate3d");
  });

  it("y pasa a mostrado al entrar", async () => {
    const { container } = render(
      <Reveal>
        <p>contenido</p>
      </Reveal>,
    );

    act(() => {
      observed[0]?.Enter();
    });
    await waitFor(() => {
      expect(container.querySelector<HTMLElement>("[data-reveal]")?.getAttribute("data-reveal")).toBe(
        "shown",
      );
    });
  });

  it("no anima con JavaScript: la curva del muelle viaja como easing de CSS", () => {
    const { container } = render(
      <Reveal>
        <p>contenido</p>
      </Reveal>,
    );
    const style = container.querySelector<HTMLElement>("[data-reveal]")?.getAttribute("style");

    expect(style).toContain("linear(");
    expect(style).toContain("ms");
  });

  it("`distance` mueve el recorrido, que antes estaba clavado en el preset", () => {
    const { container } = render(
      <Reveal distance={34}>
        <p>contenido</p>
      </Reveal>,
    );

    expect(container.querySelector<HTMLElement>("[data-reveal]")?.getAttribute("style")).toContain(
      "34px",
    );
  });

  it("Section reveal pinta el mismo estado oculto sobre su propio section", () => {
    render(
      <Section id="capacidades" reveal title="Capacidades">
        cuerpo
      </Section>,
    );
    const node = document.getElementById("capacidades");

    expect(node?.tagName).toBe("SECTION");
    expect(node?.getAttribute("data-reveal")).toBe("hidden");
    expect(node?.getAttribute("style")).toContain("translate3d");
  });

  it("con `revealTarget=\"content\"` la banda se queda quieta y entra el rail", () => {
    render(
      <Section id="capacidades" reveal revealTarget="content" title="Capacidades">
        cuerpo
      </Section>,
    );
    const band = document.getElementById("capacidades");

    expect(band?.tagName).toBe("SECTION");
    expect(band?.hasAttribute("data-reveal")).toBe(false);
    expect(band?.querySelector("[data-reveal]")).not.toBeNull();
  });
});

describe("oculto primero, y la comparacion despues de montar", () => {
  it("el HTML del servidor sale ya oculto, este donde este el elemento", () => {
    const html = renderToStaticMarkup(
      <NebulaProvider>
        <Reveal>
          <p>contenido</p>
        </Reveal>
      </NebulaProvider>,
    );

    // La clase y el transform de partida tienen que venir del servidor: si llegaran al hidratar,
    // habria un fotograma con el contenido en su sitio antes de esconderse.
    expect(html).toContain('data-reveal="hidden"');
    expect(html).toContain("translate3d");
  });

  it("pasa a mostrado cuando el observador dice que entro, no antes", async () => {
    const { container } = render(
      <Reveal>
        <p>contenido</p>
      </Reveal>,
    );

    expect(container.querySelector("[data-reveal]")?.getAttribute("data-reveal")).toBe("hidden");

    act(() => {
      observed[0]?.Enter();
    });
    await waitFor(() => {
      expect(container.querySelector("[data-reveal]")?.getAttribute("data-reveal")).toBe("shown");
    });
  });

  it("con `settled` nace visible y solo se anima lo que entra despues", () => {
    const html = renderToStaticMarkup(
      <NebulaProvider>
        <Reveal initial="settled">
          <p>contenido</p>
        </Reveal>
      </NebulaProvider>,
    );

    expect(html).toContain("contenido");
    expect(html).not.toContain("data-reveal");
  });
});
