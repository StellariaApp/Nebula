import { cookies, headers } from "next/headers";

import { LANGS, LANG_COOKIE, ResolveLang, SOURCE_LANG, type Lang } from "./i18n";

/**
 * El idioma de la petición. Con un solo idioma **no se negocia**: `cookies()` y `headers()` sacan de
 * la generación estática a cualquier ruta que las toque, y ésta se llama desde el layout raíz, así
 * que negociar entre un único candidato costaba el prerenderizado del sitio entero. La rama vuelve a
 * abrirse sola en cuanto `LANGS` crezca, que es cuando ADR-122 dice que esto se revisa.
 */
export async function CurrentLang(): Promise<Lang> {
  if (LANGS.length === 1) return SOURCE_LANG;
  const [jar, head] = await Promise.all([cookies(), headers()]);
  return ResolveLang(jar.get(LANG_COOKIE)?.value, head.get("accept-language"));
}
