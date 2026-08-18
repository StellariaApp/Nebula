import type { ThemeSchemes } from "../registry.js";

import { grafitoDark } from "./dark.js";
import { grafitoLight } from "./light.js";

export { grafitoDark, grafitoLight };

export const grafito: ThemeSchemes = { dark: grafitoDark, light: grafitoLight };
