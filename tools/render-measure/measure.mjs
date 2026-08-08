import { chromium } from "playwright-core";

const BASE = process.env.NEBULA_SB_URL ?? "http://127.0.0.1:6011/iframe.html";
const THEMES = (process.env.NEBULA_THEMES ?? "dark,light").split(",");

function Srgb(channel) {
  const v = channel / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

export function ParseColor(value) {
  const match = /rgba?\(([^)]+)\)/.exec(value ?? "");
  if (!match) return null;
  const parts = match[1].split(",").map((piece) => Number(piece.trim()));
  if (parts.length === 4 && parts[3] === 0) return null;
  return parts;
}

export function Luminance(value) {
  const parts = ParseColor(value);
  if (parts === null) return null;
  return 0.2126 * Srgb(parts[0]) + 0.7152 * Srgb(parts[1]) + 0.0722 * Srgb(parts[2]);
}

export function Ratio(a, b) {
  const la = Luminance(a);
  const lb = Luminance(b);
  if (la === null || lb === null) return null;
  return Number(((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)).toFixed(3));
}

async function Measure(page, storyId, theme, selector) {
  await page.goto(`${BASE}?id=${storyId}&globals=theme:${theme}`, { waitUntil: "networkidle" });
  return page.evaluate((sel) => {
    const rows = [];
    for (const node of document.querySelectorAll(sel)) {
      const box = node.getBoundingClientRect();
      if (box.height === 0) continue;
      const style = getComputedStyle(node);
      const after = getComputedStyle(node, "::after");
      const names = (typeof node.className === "string" ? node.className : "").split(/\s+/);
      const owned = names.filter((name) => /^[A-Z]\w*_/.test(name) && !name.startsWith("Box_"));
      const cls = owned[0] ?? names.find((name) => /_/.test(name));
      rows.push({
        cls: (cls ?? node.tagName.toLowerCase()).replace(/__.*$/, ""),
        height: Math.round(box.height * 10) / 10,
        width: Math.round(box.width * 10) / 10,
        fontSize: style.fontSize,
        background: style.backgroundColor,
        backgroundImage:
          style.backgroundImage === "none" ? null : style.backgroundImage.slice(0, 60),
        color: style.color,
        borderTop: `${style.borderTopWidth} ${style.borderTopStyle} ${style.borderTopColor}`,
        shadow: style.boxShadow === "none" ? null : style.boxShadow.slice(0, 60),
        radius: style.borderTopLeftRadius,
        zIndex: style.zIndex,
        opacity: style.opacity,
        hitMinWidth: after.content === "none" ? null : after.minWidth,
        parentBackground: node.parentElement
          ? getComputedStyle(node.parentElement).backgroundColor
          : null,
      });
    }
    return rows;
  }, selector);
}

const [storyId, selector] = process.argv.slice(2);

if (storyId === undefined || selector === undefined) {
  console.error("uso: node measure.mjs <story-id> <selector-css>");
  console.error("ej.:  node measure.mjs layout-paper--composition \"[class*='Paper_paper']\"");
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1100 } });

for (const theme of THEMES) {
  const rows = await Measure(page, storyId, theme, selector);
  console.log(`\n===== ${theme} =====`);
  for (const row of rows) {
    const against =
      row.parentBackground !== null && row.parentBackground !== "rgba(0, 0, 0, 0)"
        ? row.parentBackground
        : null;
    const ratio = against === null ? null : Ratio(row.background, against);
    console.log(
      `  ${row.cls.padEnd(26)} h=${String(row.height).padStart(6)} fs=${row.fontSize.padStart(7)} bg=${String(row.background).padEnd(24)}${ratio === null ? "" : ` ratio=${ratio}`}`,
    );
    if (row.backgroundImage !== null) console.log(`      bg-image: ${row.backgroundImage}`);
    if (row.hitMinWidth !== null) console.log(`      ::after min-width: ${row.hitMinWidth}`);
  }
}

await browser.close();
