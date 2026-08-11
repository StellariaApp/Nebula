import type { Metadata } from "next";

import { OgHref } from "../../../../lib/site";

import { Reserved } from "../../../../ui/reserved";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Release notes for the Nebula packages, once they are published.",
  alternates: { canonical: "/changelog" },
  openGraph: {
    title: "Changelog",
    description: "Release notes for the Nebula packages, once they are published.",
    url: "/changelog",
    images: [
      OgHref({
        eyebrow: "Reference",
        title: "Changelog",
        description: "Release notes for the Nebula packages, once they are published.",
      }),
    ],
  },
};

export default function Page() {
  return <Reserved heading="nav.changelog" note="reserved.changelog" />;
}
