import { resolve } from "node:path";

import type { NextConfig } from "next";

const config: NextConfig = {
  turbopack: { root: resolve(import.meta.dirname, "../..") },
  experimental: { useTypeScriptCli: true },
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
