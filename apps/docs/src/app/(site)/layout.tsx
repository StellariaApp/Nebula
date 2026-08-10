import type { ReactNode } from "react";

import { Dict } from "../../lib/dictionary";
import { CurrentLang } from "../../lib/lang";
import { Chrome } from "../../ui/chrome";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const lang = await CurrentLang();
  const dict = await Dict(lang, "chrome");

  return (
    <Chrome lang={lang} dict={dict}>
      {children}
    </Chrome>
  );
}
