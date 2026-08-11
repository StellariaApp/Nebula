import type { MetadataRoute } from "next";

import { Absolute } from "../lib/site";

export default function Robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/preview/" }],
    sitemap: Absolute("/sitemap.xml"),
  };
}
