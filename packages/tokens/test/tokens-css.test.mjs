import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  animation,
  BuildTokensCss,
  DARK_SCHEME,
  font,
  indigo,
  LIGHT_SCHEME,
  palettes,
  radius,
  spacing,
  zIndex,
} from "../dist/index.js";

const package_root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const css = BuildTokensCss();

function Block(source, header) {
  const start = source.indexOf(header);
  assert.ok(start >= 0, `no existe el bloque ${header}`);
  const body = source.slice(source.indexOf("{", start) + 1, source.indexOf("}", start));
  const declarations = new Map();
  for (const line of body.split("\n")) {
    const match = /^\s*(--[\w-]+|color-scheme): (.+);$/.exec(line);
    if (match) declarations.set(match[1], match[2]);
  }
  return declarations;
}

const root = Block(css, ":root {");
const dark_auto = Block(
  css.slice(css.indexOf("@media (prefers-color-scheme: dark)")),
  ':root:not([data-theme="light"])',
);
const dark_forced = Block(css, ':root[data-theme="dark"]');
const light_forced = Block(css, ':root[data-theme="light"]');

describe("tokens.css", () => {
  it("el script de build escribe el mismo CSS que genera la función", () => {
    const out = join(mkdtempSync(join(tmpdir(), "nebula-tokens-")), "tokens.css");
    execFileSync("node", [join(package_root, "scripts/build-css.mjs"), out], { cwd: package_root });
    assert.equal(readFileSync(out, "utf8"), css);
  });

  it("dist/tokens.css es el que publica el exports ./css", () => {
    assert.equal(readFileSync(join(package_root, "dist/tokens.css"), "utf8"), css);
    const manifest = JSON.parse(readFileSync(join(package_root, "package.json"), "utf8"));
    assert.deepEqual(manifest.exports["./css"], {
      style: "./dist/tokens.css",
      default: "./dist/tokens.css",
    });
    assert.ok(manifest.files.includes("dist"));
  });

  it("las paletas salen tal cual de los tokens de TS", () => {
    for (const [name, scale] of Object.entries(palettes)) {
      for (const [shade, value] of Object.entries(scale)) {
        assert.equal(root.get(`--nebula-palette-${name}-${shade}`), value);
      }
    }
  });

  it("tipografía, espacio, radios, movimiento y capas coinciden con los tokens", () => {
    assert.equal(root.get("--nebula-font-family-sans"), font.family.sans);
    assert.equal(root.get("--nebula-font-size-body1"), `${String(font.size.body1 / 16)}rem`);
    assert.equal(root.get("--nebula-font-weight-semibold"), String(font.weight.semibold));
    assert.equal(
      root.get("--nebula-space-md"),
      `${String((spacing.scale.md * spacing.unit) / 16)}rem`,
    );
    assert.equal(root.get("--nebula-space-none"), "0");
    assert.equal(root.get("--nebula-radius-md"), `${String(radius.md / 16)}rem`);
    assert.equal(root.get("--nebula-radius-full"), "9999px");
    assert.equal(root.get("--nebula-duration-base"), `${String(animation.duration.base)}ms`);
    assert.equal(root.get("--nebula-easing-standard"), animation.easing.standard);
    assert.equal(root.get("--nebula-z-modal"), String(zIndex.modal));
  });

  it("el tema claro es el de :root y coincide con el esquema claro", () => {
    assert.equal(root.get("--nebula-color-primary-500"), indigo["500"]);
    assert.equal(root.get("--nebula-color-surface-base"), LIGHT_SCHEME.colors.surface.base);
    assert.equal(root.get("--nebula-color-text-primary"), LIGHT_SCHEME.colors.text.primary);
    assert.equal(root.get("--nebula-color-border-focus"), LIGHT_SCHEME.colors.border.focus);
    assert.equal(root.get("--nebula-shadow-md"), LIGHT_SCHEME.shadows.md);
    assert.equal(light_forced.get("--nebula-color-surface-base"), LIGHT_SCHEME.colors.surface.base);
    assert.equal(light_forced.get("color-scheme"), "light");
  });

  it("el tema oscuro llega por prefers-color-scheme y por [data-theme]", () => {
    for (const block of [dark_auto, dark_forced]) {
      assert.equal(block.get("color-scheme"), "dark");
      assert.equal(block.get("--nebula-color-surface-base"), DARK_SCHEME.colors.surface.base);
      assert.equal(block.get("--nebula-color-text-primary"), DARK_SCHEME.colors.text.primary);
      assert.equal(block.get("--nebula-color-primary-50"), indigo["950"]);
      assert.equal(block.get("--nebula-shadow-md"), DARK_SCHEME.shadows.md);
    }
    assert.deepEqual(dark_auto, dark_forced);
  });

  it("un [data-theme=light] explícito no se pisa con el oscuro del sistema", () => {
    assert.ok(
      css.includes('@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"])'),
    );
  });

  it("prefers-reduced-motion apaga todas las duraciones", () => {
    const reduced = Block(css.slice(css.indexOf("@media (prefers-reduced-motion")), ":root {");
    for (const name of Object.keys(animation.duration)) {
      assert.equal(reduced.get(`--nebula-duration-${name}`), "0ms");
    }
  });

  it("no deja valores rotos", () => {
    assert.doesNotMatch(css, /undefined|NaN|\[object/);
    assert.doesNotMatch(css, /: ;/);
  });
});
