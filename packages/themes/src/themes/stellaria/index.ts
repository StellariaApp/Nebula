import type { ThemeSchemes } from "../registry.js";

import { stellariaDark } from "./dark.js";
import { stellariaLight } from "./light.js";

export { stellariaDark, stellariaLight };

export const stellaria: ThemeSchemes = { dark: stellariaDark, light: stellariaLight };
