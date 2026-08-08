import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
export const WEB = join(REPO, "packages/web");
export const COMPONENTS = join(WEB, "src/components");
export const DIST = join(WEB, "dist");
export const OUT_DIR = join(REPO, "apps/docs/generated");

export const SUBPATHS = ["command", "charts", "datagrid", "dnd", "carousel", "media", "editor"];

export function Dirs(root: string): string[] {
  return readdirSync(root)
    .filter((entry) => statSync(join(root, entry)).isDirectory())
    .sort();
}

export function Read(path: string): string {
  return readFileSync(path, "utf8");
}

export function Exists(path: string): boolean {
  return existsSync(path);
}

export interface TsNode {
  getSourceFile: () => { fileName: string };
  name?: TsNamed | undefined;
}

export interface TsNamed extends TsNode {
  text: string;
}

export interface TsJsDocTag {
  name: string;
  text?: { text: string }[] | undefined;
}

export interface TsSymbol {
  getName: () => string;
  flags: number;
  declarations?: TsNode[] | undefined;
  getDocumentationComment: (checker: undefined) => unknown;
  getJsDocTags: (checker?: undefined) => TsJsDocTag[];
}

export interface TsChecker {
  getSymbolAtLocation: (node: TsNode) => TsSymbol | undefined;
  getDeclaredTypeOfSymbol: (symbol: TsSymbol) => unknown;
  getPropertiesOfType: (type: unknown) => TsSymbol[];
  getTypeOfSymbolAtLocation: (symbol: TsSymbol, node: TsNode) => unknown;
  typeToString: (type: unknown, node: TsNode, flags: number) => string;
}

export interface TsProgram {
  getTypeChecker: () => TsChecker;
  getSourceFile: (file: string) => TsNode | undefined;
}

/**
 * La superficie del compilador que este generador usa. Se declara a mano porque los tipos que
 * resuelve el paquete son los de TS 7, que es un binario nativo y no expone la API JS (ADR-012).
 */
export interface TsHost {
  getCurrentDirectory: () => string;
}

export interface CompilerApi {
  version: string;
  createCompilerHost: (options: Record<string, unknown>) => TsHost;
  createProgram: (files: string[], options: Record<string, unknown>, host: TsHost) => TsProgram;
  forEachChild: (node: TsNode, visit: (child: TsNode) => void) => void;
  isInterfaceDeclaration: (node: TsNode) => boolean;
  isTypeAliasDeclaration: (node: TsNode) => boolean;
  displayPartsToString: (parts: unknown) => string;
  ModuleKind: { ESNext: number };
  ScriptTarget: { ES2022: number };
  ModuleResolutionKind: { Bundler: number };
  TypeFormatFlags: { NoTruncation: number };
  SymbolFlags: { Optional: number };
  JsxEmit: { ReactJSX: number };
}

export function Compiler(): CompilerApi {
  const req = createRequire(`${REPO}/`);
  return req(req.resolve("typescript/lib/typescript.js", { paths: [REPO] })) as CompilerApi;
}

export function Emit(name: string, payload: unknown): void {
  writeFileSync(join(OUT_DIR, name), `${JSON.stringify(payload, null, 2)}\n`);
}

export function Matches(name: string, payload: unknown): boolean {
  const path = join(OUT_DIR, name);
  if (!existsSync(path)) return false;
  return readFileSync(path, "utf8") === `${JSON.stringify(payload, null, 2)}\n`;
}
