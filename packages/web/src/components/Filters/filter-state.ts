import type { FilterAccessors, FilterState, FilterValue } from "./Filters.types.js";

export function StateAccessors(
  state: FilterState,
  set: (next: FilterState) => void,
): FilterAccessors {
  return {
    value: (key) => {
      const found = state[key];
      if (found === undefined) return undefined;
      return typeof found === "string" ? found : found[0];
    },
    values: (key) => {
      const found = state[key];
      if (found === undefined) return undefined;
      return typeof found === "string" ? [found] : found;
    },
    onSet: (key, value) => {
      set({ ...state, [key]: value });
    },
    onDelete: (key) => {
      const next = { ...state };
      delete next[key];
      set(next);
    },
  };
}

export function IsActive(accessors: FilterAccessors, key: string): boolean {
  const single = accessors.value(key);
  if (single !== undefined && single !== "") return true;
  const many = accessors.values(key);
  return many !== undefined && many.length > 0 && many.some((entry) => entry !== "");
}

export function ActiveCount(accessors: FilterAccessors, keys: readonly string[]): number {
  return keys.filter((key) => IsActive(accessors, key)).length;
}

export function RangeParts(raw: string | undefined): [string, string] {
  if (raw === undefined) return ["", ""];
  const [from = "", to = ""] = raw.split("..");
  return [from, to];
}

export function JoinRange(from: string, to: string): FilterValue {
  return from === "" && to === "" ? "" : `${from}..${to}`;
}
