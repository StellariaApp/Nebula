import { cookies, headers } from "next/headers";

import { LANG_COOKIE, ResolveLang, type Lang } from "./i18n";

export async function CurrentLang(): Promise<Lang> {
  const [jar, head] = await Promise.all([cookies(), headers()]);
  return ResolveLang(jar.get(LANG_COOKIE)?.value, head.get("accept-language"));
}
