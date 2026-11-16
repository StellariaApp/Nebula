export function cx(...values: (string | undefined | false)[]): string | undefined {
  let joined = "";
  for (const value of values) {
    if (typeof value !== "string" || value.length === 0) continue;
    joined = joined === "" ? value : `${joined} ${value}`;
  }
  return joined === "" ? undefined : joined;
}
