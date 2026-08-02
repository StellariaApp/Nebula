import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright-core";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, "../..");
const OUT = join(ROOT, "docs/reviews/figma-baseline");

const FONT = join(
  ROOT,
  "node_modules/.pnpm/@fontsource-variable+geist@5.3.0/node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2",
);

const CHROME =
  process.env.FIGMA_MEASURE_CHROME ??
  join(process.env.LOCALAPPDATA ?? "", "ms-playwright/chromium-1228/chrome-win64/chrome.exe");

const SIZES = [10, 11, 12, 13, 14, 16, 18, 20, 24, 28, 32, 40, 48];
const WEIGHTS = [400, 500, 600, 700];

/** Cadena a identificar: si se pasa, además de la tabla se resuelve su tamaño por ancho de tinta. */
const probe = process.argv.slice(2).join(" ");

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage();

const data = await page.evaluate(
  async ({ fontB64, sizes, weights, probe: text }) => {
    const face = new FontFace("GeistCal", `url(data:font/woff2;base64,${fontB64})`);
    await face.load();
    document.fonts.add(face);
    await document.fonts.ready;

    const c = document.createElement("canvas");
    c.width = 1400;
    c.height = 260;
    const ctx = c.getContext("2d", { willReadFrequently: true });

    const Ink = (px, weight, glyphs) => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#000";
      ctx.font = `${weight} ${px}px GeistCal`;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(glyphs, 12, 190);
      const { data: d } = ctx.getImageData(0, 0, c.width, c.height);
      let top = -1;
      let bottom = -1;
      let left = -1;
      let right = -1;
      for (let y = 0; y < c.height; y += 1)
        for (let x = 0; x < c.width; x += 1) {
          if (d[(y * c.width + x) * 4] >= 128) continue;
          if (top < 0) top = y;
          bottom = y;
          if (left < 0 || x < left) left = x;
          if (x > right) right = x;
        }
      return { h: bottom - top + 1, w: right - left + 1 };
    };

    const table = [];
    for (const px of sizes)
      for (const weight of weights)
        table.push({
          px,
          weight,
          cap: Ink(px, weight, "HEIXT").h,
          x: Ink(px, weight, "xoune").h,
        });

    const probes =
      text === ""
        ? []
        : sizes.flatMap((px) =>
            weights.map((weight) => ({ px, weight, ...Ink(px, weight, text) })),
          );

    return { table, probes };
  },
  {
    fontB64: readFileSync(FONT).toString("base64"),
    sizes: SIZES,
    weights: WEIGHTS,
    probe,
  },
);

await browser.close();

console.log("Geist Variable — alto de tinta en px de rasterizado\n");
console.log("size |  400      |  500      |  600      |  700");
console.log("     | cap   x   | cap   x   | cap   x   | cap   x");
for (const px of SIZES) {
  const cells = WEIGHTS.map((w) => {
    const r = data.table.find((q) => q.px === px && q.weight === w);
    return `${String(r.cap).padStart(3)} ${String(r.x).padStart(3)}`;
  });
  console.log(`${String(px).padStart(4)} | ${cells.join("   | ")}`);
}
console.log(
  "\nEl par (cap, x) desambigua: (7,5)=10 (8,6)=11 (9,6)=12 (9,7)=13 (10,8)=14 (11,9)=16",
);

if (probe !== "") {
  console.log(`\nAnchos de tinta de «${probe}» (compara con el ancho medido en el PNG):\n`);
  console.log("size |  400 |  500 |  600 |  700");
  for (const px of SIZES) {
    const cells = WEIGHTS.map((w) => {
      const r = data.probes.find((q) => q.px === px && q.weight === w);
      return String(r.w).padStart(4);
    });
    console.log(`${String(px).padStart(4)} | ${cells.join(" | ")}`);
  }
}

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "type-scale.json"), `${JSON.stringify(data.table, null, 1)}\n`);
console.log(`\ntabla -> ${join(OUT, "type-scale.json")}`);
