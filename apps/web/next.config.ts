import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { NextConfig } from "next";

const MANIFEST = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../../packages/web/package.json"), "utf8"),
) as { version: string };

const config: NextConfig = {
  env: { NEXT_PUBLIC_NEBULA_VERSION: MANIFEST.version },
  turbopack: { root: resolve(import.meta.dirname, "../..") },
  experimental: { useTypeScriptCli: true, inlineCss: true },
  redirects: async () => [
    { source: "/guides", destination: "/guides/getting-started", permanent: false },
    { source: "/docs", destination: "/guides/getting-started", permanent: false },
    { source: "/docs/:slug*", destination: "/guides/getting-started/:slug*", permanent: false },
    { source: "/components", destination: "/guides/components", permanent: false },
    { source: "/components/:slug*", destination: "/guides/components/:slug*", permanent: false },
    { source: "/native", destination: "/guides/native", permanent: false },
  ],
};

export default config;
