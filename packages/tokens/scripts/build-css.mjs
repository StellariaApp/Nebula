import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { BuildTokensCss } from "../dist/css/index.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, process.argv[2] ?? "dist/tokens.css");

await mkdir(dirname(out), { recursive: true });
await writeFile(out, BuildTokensCss());
