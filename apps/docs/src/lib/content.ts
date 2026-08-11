import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

import matter from "gray-matter";

import { LANGS, SOURCE_LANG, type Lang } from "./i18n";
import { DEFAULT_SECTION, FindSection, SectionHref } from "./sections";

export interface Frontmatter {
  title: string;
  summary: string;
  order: number;
}

export interface Doc {
  slug: string[];
  lang: Lang;
  /** El idioma pedido cuando no existe su traducción y se sirve el de origen. */
  fallbackFrom: Lang | null;
  front: Frontmatter;
  body: string;
}

function Root(lang: Lang): string {
  return resolve(process.cwd(), "content", lang);
}

function SectionRoot(lang: Lang, section: string): string {
  return join(Root(lang), section);
}

async function Walk(dir: string, base: string[] = []): Promise<string[][]> {
  const out: string[][] = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      out.push(...(await Walk(join(dir, entry.name), [...base, entry.name])));
    } else if (entry.name.endsWith(".mdx")) {
      out.push([...base, entry.name.replace(/\.mdx$/, "")]);
    }
  }
  return out;
}

function Parse(raw: string): { front: Frontmatter; body: string } {
  const { content, data } = matter(raw);
  const front = data as Partial<Frontmatter>;
  return {
    front: {
      title: front.title ?? "",
      summary: front.summary ?? "",
      order: front.order ?? 999,
    },
    body: content,
  };
}

export async function ReadDoc(lang: Lang, section: string, slug: string[]): Promise<Doc | null> {
  const file = `${join(section, ...slug)}.mdx`;

  try {
    const raw = await readFile(join(Root(lang), file), "utf8");
    return { slug, lang, fallbackFrom: null, ...Parse(raw) };
  } catch {
    if (lang === SOURCE_LANG) return null;
  }

  try {
    const raw = await readFile(join(Root(SOURCE_LANG), file), "utf8");
    return { slug, lang: SOURCE_LANG, fallbackFrom: lang, ...Parse(raw) };
  } catch {
    return null;
  }
}

export async function Coverage(): Promise<Record<Lang, { total: number; translated: number }>> {
  const source = await Walk(Root(SOURCE_LANG));
  const total = source.length;
  const out = {} as Record<Lang, { total: number; translated: number }>;
  for (const lang of LANGS) {
    const own = await Walk(Root(lang));
    out[lang] = { total, translated: own.length };
  }
  return out;
}

/**
 * A dónde lleva una sección: a su primera página, no a su índice. Sin páginas —las reservadas— cae
 * en el índice, que es lo único que hay.
 */
export async function SectionLanding(lang: Lang, section: string): Promise<string> {
  if (FindSection(section)?.kind !== "docs") return SectionHref(section);

  const [first] = await DocIndex(lang, section);
  return first === undefined ? SectionHref(section) : SectionHref(section, ...first.slug);
}

/** El destino de «Guides» en la barra, el pie y la portada. */
export async function GuidesHome(lang: Lang): Promise<string> {
  return SectionLanding(lang, DEFAULT_SECTION);
}

export interface DocEntry {
  slug: string[];
  title: string;
  summary: string;
  order: number;
}

/** El índice de una sección del idioma, ordenado por `order` del front matter. */
export async function DocIndex(lang: Lang, section: string): Promise<DocEntry[]> {
  const slugs = await Walk(SectionRoot(lang, section));
  const entries: DocEntry[] = [];
  for (const slug of slugs) {
    const doc = await ReadDoc(lang, section, slug);
    if (doc === null) continue;
    entries.push({
      slug,
      title: doc.front.title,
      summary: doc.front.summary,
      order: doc.front.order,
    });
  }
  return entries.sort((a, b) => a.order - b.order);
}
