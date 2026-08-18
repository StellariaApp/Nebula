import type { ThemeSchemes } from "../registry.js";

import { antaresDark } from "./dark.js";
import { antaresLight } from "./light.js";

export { antaresDark, antaresLight };

export const antares: ThemeSchemes = { dark: antaresDark, light: antaresLight };
