import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NebulaProvider } from "../../../provider/nebula-provider.js";
import { Button } from "../Button.js";

function Paint(node: React.ReactElement) {
  return render(<NebulaProvider storage={null}>{node}</NebulaProvider>);
}

/**
 * El color de un accionable tiene que salir de la matriz del tema, no de resolverlo en JavaScript
 * (ADR-150 §2). Lo que se comprueba es que al `style` viaje una REFERENCIA y no un valor: eso es lo
 * que hace que lo resuelva el navegador contra la clase activa, en el primer pintado, sin esperar a
 * que el provider adopte el tema.
 *
 * Antes de esto el degradado tardaba en mostrar su color real: el servidor lo horneaba con el tema
 * por defecto y el cliente lo recalculaba al hidratar.
 */
describe("el color sale de la matriz, no de JavaScript (ADR-150)", () => {
  it("una escala semantica viaja como var(), no como color", () => {
    const { container } = Paint(<Button variant="gradient">x</Button>);
    const style = (container.querySelector("button") as HTMLElement).getAttribute("style") ?? "";

    expect(style).toContain("var(--variant-gradient-primary-background");
    expect(style).not.toMatch(/linear-gradient\(/);
  });

  it("cada variante apunta a su propia fila de la matriz", () => {
    for (const variant of ["filled", "outline", "light", "ghost", "glow", "glass"] as const) {
      const { container } = Paint(<Button variant={variant}>x</Button>);
      const style = (container.querySelector("button") as HTMLElement).getAttribute("style") ?? "";
      expect(style).toContain(`var(--variant-${variant}-primary-background`);
    }
  });

  it("pedir un nivel de cristal distinto al de la receta si cae a JavaScript", () => {
    // El nivel por defecto lo pone el TEMA (`variantMap.glass.glass`), no el componente, asi que el
    // caso normal esta en la matriz. Pedir otro a mano es salirse de lo precalculado, y entonces se
    // resuelve aqui. Es la unica de las ocho recetas que consume cristal.
    const { container } = Paint(
      <Button variant="glass" glass="strong">
        x
      </Button>,
    );
    const style = (container.querySelector("button") as HTMLElement).getAttribute("style") ?? "";

    expect(style).toContain("var(--glass-strong-background");
    expect(style).not.toContain("var(--variant-glass-primary-background");
  });

  it("un color suelto sigue resolviendose en JavaScript: la matriz no puede saberlo", () => {
    const { container } = Paint(
      <Button variant="filled" color="#ff0066">
        x
      </Button>,
    );
    const style = (container.querySelector("button") as HTMLElement).getAttribute("style") ?? "";

    expect(style).toContain("#ff0066");
    expect(style).not.toContain("var(--variant-filled");
  });

  it("un degradado escrito en la prop tambien: es el caso infinito de ADR-150 §3", () => {
    const { container } = Paint(
      <Button variant="gradient" gradient={{ from: "#000", to: "#fff" }}>
        x
      </Button>,
    );
    const style = (container.querySelector("button") as HTMLElement).getAttribute("style") ?? "";

    expect(style).toContain("linear-gradient(");
    expect(style).not.toContain("var(--variant-gradient");
  });
});
