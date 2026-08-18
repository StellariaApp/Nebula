import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ThemeScript } from "../provider/theme-script.js";
import { NebulaProvider } from "../provider/nebula-provider.js";
import { THEME_CLASSES } from "@stellaria/nebula-themes/web";

describe("SSR (sin window)", () => {
  it("NebulaProvider renderiza a HTML con el tema por defecto sin reventar", () => {
    const html = renderToStaticMarkup(
      <NebulaProvider>
        <span>hola</span>
      </NebulaProvider>,
    );
    expect(html).toContain(THEME_CLASSES["dark"]);
    expect(html).toContain('data-scheme="dark"');
    expect(html).toContain("hola");
  });

  it("ThemeScript se serializa a un <script> inline anti-flash", () => {
    const html = renderToStaticMarkup(<ThemeScript storageKeys={{ theme: "k-theme", scheme: "k-scheme" }} />);
    expect(html).toContain("<script");
    expect(html).toContain("data-theme");
    expect(html).toContain("colorScheme");
  });

  it("sin mapa propio conoce los oficiales, que es lo publicado", () => {
    const html = renderToStaticMarkup(<ThemeScript storageKeys={{ theme: "k-theme", scheme: "k-scheme" }} />);
    expect(html).toContain(THEME_CLASSES["dark"]);
  });

  it("defaultTheme='dark' sigue pintando: un esquema ahi no es una identidad", () => {
    const html = renderToStaticMarkup(<ThemeScript storageKeys={{ theme: "k-theme", scheme: "k-scheme" }} defaultTheme="dark" />);
    expect(html).toContain(THEME_CLASSES["dark"]);
  });

  it("nunca deja <html> sin clase: los oficiales son el suelo del mapa", () => {
    const html = renderToStaticMarkup(
      <ThemeScript
        storageKeys={{ theme: "k-theme", scheme: "k-scheme" }}
        defaultTheme="fantasma"
        themesClasses={{ otro: { dark: "otro_d", light: "otro_l" } }}
      />,
    );
    expect(html).toContain(THEME_CLASSES["dark"]);
    expect(html).toContain("otro_d");
  });

  it("con mapa propio reconoce un tema que la libreria no conoce (ADR-155)", () => {
    const html = renderToStaticMarkup(
      <ThemeScript
        storageKeys={{ theme: "k-theme", scheme: "k-scheme" }}
        defaultTheme="rosette"
        themesClasses={{ rosette: { dark: "rosette_abc", light: "rosette_def" } }}
      />,
    );
    expect(html).toContain("rosette_abc");
    expect(html).toContain('"rosette"');
  });
});
