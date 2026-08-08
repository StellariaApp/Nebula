import type { ReactNode } from "react";

import { ColorSchemeScript, NebulaProvider } from "@stellaria/nebula-web";

import { Dict } from "../../lib/dictionary";
import { AsLang, LANGS } from "../../lib/i18n";
import { Chrome } from "../../ui/chrome";

export const metadata = {
  title: "Nebula",
  description: "Librería UI universal para web y React Native.",
};

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function LangLayout({
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
    <html lang={lang} suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultTheme="dark" />
      </head>
      <body style={{ margin: 0 }}>
        <NebulaProvider defaultTheme="dark">
          <Chrome lang={lang} dict={dict} path="">
            {children}
          </Chrome>
        </NebulaProvider>
      </body>
    </html>
  );
}
