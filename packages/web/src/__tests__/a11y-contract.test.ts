import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const COMPONENTS = resolve("src/components");

const ESSENTIALS = [
  "Alert",
  "Anchor",
  "Avatar",
  "Badge",
  "Button",
  "Card",
  "Checkbox",
  "Dialog",
  "FieldError",
  "FormField",
  "Loader",
  "Menu",
  "Modal",
  "Radio",
  "Select",
  "Skeleton",
  "StatusBadge",
  "Switch",
  "Table",
  "Tabs",
  "TextInput",
  "Textarea",
  "Toast",
  "Tooltip",
];

const FOCUSABLE = [
  "Anchor",
  "Button",
  "Card",
  "Checkbox",
  "Radio",
  "Select",
  "Switch",
  "Table",
  "TextInput",
  "Textarea",
];

function SourceOf(component: string, suffix: RegExp): string {
  const dir = resolve(COMPONENTS, component);
  return readdirSync(dir)
    .filter((file) => suffix.test(file))
    .map((file) => readFileSync(resolve(dir, file), "utf8"))
    .join("\n");
}

describe("contrato a11y de los componentes esenciales", () => {
  it("el escaneo ve el fuente de cada componente esencial", () => {
    for (const name of ESSENTIALS) {
      expect(SourceOf(name, /\.tsx?$/).length, name).toBeGreaterThan(0);
    }
  });

  it.each(FOCUSABLE)("%s dibuja foco visible con el anillo compartido o su disparador", (name) => {
    const css = SourceOf(name, /\.css\.ts$/);
    const logic = SourceOf(name, /\.tsx$/);
    const shared = /styles\/(focus|field)\.css|styles\/field-surface|\.\.\/Button\//;
    const own = /focus-visible|focusVisible|data-focus-visible|:focus-within/;
    expect(shared.test(css) || shared.test(logic) || own.test(css) || own.test(logic), name).toBe(
      true,
    );
  });

  it.each(ESSENTIALS)("%s: si anima, respeta prefers-reduced-motion", (name) => {
    const css = SourceOf(name, /\.css\.ts$/);
    const logic = SourceOf(name, /\.tsx$/);
    const animates_css = /transition|animation|keyframes/.test(css);
    const animates_js = /from "motion\/react"/.test(logic);
    if (!animates_css && !animates_js) return;
    const respects_css = /prefers-reduced-motion|motion\.still|reducedMotion|reducedMedia/;
    const respects_js =
      /useReducedMotion|MotionOff|Transition|OverlayMotion|useRevealMotion|Reveal/;
    const ok =
      (!animates_css || respects_css.test(css) || /motion\.css/.test(css)) &&
      (!animates_js || respects_js.test(logic));
    expect(ok, name).toBe(true);
  });
});
