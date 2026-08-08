import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import type { NebulaTheme } from "@stellaria/nebula-tokens";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { MotionAt } from "../../../__tests__/theme-tweaks.js";
import { NebulaProvider } from "../../../provider/nebula-provider.js";
import type { OfficialThemeName } from "../../../theme/themes.css.js";
import { StarField } from "../StarField.js";
import { BuildStars } from "../useStarField.js";

afterEach(cleanup);

function RenderIn(ui: ReactNode, theme: OfficialThemeName | NebulaTheme) {
  return render(
    <NebulaProvider defaultTheme={theme} storage={null}>
      {ui}
    </NebulaProvider>,
  );
}

describe("StarField — geometría", () => {
  it("es determinista para la misma semilla", () => {
    expect(BuildStars("md", 1, 5)).toStrictEqual(BuildStars("md", 1, 5));
  });

  it("otra semilla mueve el campo", () => {
    expect(BuildStars("md", 1, 5)).not.toStrictEqual(BuildStars("md", 7, 5));
  });

  it("las cinco densidades tienen recuentos crecientes", () => {
    const counts = (["xs", "sm", "md", "lg", "xl"] as const).map(
      (density) => BuildStars(density, 1, 5).length,
    );
    expect(counts).toStrictEqual([12, 20, 32, 48, 72]);
  });

  it("no genera estrellas fuera del contenedor", () => {
    for (const star of BuildStars("xl", 3, 5)) {
      expect(star.left).toBeGreaterThanOrEqual(0);
      expect(star.left).toBeLessThanOrEqual(98);
      expect(star.top).toBeGreaterThanOrEqual(0);
      expect(star.top).toBeLessThanOrEqual(96);
    }
  });
});

describe("StarField", () => {
  it("es decorativo y no captura puntero", () => {
    render(<StarField data-testid="sf" />);
    expect(screen.getByTestId("sf").getAttribute("aria-hidden")).toBe("true");
  });

  it("monta la retícula y el campo de estrellas", () => {
    render(<StarField data-testid="sf" />);
    const node = screen.getByTestId("sf");
    expect(node.querySelectorAll("i")).toHaveLength(32);
    expect(node.children).toHaveLength(2);
  });

  it("puede prescindir de la retícula", () => {
    render(<StarField grid={false} data-testid="sf" />);
    expect(screen.getByTestId("sf").children).toHaveLength(1);
  });

  it("marca una de cada accentEvery estrellas", () => {
    render(<StarField accentEvery={4} data-testid="sf" />);
    const accents = screen.getByTestId("sf").querySelectorAll("i[data-accent='true']");
    expect(accents).toHaveLength(8);
  });

  it("parpadea cuando el tier del tema lo permite", () => {
    render(<StarField data-testid="sf" />);
    expect(screen.getByTestId("sf").getAttribute("data-twinkle")).toBe("true");
  });

  it("se queda quieto con motion.tier minimal", () => {
    RenderIn(<StarField data-testid="sf" />, MotionAt("minimal"));
    const node = screen.getByTestId("sf");
    expect(node.getAttribute("data-twinkle")).toBe("false");
    expect(node.querySelectorAll("i[data-twinkle='false']")).toHaveLength(32);
  });

  it("se puede apagar el parpadeo por prop sin tocar el tema", () => {
    render(<StarField twinkle={false} data-testid="sf" />);
    expect(screen.getByTestId("sf").getAttribute("data-twinkle")).toBe("false");
  });

  it("deriva el retardo de parpadeo de los tokens de motion, no de milisegundos", () => {
    render(<StarField data-testid="sf" />);
    const star = screen.getByTestId("sf").querySelector("i");
    const style = star?.getAttribute("style") ?? "";
    expect(style).toMatch(/animation-delay:\s*calc\(var\(--motion-duration-expressive/);
    expect(style).not.toMatch(/animation-delay:\s*[\d.]+m?s/);
  });

  it("deja el color al CSS: las vars apuntan a roles, no a valores del tema", () => {
    const style = () => screen.getByTestId("sf").getAttribute("style") ?? "";
    const light = RenderIn(<StarField data-testid="sf" />, "light");
    const from_light = style();
    light.unmount();
    RenderIn(<StarField data-testid="sf" />, "dark");

    expect(from_light).toMatch(/var\(--color-text-primary/);
    expect(from_light).toMatch(/var\(--color-accent-400/);
    expect(from_light).not.toMatch(/#[0-9a-f]{6}/i);
    expect(style()).toBe(from_light);
  });

  it("acepta roles distintos para retícula y acento", () => {
    render(<StarField color="primary.300" accentColor="success.400" data-testid="sf" />);
    const style = screen.getByTestId("sf").getAttribute("style") ?? "";
    expect(style).toMatch(/--color-primary-300/);
    expect(style).toMatch(/--color-semantic-success-400/);
  });

  it("acepta el tamaño de celda y fixed", () => {
    render(<StarField gridSize={40} fixed data-testid="sf" />);
    const node = screen.getByTestId("sf");
    expect(node.getAttribute("data-fixed")).toBe("true");
    expect(node.getAttribute("style") ?? "").toMatch(/40px/);
  });
});
