import { resolve } from "node:path";

import type { NextConfig } from "next";

const config: NextConfig = {
  turbopack: { root: resolve(import.meta.dirname, "../..") },
  experimental: { useTypeScriptCli: true },
};

export default config;
