import { readdirSync, statSync } from "node:fs";
import { join, sep } from "node:path";

import {
  COMPONENTS,
  Compiler,
  DIST,
  Dirs,
  Exists,
  Read,
  type CompilerApi,
  type TsChecker,
  type TsNode,
  type TsSymbol,
  SUBPATHS,
  WEB,
} from "./shared.ts";
import { BuildStyleProps, StylePropNames } from "./style-props.ts";

export interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  doc: string | null;
  slot: boolean;
}

export interface ComponentApi {
  name: string;
  contract: string | null;
  own: PropDoc[];
  slots: PropDoc[];
  inherited: { group: string; count: number }[];
  gaps: string[];
  /**
   * Los demas componentes publicos cuyo contrato vive en el mismo directorio. La ficha del sitio es
   * por directorio, asi que `Charts` lleva dentro sus diez graficos y `Combobox` sus variantes.
   */
  subComponents: ComponentApi[];
}

export interface ApiReport {
  version: number;
  /** Fichas, que son una por directorio. */
  count: number;
  /** Componentes con contrato documentado, contando los que van dentro de una ficha. */
  documented: number;
  styleProps: { count: number; page: string };
  gaps: {
    noContract: string[];
    noJsdoc: string[];
    defaultUnknown: string[];
    noDestructuring: string[];
  };
  components: ComponentApi[];
}

const GROUPS: { group: string; test: (file: string) => boolean }[] = [
  { group: "styleProps", test: (f) => f.includes("/utils/style-props") },
  { group: "press", test: (f) => f.includes("/utils/press-props") },
  { group: "permissions", test: (f) => f.includes("/packages/tokens/") },
  { group: "html", test: (f) => f.includes("/@types/react/") },
];

function GroupOf(file: string): string | null {
  const normalized = file.replace(/\\/g, "/");
  for (const { group, test } of GROUPS) if (test(normalized)) return group;
  return null;
}

function Jsdoc(ts: CompilerApi, symbol: TsSymbol): string | null {
  const parts = symbol.getDocumentationComment(undefined);
  const text = ts.displayPartsToString(parts).trim();
  return text.length > 0 ? text : null;
}

interface DefaultScan {
  literal: Map<string, string>;
  ambiguous: Set<string>;
  read: boolean;
}

const LITERAL = /^("[^"]*"|true|false|null|-?\d+(?:\.\d+)?)$/;

const EXPORT_BLOCK = /export\s*\{([^}]*)\}/g;
const CONTRACT = /export\s+(?:declare\s+)?(?:interface|type)\s+([A-Z][A-Za-z0-9]*Props)\b/g;

/** Los componentes que el consumidor puede importar: los que reexporta el barrel o un subpath. */
function PublicNames(): Set<string> {
  const names = new Set<string>();
  const Collect = (source: string): void => {
    for (const block of source.matchAll(EXPORT_BLOCK)) {
      for (const part of (block[1] ?? "").split(",")) {
        const name =
          part
            .trim()
            .split(/\s+as\s+/)
            .pop()
            ?.trim() ?? "";
        if (/^[A-Z][A-Za-z0-9]*$/.test(name)) names.add(name);
      }
    }
  };
  const barrel = join(DIST, "index.d.ts");
  if (Exists(barrel)) Collect(Read(barrel));
  for (const subpath of SUBPATHS) {
    const file = join(WEB, "src", subpath, "index.ts");
    if (Exists(file)) Collect(Read(file));
  }
  return names;
}

function Declarations(dir: string, out: string[] = []): string[] {
  if (!Exists(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) Declarations(path, out);
    else if (path.endsWith(".d.ts")) out.push(path);
  }
  return out;
}

/**
 * De cada `<Nombre>Props` publicada, el `.d.ts` que la declara. Se busca por contrato y no por el
 * nombre del directorio: `Charts/` no declara `ChartsProps`, pero si los diez de sus graficos.
 */
function ContractIndex(): Map<string, string> {
  const index = new Map<string, string>();
  for (const file of Declarations(join(DIST, "components"))) {
    for (const found of Read(file).matchAll(CONTRACT)) {
      const name = found[1];
      if (name !== undefined && !index.has(name)) index.set(name, file);
    }
  }
  return index;
}

function DefaultTag(symbol: TsSymbol): string | null {
  for (const tag of symbol.getJsDocTags()) {
    if (tag.name !== "default") continue;
    const text = (tag.text ?? [])
      .map((part) => part.text)
      .join("")
      .trim();
    if (text.length > 0) return text;
  }
  return null;
}

function Defaults(dir: string, name: string): DefaultScan {
  const literal = new Map<string, string>();
  const ambiguous = new Set<string>();
  const own = join(COMPONENTS, dir, `${name}.tsx`);
  const source = Exists(own) ? own : join(COMPONENTS, dir, `${dir}.tsx`);
  if (!Exists(source)) return { literal, ambiguous, read: false };

  const block = /(?:const|let)\s*\{([\s\S]*?)\}\s*=\s*props(?:\s+as[^;]*)?\s*;/.exec(Read(source));
  if (block?.[1] === undefined) return { literal, ambiguous, read: false };

  /**
   * La desestructuracion puede traer varias entradas por linea, asi que se parte tambien por coma
   * de primer nivel: sin eso, `variant = "ghost", color = "gray"` entraba entera como ambigua.
   */
  for (const entry of SplitTop(block[1])) {
    const assigned = /^\s*([a-z][\w$]*)\s*=\s*([\s\S]+?)\s*$/.exec(entry);
    if (assigned === null) continue;
    const key = assigned[1];
    const raw = (assigned[2] ?? "").replace(/'/g, '"').trim();
    if (key === undefined) continue;
    if (LITERAL.test(raw)) literal.set(key, raw);
    else ambiguous.add(key);
  }
  return { literal, ambiguous, read: true };
}

/**
 * Parte por las comas que no estan dentro de un objeto, un array o una llamada. Los angulos NO
 * cuentan: el `>` de una funcion flecha desequilibraria el contador y se tragaria el resto.
 */
function SplitTop(source: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{" || char === "[" || char === "(") depth += 1;
    else if (char === "}" || char === "]" || char === ")") depth -= 1;
    else if (char === "," && depth === 0) {
      parts.push(source.slice(start, index));
      start = index + 1;
    }
  }
  parts.push(source.slice(start));
  return parts;
}

/**
 * Los tipos que TypeScript no puede nombrar en corto los emite como `import("<ruta>").Tipo`, con la
 * ruta ABSOLUTA de la maquina que genero. Eso hacia dos danos: publicaba el directorio personal de
 * quien corriera `gen:docs` en la ficha de 158 componentes, y volvia `api.json` irreproducible, asi
 * que el gate de frescura no podia pasar en un runner Linux ni aunque el codigo fuera identico.
 *
 * Se recorta el `import(...)` y se deja el nombre, que es lo unico que el lector necesita.
 */
const IMPORT_PATH = /import\("[^"]*"\)\./g;

function RenderType(ts: CompilerApi, checker: TsChecker, symbol: TsSymbol, at: TsNode): string {
  const type = checker.getTypeOfSymbolAtLocation(symbol, at);
  const text = checker.typeToString(type, at, ts.TypeFormatFlags.NoTruncation);
  return text.replace(IMPORT_PATH, "").replace(/\s*\|\s*undefined$/, "");
}

interface Target {
  dir: string;
  name: string;
  file: string;
}

/**
 * Que se documenta en la ficha de cada directorio: su propio contrato y el de los demas componentes
 * publicos que viven dentro. Se resuelve por contrato, no por el nombre del directorio.
 */
function Targets(index: Map<string, string>, publics: Set<string>): Map<string, Target[]> {
  const by_dir = new Map<string, Target[]>();
  for (const dir of Dirs(COMPONENTS)) {
    const root = join(DIST, "components", dir);
    const inside = (file: string | undefined): boolean =>
      file !== undefined && file.startsWith(`${root}${sep}`);

    const targets: Target[] = [];
    /**
     * El contrato propio, y si no vive en su directorio se acepta el compartido: `DateRangePicker`
     * reusa a proposito el de `DatePicker`, y su ficha no puede quedarse vacia por eso.
     */
    const own = index.get(`${dir}Props`);
    if (own !== undefined) targets.push({ dir, name: dir, file: own });

    for (const name of [...publics].sort()) {
      if (name === dir) continue;
      const file = index.get(`${name}Props`);
      if (!inside(file) || file === undefined) continue;
      targets.push({ dir, name, file });
    }
    by_dir.set(dir, targets);
  }
  return by_dir;
}

export async function BuildApi(): Promise<ApiReport> {
  const style_names = StylePropNames(await BuildStyleProps());
  const ts = Compiler();
  const names = Dirs(COMPONENTS);

  const by_dir = Targets(ContractIndex(), PublicNames());
  const entries = [...by_dir.values()].flat();

  const options = {
    skipLibCheck: true,
    strict: true,
    noEmit: true,
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
    lib: ["lib.es2022.d.ts", "lib.dom.d.ts"],
  };
  const host = ts.createCompilerHost(options);
  host.getCurrentDirectory = () => WEB;

  const program = ts.createProgram(
    entries.map((entry) => entry.file),
    options,
    host,
  );
  const checker = program.getTypeChecker();

  const gaps: ApiReport["gaps"] = {
    noContract: [],
    noJsdoc: [],
    defaultUnknown: [],
    noDestructuring: [],
  };
  const components: ComponentApi[] = [];

  const EMPTY = (name: string): ComponentApi => ({
    name,
    contract: null,
    own: [],
    slots: [],
    inherited: [],
    gaps: ["contract"],
    subComponents: [],
  });

  function Describe(target: Target): ComponentApi | null {
    const { dir, name, file } = target;
    const source = program.getSourceFile(file);
    if (source === undefined) return null;

    const wanted = `${name}Props`;
    let symbol: TsSymbol | undefined;
    ts.forEachChild(source, (node) => {
      const named = node.name;
      if (named === undefined || named.text !== wanted) return;
      if (!ts.isInterfaceDeclaration(node) && !ts.isTypeAliasDeclaration(node)) return;
      symbol = checker.getSymbolAtLocation(named);
    });
    if (symbol === undefined) return null;

    const declared = checker.getDeclaredTypeOfSymbol(symbol);
    const defaults = Defaults(dir, name);
    const own: PropDoc[] = [];
    const slots: PropDoc[] = [];
    const inherited = new Map<string, number>();
    const local: string[] = [];

    for (const prop of checker.getPropertiesOfType(declared)) {
      const declaration = prop.declarations?.[0];

      const group =
        declaration === undefined
          ? style_names.has(prop.getName())
            ? "styleProps"
            : null
          : GroupOf(declaration.getSourceFile().fileName);

      if (group !== null) {
        inherited.set(group, (inherited.get(group) ?? 0) + 1);
        continue;
      }
      if (declaration === undefined) continue;

      const doc = Jsdoc(ts, prop);
      const tagged = DefaultTag(prop);
      const entry: PropDoc = {
        name: prop.getName(),
        type: RenderType(ts, checker, prop, declaration),
        required: (prop.flags & ts.SymbolFlags.Optional) === 0,
        default: tagged ?? defaults.literal.get(prop.getName()) ?? null,
        doc,
        slot: /^[a-z][\w$]*Props$/.test(prop.getName()),
      };
      local.push(entry.name);
      if (entry.slot) slots.push(entry);
      else own.push(entry);
    }

    const sort = (a: PropDoc, b: PropDoc) => a.name.localeCompare(b.name);
    own.sort(sort);
    slots.sort(sort);

    const documented = [...own, ...slots].filter((p) => p.doc !== null).length;
    if (local.length > 0 && documented === 0) gaps.noJsdoc.push(name);

    /** `@default` gana a la desestructuracion, asi que una prop anotada deja de ser un hueco. */
    const missing = own
      .filter((p) => defaults.ambiguous.has(p.name) && p.default === null)
      .map((p) => p.name);
    if (missing.length > 0) gaps.defaultUnknown.push(name);
    if (!defaults.read && local.length > 0) gaps.noDestructuring.push(name);

    return {
      name,
      contract: `${name}Props`,
      own,
      slots,
      inherited: [...inherited.entries()]
        .map(([group, count]) => ({ group, count }))
        .sort((a, b) => a.group.localeCompare(b.group)),
      gaps: missing.length > 0 ? ["default"] : [],
      subComponents: [],
    };
  }

  for (const dir of names) {
    const targets = by_dir.get(dir) ?? [];
    const described = targets
      .map((target) => Describe(target))
      .filter((entry): entry is ComponentApi => entry !== null);

    const root = described.find((entry) => entry.name === dir);
    const subs = described.filter((entry) => entry.name !== dir);

    if (root === undefined && subs.length === 0) {
      gaps.noContract.push(dir);
      components.push(EMPTY(dir));
      continue;
    }
    if (root === undefined) {
      /** El directorio es una familia —`Charts`, `DragDrop`, `Kanban`— y su ficha son sus partes. */
      components.push({ ...EMPTY(dir), gaps: [], subComponents: subs });
      continue;
    }
    components.push({ ...root, subComponents: subs });
  }

  const style_count = style_names.size;
  const documented = components.reduce((total, entry) => total + 1 + entry.subComponents.length, 0);

  return {
    version: 1,
    count: components.length,
    documented,
    styleProps: { count: style_count, page: "/docs/style-props" },
    gaps,
    components,
  };
}
