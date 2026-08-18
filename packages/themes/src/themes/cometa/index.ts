import type { ThemeSchemes } from "../registry.js";

import { limaDark } from "./dark.js";
import { limaLight } from "./light.js";

export { limaDark, limaLight };

export const cometa: ThemeSchemes = { dark: limaDark, light: limaLight };
