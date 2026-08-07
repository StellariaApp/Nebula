import fs from "node:fs";
import path from "node:path";

const ROOT = "c:/Users/Skr13/Documents/GitHub/Nebula/packages/web/src";

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "__tests__") walk(p, out);
    } else if (entry.name.endsWith(".tsx")) {
      out.push(p);
    }
  }
  return out;
}

const problems = [];

for (const file of walk(ROOT)) {
  const source = fs.readFileSync(file, "utf8");
  // recorre cada apertura de elemento JSX y mira dentro de ella
  for (const open of source.matchAll(/<[A-Za-z][\w.]*\s([^>]*?)\/?>/gs)) {
    const body = open[1];
    for (const spread of body.matchAll(/\{\.\.\.([a-zA-Z_]\w*Props)\}/g)) {
      const name = spread[1];
      const clsIndex = body.indexOf(`${name}?.className`);
      if (clsIndex < 0) continue;
      if (clsIndex < spread.index) {
        const line = source.slice(0, open.index).split("\n").length;
        problems.push(`${path.relative(ROOT, file)}:${line}  ${name}`);
      }
    }
  }
}

console.log("elementos con className ANTES del esparcido:", problems.length);
for (const p of problems) console.log("  " + p);
