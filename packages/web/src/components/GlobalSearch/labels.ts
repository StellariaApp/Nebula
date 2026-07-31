import type { GlobalSearchLabels } from "./GlobalSearch.types.js";

export const GLOBAL_SEARCH_LABELS: GlobalSearchLabels = {
  trigger: "Buscar",
  input: "Búsqueda global",
  placeholder: "Busca en toda la aplicación…",
  empty: "Sin resultados",
  loading: "Buscando…",
  recent: "Recientes",
  results: (count) =>
    count === 0 ? "Sin resultados" : `${String(count)} resultado${count === 1 ? "" : "s"}`,
  shortcut: "Ctrl K",
};
