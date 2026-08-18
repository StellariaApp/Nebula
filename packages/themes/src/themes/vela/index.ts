import type { ThemeSchemes } from "../registry.js";

import { velaDark } from "./dark.js";
import { velaLight } from "./light.js";

export { velaDark, velaLight };

export const vela: ThemeSchemes = { dark: velaDark, light: velaLight };
