import { join } from "node:path";

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
}

export interface ApiReport {
  version: number;
  count: number;
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

const LITERAL = /^("[^"]*"|true|false|-?\d+(?:\.\d+)?)$/;

function Defaults(name: string): DefaultScan {
  const literal = new Map<string, string>();
  const ambiguous = new Set<string>();
  const source = join(COMPONENTS, name, `${name}.tsx`);
  if (!Exists(source)) return { literal, ambiguous, read: false };

  const block = /(?:const|let)\s*\{([\s\S]*?)\}\s*=\s*props(?:\s+as[^;]*)?\s*;/.exec(Read(source));
  if (block?.[1] === undefined) return { literal, ambiguous, read: false };

  for (const line of block[1].split("\n")) {
    const assigned = /^\s*([a-z][\w$]*)\s*=\s*(.+?),?\s*$/.exec(line);
    if (assigned === null) continue;
    const key = assigned[1];
    const raw = (assigned[2] ?? "").replace(/'/g, '"').trim();
    if (key === undefined) continue;
    if (LITERAL.test(raw)) literal.set(key, raw);
    else ambiguous.add(key);
  }
  return { literal, ambiguous, read: true };
}

function RenderType(ts: CompilerApi, checker: TsChecker, symbol: TsSymbol, at: TsNode): string {
  const type = checker.getTypeOfSymbolAtLocation(symbol, at);
  const text = checker.typeToString(type, at, ts.TypeFormatFlags.NoTruncation);
  return text.replace(/\s*\|\s*undefined$/, "");
}

export async function BuildApi(): Promise<ApiReport> {
  const style_names = StylePropNames(await BuildStyleProps());
  const ts = Compiler();
  const names = Dirs(COMPONENTS);

  const entries = names
    .map((name) => ({ name, file: join(DIST, "components", name, `${name}.types.d.ts`) }))
    .filter((entry) => Exists(entry.file));

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

  for (const name of names) {
    const file = join(DIST, "components", name, `${name}.types.d.ts`);
    const source = Exists(file) ? program.getSourceFile(file) : undefined;
    if (source === undefined) {
      gaps.noContract.push(name);
      components.push({
        name,
        contract: null,
        own: [],
        slots: [],
        inherited: [],
        gaps: ["contract"],
      });
      continue;
    }

    const wanted = `${name}Props`;
    let symbol: TsSymbol | undefined;
    ts.forEachChild(source, (node) => {
      const named = node.name;
      if (named === undefined || named.text !== wanted) return;
      if (!ts.isInterfaceDeclaration(node) && !ts.isTypeAliasDeclaration(node)) return;
      symbol = checker.getSymbolAtLocation(named);
    });

    if (symbol === undefined) {
      gaps.noContract.push(name);
      components.push({
        name,
        contract: null,
        own: [],
        slots: [],
        inherited: [],
        gaps: ["contract"],
      });
      continue;
    }

    const declared = checker.getDeclaredTypeOfSymbol(symbol);
    const defaults = Defaults(name);
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
      const entry: PropDoc = {
        name: prop.getName(),
        type: RenderType(ts, checker, prop, declaration),
        required: (prop.flags & ts.SymbolFlags.Optional) === 0,
        default: defaults.literal.get(prop.getName()) ?? null,
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

    const missing = own.filter((p) => defaults.ambiguous.has(p.name)).map((p) => p.name);
    if (missing.length > 0) gaps.defaultUnknown.push(name);
    if (!defaults.read && local.length > 0) gaps.noDestructuring.push(name);

    components.push({
      name,
      contract: `${name}Props`,
      own,
      slots,
      inherited: [...inherited.entries()]
        .map(([group, count]) => ({ group, count }))
        .sort((a, b) => a.group.localeCompare(b.group)),
      gaps: missing.length > 0 ? ["default"] : [],
    });
  }

  const style_count = style_names.size;

  return {
    version: 1,
    count: components.length,
    styleProps: { count: style_count, page: "/docs/style-props" },
    gaps,
    components,
  };
}
