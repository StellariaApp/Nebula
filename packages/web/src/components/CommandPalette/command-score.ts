const EXACT = 1000;
const PREFIX = 500;
const WORD_START = 250;
const CONTAINS = 100;
const SEQUENTIAL = 10;

function Normalize(value: string): string {
  return value.toLocaleLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function Subsequence(haystack: string, needle: string): number {
  let score = 0;
  let cursor = 0;
  let streak = 0;

  for (const letter of needle) {
    const at = haystack.indexOf(letter, cursor);
    if (at === -1) return 0;
    streak = at === cursor ? streak + 1 : 0;
    score += SEQUENTIAL + streak * SEQUENTIAL;
    cursor = at + 1;
  }

  return score;
}

export function CommandScore(haystack: string, needle: string): number {
  if (needle === "") return 1;

  const target = Normalize(haystack);
  const query = Normalize(needle);

  if (target === query) return EXACT;
  if (target.startsWith(query)) return PREFIX;

  const words = target.split(/[\s\-_./]+/);
  if (words.some((word) => word.startsWith(query))) return WORD_START;
  if (target.includes(query)) return CONTAINS;

  return Subsequence(target, query);
}

export function BestScore(haystacks: readonly string[], needle: string): number {
  let best = 0;
  for (const entry of haystacks) {
    const score = CommandScore(entry, needle);
    if (score > best) best = score;
  }
  return best;
}
