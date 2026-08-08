import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { SOURCE_LANG, type Lang } from "./i18n";

export type Dictionary = Record<string, string>;

const CACHE = new Map<string, Dictionary>();

async function Load(lang: Lang, namespace: string): Promise<Dictionary> {
  const key = `${lang}/${namespace}`;
  const hit = CACHE.get(key);
  if (hit !== undefined) return hit;

  const path = resolve(process.cwd(), "i18n", lang, `${namespace}.json`);
  const parsed = JSON.parse(await readFile(path, "utf8")) as Dictionary;
  CACHE.set(key, parsed);
  return parsed;
}

export async function Dict(lang: Lang, namespace: string): Promise<Dictionary> {
  const source = await Load(SOURCE_LANG, namespace);
  if (lang === SOURCE_LANG) return source;
  return { ...source, ...(await Load(lang, namespace)) };
}
