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
    expect(html).toContain(themeClass["nebula-dark"]);
    expect(html).toContain('data-scheme="dark"');
    expect(html).toContain("hola");
  });

  it("ColorSchemeScript se serializa a un <script> inline anti-flash", () => {
    const html = renderToStaticMarkup(<ColorSchemeScript storageKey="k" />);
    expect(html).toContain("<script");
    expect(html).toContain("data-nebula-theme");
    expect(html).toContain("colorScheme");
  });
});
