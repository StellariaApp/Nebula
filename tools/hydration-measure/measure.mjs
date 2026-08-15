import { chromium } from "playwright-core";

const BASE = process.env.NEBULA_URL ?? "http://127.0.0.1:3000";
const ROUTES = (process.env.NEBULA_ROUTES ?? "/").split(",");
const RUNS = Number(process.env.NEBULA_RUNS ?? "7");
const CPU = Number(process.env.NEBULA_CPU ?? "4");
const SETTLE = Number(process.env.NEBULA_SETTLE ?? "4000");

/**
 * Las primeras pasadas miden el arranque del proceso, no la pagina: cache de codigo de V8 fria,
 * `next start` sirviendo un chunk por primera vez y el propio Chromium calentando. Medidas, esas
 * pasadas metian una dispersion del 98 % en `/changelog` y hacian el instrumento inservible.
 */
const WARMUP = Number(process.env.NEBULA_WARMUP ?? "3");
const JSON_OUT = process.env.NEBULA_JSON === "1";

const PROBE = () => {
  const state = { longtasks: [], fcp: null, lcp: null };
  window.__nebula = state;

  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      state.longtasks.push({ start: entry.startTime, duration: entry.duration });
    }
  }).observe({ type: "longtask", buffered: true });

  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === "first-contentful-paint") state.fcp = entry.startTime;
    }
  }).observe({ type: "paint", buffered: true });

  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    state.lcp = entries[entries.length - 1]?.startTime ?? state.lcp;
  }).observe({ type: "largest-contentful-paint", buffered: true });
};

const COLLECT = () => {
  const state = window.__nebula;
  const nav = performance.getEntriesByType("navigation")[0];
  return {
    fcp: state.fcp,
    lcp: state.lcp,
    longtasks: state.longtasks,
    domContentLoaded: nav?.domContentLoadedEventEnd ?? null,
    load: nav?.loadEventEnd ?? null,
  };
};

/** TBT de Lighthouse: lo que cada tarea larga excede de 50 ms, contado solo despues del FCP. */
function BlockingTime(longtasks, fcp) {
  const floor = fcp ?? 0;
  return longtasks
    .filter((task) => task.start + task.duration > floor)
    .reduce((total, task) => {
      const overlap = task.duration - Math.max(0, floor - task.start);
      return total + Math.max(0, Math.min(overlap, task.duration) - 50);
    }, 0);
}

function Stats(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const At = (q) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
  const median = At(0.5);
  const spread = sorted.length < 2 ? 0 : ((At(0.75) - At(0.25)) / (median || 1)) * 100;
  return { median, min: sorted[0], max: sorted[sorted.length - 1], spread };
}

async function Launch() {
  const path = process.env.NEBULA_CHROME;
  if (path !== undefined) return chromium.launch({ executablePath: path });
  try {
    return await chromium.launch({ channel: "chrome" });
  } catch {
    return chromium.launch();
  }
}

async function Run(browser, url) {
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36",
  });

  const page = await context.newPage();
  const client = await context.newCDPSession(page);
  await client.send("Performance.enable");
  await client.send("Emulation.setCPUThrottlingRate", { rate: CPU });
  await page.addInitScript(PROBE);

  await page.goto(url, { waitUntil: "load", timeout: 60_000 });
  await page.waitForTimeout(SETTLE);

  const raw = await page.evaluate(COLLECT);
  const { metrics } = await client.send("Performance.getMetrics");
  const Cpu = (name) => (metrics.find((m) => m.name === name)?.value ?? 0) * 1000;
  await context.close();

  return {
    script: Cpu("ScriptDuration"),
    layout: Cpu("LayoutDuration"),
    recalc: Cpu("RecalcStyleDuration"),
    task: Cpu("TaskDuration"),
    fcp: raw.fcp,
    lcp: raw.lcp,
    tbt: BlockingTime(raw.longtasks, raw.fcp),
    longtaskTime: raw.longtasks.reduce((n, t) => n + t.duration, 0),
    longtaskCount: raw.longtasks.length,
    load: raw.load,
  };
}

const KEYS = [
  ["script", "CPU script"],
  ["task", "CPU tareas"],
  ["recalc", "CPU recalc estilo"],
  ["layout", "CPU layout"],
  ["tbt", "TBT"],
  ["longtaskTime", "tareas largas (ms)"],
  ["longtaskCount", "tareas largas (n)"],
  ["fcp", "FCP"],
  ["lcp", "LCP"],
  ["load", "load"],
];

async function Main() {
  const browser = await Launch();
  const report = {};

  for (const route of ROUTES) {
    const url = `${BASE}${route}`;
    for (let i = 0; i < WARMUP; i += 1) await Run(browser, url);

    const runs = [];
    for (let i = 0; i < RUNS; i += 1) runs.push(await Run(browser, url));

    const stats = {};
    for (const [key] of KEYS) stats[key] = Stats(runs.map((r) => r[key] ?? 0));
    report[route] = { url, runs: RUNS, warmup: WARMUP, cpu: CPU, stats };

    if (JSON_OUT) continue;
    console.log(
      `\n${url}  ·  ${String(RUNS)} pasadas (+${String(WARMUP)} de calentamiento)  ·  CPU ×${String(CPU)}`,
    );
    for (const [key, label] of KEYS) {
      const s = stats[key];
      console.log(
        `  ${label.padEnd(20)} ${s.median.toFixed(0).padStart(6)}   ` +
          `[${s.min.toFixed(0)}–${s.max.toFixed(0)}]  dispersion ${s.spread.toFixed(0)}%`,
      );
    }
  }

  await browser.close();
  if (JSON_OUT) console.log(JSON.stringify(report, null, 2));
}

await Main();
