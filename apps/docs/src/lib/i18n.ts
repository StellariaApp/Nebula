export const LANGS = ["es", "en"] as const;

export type Lang = (typeof LANGS)[number];

export const SOURCE_LANG: Lang = "es";

export function IsLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

export function NegotiateLang(header: string | null): Lang {
  if (header === null) return SOURCE_LANG;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag = "", ...params] = part.trim().split(";");
      const quality = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.trim().toLowerCase(), q: quality ? Number(quality.split("=")[1]) : 1 };
    })
    .filter((entry) => entry.tag.length > 0 && !Number.isNaN(entry.q))
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0] ?? "";
    if (IsLang(base)) return base;
  }
  return SOURCE_LANG;
}

export function OtherLang(lang: Lang): Lang {
  return lang === "es" ? "en" : "es";
}

export function AsLang(value: string): Lang {
  return IsLang(value) ? value : SOURCE_LANG;
}
