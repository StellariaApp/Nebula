import type { ThemeSchemes } from "../registry.js";

import { sunDark } from "./dark.js";
import { sunLight } from "./light.js";

export { sunDark, sunLight };

export const sol: ThemeSchemes = { dark: sunDark, light: sunLight };
