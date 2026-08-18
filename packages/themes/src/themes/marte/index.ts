import type { ThemeSchemes } from "../registry.js";

import { antaresDark } from "./dark.js";
import { antaresLight } from "./light.js";

export { antaresDark, antaresLight };

export const marte: ThemeSchemes = { dark: antaresDark, light: antaresLight };
