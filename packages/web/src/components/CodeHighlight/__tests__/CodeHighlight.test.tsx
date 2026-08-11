import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { CodeHighlight, LineNumbers, StripTags } from "../CodeHighlight.js";
import { CodeHighlightTabs } from "../CodeHighlightTabs.js";
import { CODE_HIGHLIGHT_LABELS } from "../labels.js";

afterEach(cleanup);

const SOURCE = 'const x = 1;\nconsole.log("hola");';
const HIGHLIGHTED =
  '<span class="kw">const</span> x = <span class="num">1</span>;\n<span class="fn">console</span>.log(&quot;hola&quot;);';

describe("CodeHighlight — utilidades", () => {
  it("numera desde la línea pedida", () => {
    expect(LineNumbers("a\nb\nc", 1)).toBe("1\n2\n3");
    expect(LineNumbers("a\nb", 40)).toBe("40\n41");
  });

  it("StripTags recupera el texto copiable del HTML resaltado", () => {
    expect(StripTags(HIGHLIGHTED)).toBe(SOURCE);
  });

  it("StripTags decodifica las entidades básicas", () => {
    expect(StripTags("&lt;div&gt; &amp; &#39;x&#39;")).toBe("<div> & 'x'");
  });
});

describe("CodeHighlight", () => {
  it("pinta el código plano como texto, sin interpretarlo", () => {
    render(<CodeHighlight code="<script>alert(1)</script>" />);
    expect(screen.getByText("<script>alert(1)</script>")).toBeDefined();
    expect(document.querySelector("script")).toBeNull();
  });

  it("inyecta el HTML resaltado cuando se le pasa", () => {
    render(<CodeHighlight html={HIGHLIGHTED} lang="ts" data-testid="ch" />);
    expect(screen.getByTestId("ch").querySelectorAll("span.kw")).toHaveLength(1);
  });

  it("anuncia el bloque con su lenguaje", () => {
    render(<CodeHighlight code={SOURCE} lang="tsx" />);
    expect(screen.getByLabelText(CODE_HIGHLIGHT_LABELS.region("tsx"))).toBeDefined();
  });

  it("el bloque es enfocable para poder scrollearlo con teclado", () => {
    render(<CodeHighlight code={SOURCE} />);
    expect(screen.getByLabelText(CODE_HIGHLIGHT_LABELS.region(undefined)).tagName).toBe("PRE");
  });

  it("numera las líneas cuando se pide", () => {
    render(<CodeHighlight code={SOURCE} withLineNumbers data-testid="ch" />);
    expect(screen.getByTestId("ch").textContent).toContain("1\n2");
  });

  it("acepta una primera línea distinta", () => {
    render(<CodeHighlight code={SOURCE} withLineNumbers firstLine={10} data-testid="ch" />);
    expect(screen.getByTestId("ch").textContent).toContain("10\n11");
  });

  it("copia el código plano", async () => {
    const user = userEvent.setup();
    render(<CodeHighlight code={SOURCE} />);
    await user.click(screen.getByRole("button", { name: CODE_HIGHLIGHT_LABELS.copy }));
    expect(await navigator.clipboard.readText()).toBe(SOURCE);
  });

  it("copia el texto sin etiquetas cuando el origen es HTML", async () => {
    const user = userEvent.setup();
    render(<CodeHighlight html={HIGHLIGHTED} />);
    await user.click(screen.getByRole("button", { name: CODE_HIGHLIGHT_LABELS.copy }));
    expect(await navigator.clipboard.readText()).toBe(SOURCE);
  });

  it("puede prescindir del botón de copia", () => {
    render(<CodeHighlight code={SOURCE} withCopy={false} />);
    expect(screen.queryByRole("button", { name: CODE_HIGHLIGHT_LABELS.copy })).toBeNull();
  });

  it("muestra el nombre de fichero en la cabecera", () => {
    render(<CodeHighlight code={SOURCE} filename="Button.tsx" />);
    expect(screen.getByText("Button.tsx")).toBeDefined();
  });
});

describe("CodeHighlightTabs", () => {
  const TABS = [
    { value: "tsx", label: "Button.tsx", code: SOURCE, lang: "tsx" },
    { value: "css", label: "Button.css.ts", code: ".a { color: red }", lang: "ts" },
  ];

  it("pinta una pestaña por fichero y muestra la primera", () => {
    render(<CodeHighlightTabs tabs={TABS} label="Ficheros" data-testid="cht" />);
    expect(screen.getByRole("radio", { name: "Button.tsx" })).toBeDefined();
    expect(screen.getByRole("radio", { name: "Button.css.ts" })).toBeDefined();
    expect(screen.getByTestId("cht").querySelector("code")?.textContent).toBe(SOURCE);
  });

  it("cambia de fichero al elegir otra pestaña", async () => {
    const user = userEvent.setup();
    render(<CodeHighlightTabs tabs={TABS} label="Ficheros" />);
    await user.click(screen.getByRole("radio", { name: "Button.css.ts" }));
    expect(screen.getByText(".a { color: red }")).toBeDefined();
  });

  it("aguanta una colección vacía", () => {
    render(<CodeHighlightTabs tabs={[]} label="Ficheros" data-testid="cht" />);
    expect(screen.getByTestId("cht")).toBeDefined();
  });
});

function Root(): HTMLElement {
  const region = screen.getByLabelText(CODE_HIGHLIGHT_LABELS.region(undefined));
  const root = region.parentElement?.parentElement;
  if (root === null || root === undefined) throw new Error("sin raíz de CodeHighlight");
  return root;
}

describe("CodeHighlight — superficie y plegado (ADR-124)", () => {
  it("sin variant no viste el bloque", () => {
    render(<CodeHighlight code={SOURCE} />);
    expect(Root().className).not.toContain("dressed_true");
  });

  it("con variant viste el bloque y publica las variables", () => {
    render(<CodeHighlight code={SOURCE} variant="glass" />);
    expect(Root().className).toContain("dressed_true");
    expect(Root().getAttribute("style")).toContain("--");
  });

  it("expandable ofrece el botón y alterna su estado", async () => {
    const user = userEvent.setup();
    render(<CodeHighlight code={SOURCE} expandable />);
    const button = screen.getByRole("button", { name: CODE_HIGHLIGHT_LABELS.expand });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    await user.click(button);
    const open = screen.getByRole("button", { name: CODE_HIGHLIGHT_LABELS.collapse });
    expect(open.getAttribute("aria-expanded")).toBe("true");
  });

  it("sin expandable no hay botón de plegado", () => {
    render(<CodeHighlight code={SOURCE} />);
    expect(screen.queryByRole("button", { name: CODE_HIGHLIGHT_LABELS.expand })).toBeNull();
  });

  it("el código plegado sigue siendo alcanzable: el pre conserva su foco y su scroll", () => {
    render(<CodeHighlight code={SOURCE} expandable />);
    const region = screen.getByLabelText(CODE_HIGHLIGHT_LABELS.region(undefined));
    expect(region.getAttribute("tabindex")).toBe("0");
    expect(region.textContent).toContain("console.log");
  });
});
