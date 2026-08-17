import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";

import "@stellaria/nebula-web/styles.css";

import { NebulaProvider, ThemeScript, vars } from "@stellaria/nebula-web";

import { CurrentLang } from "../lib/lang";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "../lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — ${SITE_TAGLINE}`, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "UI library",
    "React",
    "React Native",
    "design system",
    "design tokens",
    "theming",
    "accessibility",
    "TypeScript",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: { icon: "/icon.svg" },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const lang = await CurrentLang();

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <ThemeScript defaultTheme="aurora" defaultScheme="dark" />
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
