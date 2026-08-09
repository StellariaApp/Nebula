import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

import matter from "gray-matter";

import { LANGS, SOURCE_LANG, type Lang } from "./i18n";

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

export async function ReadDoc(lang: Lang, slug: string[]): Promise<Doc | null> {
  const file = `${join(...slug)}.mdx`;

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

export async function AllSlugs(): Promise<{ lang: Lang; slug: string[] }[]> {
  const source = await Walk(Root(SOURCE_LANG));
  const out: { lang: Lang; slug: string[] }[] = [];
  for (const lang of LANGS) {
    const own = await Walk(Root(lang));
    const seen = new Set(source.map((s) => s.join("/")));
    for (const slug of own) seen.add(slug.join("/"));
    for (const key of [...seen].sort()) out.push({ lang, slug: key.split("/") });
  }
  return out;
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

export interface DocEntry {
  slug: string[];
  title: string;
  order: number;
}

/** El índice de guías del idioma, ordenado por `order` del front matter. */
export async function DocIndex(lang: Lang): Promise<DocEntry[]> {
  const slugs = await Walk(Root(lang));
  const entries: DocEntry[] = [];
  for (const slug of slugs) {
    const doc = await ReadDoc(lang, slug);
    if (doc === null) continue;
    entries.push({ slug, title: doc.front.title, order: doc.front.order });
  }
  return entries.sort((a, b) => a.order - b.order);
}
