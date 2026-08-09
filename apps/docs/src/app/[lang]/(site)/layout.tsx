import type { ReactNode } from "react";

import { Dict } from "../../../lib/dictionary";
import { AsLang } from "../../../lib/i18n";
import { Chrome } from "../../../ui/chrome";

export default async function SiteLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = AsLang(raw);
  const dict = await Dict(lang, "chrome");

  return (
    <Chrome lang={lang} dict={dict}>
      {children}
    </Chrome>
  );
}
