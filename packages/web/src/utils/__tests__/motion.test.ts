import { Themes } from "@stellaria/nebula-themes";
import type { NebulaTheme, SpringConfig } from "@stellaria/nebula-tokens";
import { describe, expect, it } from "vitest";

import * as css from "../../styles/motion.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import {
  Fade,
  MotionOff,
  ScrollSpring,
  Spring,
  Stagger,
  StaggerDelay,
  SurfaceTransition,
  ToBezier,
  Tween,
  type MotionContext,
} from "../motion.js";

const theme = Themes.nebula.dark;
const live: MotionContext = { theme, reduced: false };
const off: MotionContext = { theme, reduced: true };

const SPRING_NAMES = ["gentle", "default", "snappy"] as const;

function WithTier(tier: NebulaTheme["motion"]["tier"]): MotionContext {
  return { theme: { ...theme, motion: { ...theme.motion, tier } }, reduced: false };
}

function Ratio(config: SpringConfig): number {
  return config.damping / (2 * Math.sqrt(config.stiffness * config.mass));
}

function Frequency(config: SpringConfig): number {
  return Math.sqrt(config.stiffness / config.mass);
}

describe("composiciones CSS", () => {
  it("apuntan a las vars del tema y no a valores horneados", () => {
    for (const composition of [css.interaction, css.layout, css.overlay, css.value]) {
      expect(composition.transitionDuration).toMatch(/^var\(--/);
      expect(composition.transitionTimingFunction).toMatch(/^var\(--/);
    }
    expect(css.interaction.transitionDuration).toBe(vars.motion.duration.fast);
    expect(css.interaction.transitionTimingFunction).toBe(vars.motion.easing.standard);
  });

  it("interaction no transiciona transform, que es del dominio de motion", () => {
    expect(css.interaction.transitionProperty).not.toContain("transform");
    expect(css.layout.transitionProperty).toContain("transform");
  });

  it("el idioma de reduced-motion es único y no usa el truco de 0.01ms", () => {
    expect(css.still).toEqual({ transitionProperty: "none", animationName: "none" });
    expect(css.reduced_motion["@media"][css.reduced_media]).toEqual(css.still);
  });
});

describe("MotionOff", () => {
  it("se apaga con prefers-reduced-motion y con el tier minimal", () => {
    expect(MotionOff(live)).toBe(false);
    expect(MotionOff(off)).toBe(true);
    expect(MotionOff(WithTier("minimal"))).toBe(true);
    expect(MotionOff(WithTier("expressive"))).toBe(false);
  });
});

describe("ToBezier", () => {
  it("traduce la cadena del tema a la tupla que motion acepta", () => {
    expect(ToBezier("cubic-bezier(0.2, 0, 0, 1)")).toEqual([0.2, 0, 0, 1]);
    expect(ToBezier("cubic-bezier(0.34, 1.56, 0.64, 1)")).toEqual([0.34, 1.56, 0.64, 1]);
  });

  it("devuelve undefined ante una curva no parseable en vez de romper", () => {
    expect(ToBezier("ease-in-out")).toBeUndefined();
    expect(ToBezier("cubic-bezier(a, b, c, d)")).toBeUndefined();
  });
});

describe("Spring", () => {
  it("traduce el spring del tema y saca la opacidad del muelle", () => {
    expect(Spring("snappy", live)).toEqual({
      type: "spring",
      stiffness: theme.motion.spring.snappy.stiffness,
      damping: theme.motion.spring.snappy.damping,
      mass: theme.motion.spring.snappy.mass,
      opacity: {
        inherit: true,
        type: "tween",
        duration: theme.motion.duration.slow / 1000,
        ease: ToBezier(theme.motion.easing.decelerate),
      },
    });
  });

  it("el fade se mezcla sobre la transición padre en vez de reemplazarla", () => {
    expect(Fade(live).inherit).toBe(true);
  });

  it("degrada a duración cero cuando el motion está apagado", () => {
    expect(Spring("default", off)).toEqual({ duration: 0 });
    expect(Spring("default", WithTier("minimal"))).toEqual({ duration: 0 });
  });
});

describe("calibración de los tres springs", () => {
  it("los tres pesan lo mismo: solo rigidez y amortiguación los separan", () => {
    for (const name of SPRING_NAMES) expect(theme.motion.spring[name].mass).toBe(1);
  });

  it("el rebote crece de gentle a snappy, y gentle no rebota", () => {
    const ratios = SPRING_NAMES.map((name) => Ratio(theme.motion.spring[name]));
    const [gentle, base, snappy] = ratios as [number, number, number];

    expect(gentle).toBeGreaterThanOrEqual(1);
    expect(base).toBeLessThan(gentle);
    expect(snappy).toBeLessThan(base);
    expect(snappy).toBeGreaterThan(0.6);
  });

  it("la frecuencia crece de gentle a snappy", () => {
    const frequencies = SPRING_NAMES.map((name) => Frequency(theme.motion.spring[name]));
    const [gentle, base, snappy] = frequencies as [number, number, number];

    expect(base).toBeGreaterThan(gentle);
    expect(snappy).toBeGreaterThan(base);
  });
});

describe("Tween", () => {
  it("convierte la duración del tema a segundos y la curva a tupla", () => {
    expect(Tween("fast", "standard", live)).toEqual({
      type: "tween",
      duration: theme.motion.duration.fast / 1000,
      ease: [0.2, 0, 0, 1],
    });
  });

  it("acepta una duración literal en milisegundos", () => {
    expect(Tween(90, "accelerate", live)).toMatchObject({ duration: 0.09 });
  });

  it("degrada a duración cero cuando el motion está apagado", () => {
    expect(Tween("base", "standard", off)).toEqual({ duration: 0 });
  });
});

describe("SurfaceTransition", () => {
  it("da física distinta por superficie en la entrada", () => {
    expect(SurfaceTransition("popover", "enter", live)).toMatchObject({
      type: "spring",
      stiffness: theme.motion.spring.snappy.stiffness,
    });
    expect(SurfaceTransition("modal", "enter", live)).toMatchObject({
      type: "spring",
      stiffness: theme.motion.spring.default.stiffness,
    });
    expect(SurfaceTransition("toast", "enter", live)).toMatchObject({
      type: "spring",
      stiffness: theme.motion.spring.gentle.stiffness,
    });
  });

  it("el tooltip entra por tween, sin spring", () => {
    expect(SurfaceTransition("tooltip", "enter", live)).toMatchObject({
      type: "tween",
      duration: theme.motion.duration.fast / 1000,
    });
  });

  it("toda salida es un tween acelerado y más corto que su entrada", () => {
    const surfaces = ["tooltip", "popover", "menu", "modal", "drawer", "toast"] as const;
    const accelerate = ToBezier(theme.motion.easing.accelerate);

    for (const surface of surfaces) {
      const exit = SurfaceTransition(surface, "exit", live);
      expect(exit).toMatchObject({ type: "tween", ease: accelerate });

      const reference =
        surface === "tooltip" ? theme.motion.duration.fast : theme.motion.duration.base;
      expect(exit.duration).toBeLessThan(reference / 1000);
    }
  });

  it("se apaga entera cuando el motion está apagado", () => {
    expect(SurfaceTransition("modal", "enter", off)).toEqual({ duration: 0 });
    expect(SurfaceTransition("modal", "exit", off)).toEqual({ duration: 0 });
  });
});

describe("Stagger", () => {
  it("deriva el paso de duration.instant", () => {
    expect(Stagger(live)).toBe(theme.motion.duration.instant / 1000);
  });

  it("el retardo deja de crecer pasados ocho elementos", () => {
    const step = Stagger(live);
    expect(StaggerDelay(0, live)).toBe(0);
    expect(StaggerDelay(3, live)).toBeCloseTo(3 * step);
    expect(StaggerDelay(8, live)).toBeCloseTo(8 * step);
    expect(StaggerDelay(40, live)).toBeCloseTo(8 * step);
  });

  it("se anula entero cuando el motion está apagado", () => {
    expect(Stagger(off)).toBe(0);
    expect(StaggerDelay(5, off)).toBe(0);
    expect(StaggerDelay(5, WithTier("minimal"))).toBe(0);
  });
});

describe("ScrollSpring", () => {
  it("ablanda la frecuencia y amortigua críticamente, venga de donde venga el token", () => {
    for (const name of SPRING_NAMES) {
      const token = theme.motion.spring[name];
      const scroll = ScrollSpring(name, theme);

      expect(Frequency(scroll)).toBeCloseTo(Frequency(token) * Math.sqrt(0.8));
      expect(Ratio(scroll)).toBeCloseTo(1);
      expect(scroll.mass).toBe(token.mass);
    }
  });

  it("ninguno de los tres se pasa de largo, que en una superficie que se scrollea se lee como un temblor", () => {
    for (const name of SPRING_NAMES) {
      expect(Ratio(ScrollSpring(name, theme))).toBeGreaterThanOrEqual(1);
    }
  });

  it("la rigidez es el único mando de velocidad: el orden de los nombres se respeta", () => {
    const [gentle, standard, snappy] = SPRING_NAMES.map((name) => ScrollSpring(name, theme));

    // `zeta*w` es lo que fija el tiempo de asentamiento, y con zeta=1 es la frecuencia sin más.
    expect(Frequency(gentle!)).toBeLessThan(Frequency(standard!));
    expect(Frequency(standard!)).toBeLessThan(Frequency(snappy!));
  });

  it("cada tema decide su propia física de scroll", () => {
    const light = Themes.nebula.light;
    expect(ScrollSpring("default", light).stiffness).toBe(
      light.motion.spring.default.stiffness * 0.8,
    );
  });
});
