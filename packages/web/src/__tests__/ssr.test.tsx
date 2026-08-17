import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ColorSchemeScript } from "../provider/color-scheme-script.js";
import { NebulaProvider } from "../provider/nebula-provider.js";
import { themeClass } from "../theme/themes.css.js";

describe("SSR (sin window)", () => {
  it("NebulaProvider renderiza a HTML con el tema por defecto sin reventar", () => {
    const html = renderToStaticMarkup(
      <NebulaProvider>
        <span>hola</span>
      </NebulaProvider>,
    );
    expect(html).toContain(themeClass["dark"]);
    expect(html).toContain('data-scheme="dark"');
    expect(html).toContain("hola");
  });

  it("ColorSchemeScript se serializa a un <script> inline anti-flash", () => {
    const html = renderToStaticMarkup(<ColorSchemeScript storageKey="k" />);
    expect(html).toContain("<script");
    expect(html).toContain("data-theme");
    expect(html).toContain("colorScheme");
  });

  it("sin mapa propio conoce los oficiales, que es lo publicado", () => {
    const html = renderToStaticMarkup(<ColorSchemeScript storageKey="k" />);
    expect(html).toContain(themeClass["dark"]);
  });

  it("defaultTheme='dark' sigue pintando: un esquema ahi no es una identidad", () => {
    const html = renderToStaticMarkup(<ColorSchemeScript storageKey="k" defaultTheme="dark" />);
    expect(html).toContain(themeClass["dark"]);
  });

  it("nunca deja <html> sin clase: los oficiales son el suelo del mapa", () => {
    const html = renderToStaticMarkup(
      <ColorSchemeScript
        storageKey="k"
        defaultTheme="fantasma"
        themes={{ otro: { dark: "otro_d", light: "otro_l" } }}
      />,
    );
    expect(html).toContain(themeClass["dark"]);
    expect(html).toContain("otro_d");
  });

  it("con mapa propio reconoce un tema que la libreria no conoce (ADR-155)", () => {
    const html = renderToStaticMarkup(
      <ColorSchemeScript
        storageKey="k"
        defaultTheme="rosette"
        themes={{ rosette: { dark: "rosette_abc", light: "rosette_def" } }}
      />,
    );
    expect(html).toContain("rosette_abc");
    expect(html).toContain('"rosette"');
  });
});
