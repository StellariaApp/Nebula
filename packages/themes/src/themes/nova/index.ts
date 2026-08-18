import type { ThemeSchemes } from "../registry.js";

import { novaDark } from "./dark.js";
import { novaLight } from "./light.js";

export { novaDark, novaLight };

export const nova: ThemeSchemes = { dark: novaDark, light: novaLight };
