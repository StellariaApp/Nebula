import type { ReactNode } from "react";

import { ColorSchemeScript, NebulaProvider, vars } from "@stellaria/nebula-web";

import { AsLang, LANGS } from "../../lib/i18n";

export const metadata = {
  title: "Nebula",
  description: "Universal UI library for web and React Native.",
  icons: { icon: "/icon.svg" },
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

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultTheme="dark" />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          background: vars.color.surface.base,
          color: vars.color.text.primary,
          fontFamily: vars.font.family.sans,
        }}
      >
        <NebulaProvider defaultTheme="dark" applyTheme="root">
          {children}
        </NebulaProvider>
      </body>
    </html>
  );
}
