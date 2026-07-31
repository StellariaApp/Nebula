import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright-core";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, "../..");
const DIR = join(ROOT, ".figma");
const OUT = join(ROOT, "docs/reviews/figma-baseline");

const CHROME =
  process.env.FIGMA_MEASURE_CHROME ??
  join(process.env.LOCALAPPDATA ?? "", "ms-playwright/chromium-1228/chrome-win64/chrome.exe");

const only = process.argv.slice(2);
const files = (only.length > 0 ? only : readdirSync(DIR)).filter((f) => f.endsWith(".png"));

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage();

const result = {};

for (const file of files) {
  const b64 = readFileSync(join(DIR, file)).toString("base64");
  result[file.replace(/\.png$/, "")] = await page.evaluate(
    async (src) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const { data: px } = ctx.getImageData(0, 0, c.width, c.height);
      const W = c.width;
      const H = c.height;
      const RGB = (x, y) => {
        const i = (y * W + x) * 4;
        return [px[i], px[i + 1], px[i + 2]];
      };
      const isPurple = (p) => p[2] > 180 && p[0] > 90 && p[0] < 190 && p[1] < 110;

      let x0 = W;
      let y0 = H;
      let x1 = -1;
      let y1 = -1;
      for (let y = 0; y < H; y += 1)
        for (let x = 0; x < W; x += 1) {
          if (!isPurple(RGB(x, y))) continue;
          if (x < x0) x0 = x;
          if (y < y0) y0 = y;
          if (x > x1) x1 = x;
          if (y > y1) y1 = y;
        }
      const chrome = x1 < 0 ? null : { top: y0, left: x0 };
      const [fx0, fy0, fx1, fy1] =
        x1 < 0 ? [0, 0, W - 1, H - 1] : [x0 + 1, y0 + 1, x1 - 1, y1 - 1];

      const hist = new Map();
      for (let y = fy0; y <= fy1; y += 1)
        for (let x = fx0; x <= fx1; x += 1) {
          const k = RGB(x, y).join(",");
          hist.set(k, (hist.get(k) ?? 0) + 1);
        }
      const area = (fx1 - fx0 + 1) * (fy1 - fy0 + 1);
      const boxes = [];
      for (const [k, n] of [...hist.entries()].sort((a, b) => b[1] - a[1]).slice(0, 16)) {
        if (n / area < 0.003) continue;
        const [r, g, b] = k.split(",").map(Number);
        let bx0 = W;
        let by0 = H;
        let bx1 = -1;
        let by1 = -1;
        let rows = 0;
        for (let y = fy0; y <= fy1; y += 1) {
          let inRow = false;
          for (let x = fx0; x <= fx1; x += 1) {
            const p = RGB(x, y);
            if (p[0] !== r || p[1] !== g || p[2] !== b) continue;
            inRow = true;
            if (x < bx0) bx0 = x;
            if (y < by0) by0 = y;
            if (x > bx1) bx1 = x;
            if (y > by1) by1 = y;
          }
          if (inRow) rows += 1;
        }
        boxes.push({
          rgb: k,
          pct: +((100 * n) / area).toFixed(1),
          w: bx1 - bx0 + 1,
          h: by1 - by0 + 1,
          x: bx0 - fx0,
          y: by0 - fy0,
          rows,
        });
      }
      return { img: { w: W, h: H }, chrome, inner: { w: fx1 - fx0 + 1, h: fy1 - fy0 + 1 }, boxes };
    },
    `data:image/png;base64,${b64}`,
  );
}

await browser.close();
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "measurements.json"), `${JSON.stringify(result, null, 1)}\n`);

const chromeTops = new Map();
for (const [name, d] of Object.entries(result)) {
  const k = d.chrome ? String(d.chrome.top) : "sin-marco";
  chromeTops.set(k, [...(chromeTops.get(k) ?? []), name]);
}

console.log(`medidas de ${Object.keys(result).length} hojas -> ${join(OUT, "measurements.json")}`);
console.log("\nfirma del cromo de Figma (margen superior hasta la línea magenta):");
for (const [top, names] of [...chromeTops.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${String(top).padStart(9)} px  ->  ${names.length} hojas`);
  if (names.length <= 4) console.log(`             ${names.join(", ")}`);
}
