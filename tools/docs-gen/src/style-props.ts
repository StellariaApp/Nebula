import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { Read, WEB } from "./shared.ts";

export interface StylePropDoc {
  name: string;
  css: string[];
  token: string | null;
  keywords: string[] | null;
  open: boolean;
  length: boolean;
  /** `atomic` la resuelve sprinkles con clase por breakpoint; `open`, la variable en linea. */
  responsive: "atomic" | "open";
}

export interface StylePropsReport {
  version: number;
  count: number;
  /** Las esquinas del radio, que ADR-103 pide decir en voz alta que NO son direccion de texto. */
  corners: string[];
  lanes: { atomic: number; open: number };
  props: StylePropDoc[];
}

interface RegistrySpec {
  css: readonly string[];
  token?: string | undefined;
  keywords?: readonly string[] | undefined;
  open?: boolean | undefined;
  length?: boolean | undefined;
}

function AtomicNames(): Set<string> {
  const source = Read(join(WEB, "src/components/Box/Box.css.ts"));
  const start = source.indexOf("const RESPONSIVE = defineProperties(");
  const end = source.indexOf("const UNRESPONSIVE = defineProperties(");
  const block = source.slice(start, end);

  const names = new Set<string>();
  for (const match of block.matchAll(/^\s{4}([a-zA-Z][\w$]*):/gm)) {
    if (match[1] !== undefined) names.add(match[1]);
  }
  return names;
}

export async function BuildStyleProps(): Promise<StylePropsReport> {
  const module = (await import(pathToFileURL(join(WEB, "src/utils/style-registry.ts")).href)) as {
    STYLE_PROPS: Record<string, RegistrySpec>;
  };

  const atomic = AtomicNames();
  const props: StylePropDoc[] = Object.entries(module.STYLE_PROPS)
    .map(([name, spec]): StylePropDoc => ({
      name,
      css: [...spec.css],
      token: spec.token ?? null,
      keywords: spec.keywords === undefined ? null : [...spec.keywords],
      open: spec.open === true,
      length: spec.length === true,
      responsive: atomic.has(name) ? "atomic" : "open",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    version: 1,
    count: props.length,
    corners: props.filter((p) => /^r[tb][lr]$/.test(p.name)).map((p) => p.name),
    lanes: {
      atomic: props.filter((p) => p.responsive === "atomic").length,
      open: props.filter((p) => p.responsive === "open").length,
    },
    props,
  };
}

export function StylePropNames(report: StylePropsReport): Set<string> {
  return new Set(report.props.map((p) => p.name));
}
