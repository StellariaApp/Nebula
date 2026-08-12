import type { GlobalSearchLabels } from "./GlobalSearch.types.js";

export const GLOBAL_SEARCH_LABELS: GlobalSearchLabels = {
  trigger: "Search",
  input: "Global search",
  placeholder: "Search the whole app…",
  empty: "No results",
  loading: "Searching…",
  recent: "Recent",
  results: (count) => (count === 0 ? "No results" : `${String(count)} result${count === 1 ? "" : "s"}`),
  shortcut: "Ctrl K",
};
