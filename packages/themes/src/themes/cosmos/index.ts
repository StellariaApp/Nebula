import type { ThemeSchemes } from "../registry.js";

import { cosmosDark } from "./dark.js";
import { cosmosLight } from "./light.js";

export { cosmosDark, cosmosLight };

export const cosmos: ThemeSchemes = { dark: cosmosDark, light: cosmosLight };
