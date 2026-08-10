import type { ReactNode } from "react";

import { ColorSchemeScript, NebulaProvider, vars } from "@stellaria/nebula-web";

import { CurrentLang } from "../lib/lang";

export const metadata = {
  title: "Nebula",
  description: "Universal UI library for web and React Native.",
  icons: { icon: "/icon.svg" },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const lang = await CurrentLang();

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
