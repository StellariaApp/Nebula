import { createContext } from "react";

import type { StatusMap } from "./StatusBadge.types.js";

export const StatusMapContext = createContext<StatusMap | null>(null);
StatusMapContext.displayName = "NebulaStatusMapContext";
