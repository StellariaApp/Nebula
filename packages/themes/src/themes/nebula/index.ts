import type { ThemeSchemes } from "../registry.js";

import { nebulaDark } from "./dark.js";
import { nebulaLight } from "./light.js";

export { nebulaDark, nebulaLight };

export const nebula: ThemeSchemes = { dark: nebulaDark, light: nebulaLight };
