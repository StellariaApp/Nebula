import { BuildApi } from "./api.ts";
import { BuildCatalog } from "./catalog.ts";
import { BuildMeta } from "./metadata.ts";
import { Emit, Matches } from "./shared.ts";
import { BuildStyleProps } from "./style-props.ts";

const check = process.argv.includes("--check");

const artifacts: { file: string; payload: unknown }[] = [
  { file: "catalog.json", payload: BuildCatalog() },
  { file: "style-props.json", payload: await BuildStyleProps() },
  { file: "api.json", payload: await BuildApi() },
  { file: "metadata.json", payload: BuildMeta() },
];

let stale = 0;
for (const { file, payload } of artifacts) {
  if (check) {
    if (Matches(file, payload)) continue;
    console.error(`desfasado: ${file}`);
    stale += 1;
  } else {
    Emit(file, payload);
  }
}

if (check && stale > 0) {
  console.error("Lo generado no coincide con el codigo. Corre `pnpm gen:docs`.");
  process.exit(1);
}

console.log(
  check
    ? `generados ok — ${String(artifacts.length)} artefactos`
    : `escritos ${String(artifacts.length)} artefactos`,
);

for (const { file, payload } of artifacts) {
  const gaps = (payload as { gaps?: Record<string, string[]> }).gaps;
  if (gaps === undefined) continue;
  const declared = Object.entries(gaps).filter(([, list]) => list.length > 0);
  if (declared.length === 0) continue;
  console.log(
    `  ${file}: ${declared.map(([kind, list]) => `${kind}=${String(list.length)}`).join(" · ")}`,
  );
}
