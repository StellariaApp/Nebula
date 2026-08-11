import type { Metadata } from "next";

import { OgHref } from "../../../../lib/site";

import { Reserved } from "../../../../ui/reserved";

export const metadata: Metadata = {
  title: "Theme Creator",
  description: "Build a NebulaTheme, check it against WCAG AA and take the JSON with you.",
  alternates: { canonical: "/theme" },
  openGraph: {
    title: "Theme Creator",
    description: "Build a NebulaTheme, check it against WCAG AA and take the JSON with you.",
    url: "/theme",
    images: [
      OgHref({
        eyebrow: "Reference",
        title: "Theme Creator",
        description: "Build a NebulaTheme, check it against WCAG AA and take the JSON with you.",
      }),
    ],
  },
};

export default function Page() {
  return <Reserved heading="nav.theme" note="reserved.theme" />;
}
