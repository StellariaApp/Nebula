import type { ThemeSchemes } from "../registry.js";

import { titanDark } from "./dark.js";
import { titanLight } from "./light.js";

export { titanDark, titanLight };

export const titan: ThemeSchemes = { dark: titanDark, light: titanLight };
