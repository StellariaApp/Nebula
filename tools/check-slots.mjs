import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = resolve(process.argv[2] ?? join(REPO, "packages/web/src"));

const SLOT_SPREAD = /\{\.\.\.[\w$.?]*\b([a-z][\w$]*Props)\b/;
const TYPE_MEMBER = /^\s*(?:\/\*\*[\s\S]*?\*\/\s*)?([a-z][\w$]*Props)\??\s*:/gm;

function Sources(dir, out = { tsx: [], types: [] }) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      Sources(path, out);
    } else if (path.endsWith(".types.ts")) {
      out.types.push(path);
    } else if (path.endsWith(".tsx") && !path.includes("__tests__")) {
      out.tsx.push(path);
    }
  }
  return out;
}

function OpenTags(source) {
  const tags = [];
  for (let index = 0; index < source.length; index += 1) {
    if (source[index] !== "<") continue;
    if (!/[A-Za-z]/.test(source[index + 1] ?? "")) continue;
    let depth = 0;
    let end = -1;
    for (let scan = index + 1; scan < source.length; scan += 1) {
      const char = source[scan];
      if (char === "{") depth += 1;
      else if (char === "}") depth -= 1;
      else if (depth === 0 && char === ">") {
        end = scan;
        break;
      } else if (depth === 0 && char === "<") break;
    }
    if (end === -1) continue;
    tags.push({ text: source.slice(index, end + 1), at: index });
    index = end;
  }
  return tags;
}

function Line(source, at) {
  return source.slice(0, at).split("\n").length;
}

function CheckOrder(files) {
  const problems = [];
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    for (const tag of OpenTags(source)) {
      const spread = tag.text.search(SLOT_SPREAD);
      const klass = tag.text.indexOf("className=");
      if (spread === -1 || klass === -1 || klass > spread) continue;
      problems.push(`${relative(REPO, file)}:${String(Line(source, tag.at))}`);
    }
  }
  return problems;
}

const TYPES_IMPORT = /from\s+"([^"]*\.types\.js)"/g;

function CheckWired(types, tsx) {
  const byDir = new Map();
  const byContract = new Map();

  for (const file of tsx) {
    const source = readFileSync(file, "utf8");
    byDir.set(dirname(file), (byDir.get(dirname(file)) ?? "") + source);
    for (const found of source.matchAll(TYPES_IMPORT)) {
      const target = resolve(dirname(file), found[1]).replace(/\.js$/, ".ts");
      byContract.set(target, (byContract.get(target) ?? "") + source);
    }
  }

  const problems = [];
  for (const file of types) {
    let reachable = byContract.get(file) ?? "";
    const dir = dirname(file);
    reachable += byDir.get(dir) ?? "";
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) reachable += byDir.get(path) ?? "";
    }

    const source = readFileSync(file, "utf8");
    for (const member of source.matchAll(TYPE_MEMBER)) {
      const name = member[1];
      const spread = new RegExp(`\\{\\.\\.\\.[\\w$.?]*\\b${name}\\b`);
      const shorthand = new RegExp(`\\{\\s*${name}\\s*\\}`);
      const forwarded = new RegExp(`=\\{[\\w$?.]*\\b${name}\\s*\\}`);
      if (spread.test(reachable) || shorthand.test(reachable) || forwarded.test(reachable)) {
        continue;
      }
      problems.push(`${relative(REPO, file)}:${String(Line(source, member.index))}  ${name}`);
    }
  }
  return problems;
}

const files = Sources(ROOT);
const order = CheckOrder(files.tsx);
const wired = CheckWired(files.types, files.tsx);

if (order.length > 0) {
  console.error(`className antes del esparcido de la ranura (${String(order.length)}):`);
  for (const problem of order) console.error(`  ${problem}`);
}

if (wired.length > 0) {
  console.error(`ranuras declaradas y nunca esparcidas (${String(wired.length)}):`);
  for (const problem of wired) console.error(`  ${problem}`);
}

if (order.length + wired.length === 0) {
  console.log(
    `ranuras ok — ${String(files.tsx.length)} componentes, ${String(files.types.length)} contratos`,
  );
  process.exit(0);
}

process.exit(1);
