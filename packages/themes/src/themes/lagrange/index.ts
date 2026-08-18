import type { ThemeSchemes } from "../registry.js";

import { lagrangeDark } from "./dark.js";
import { lagrangeLight } from "./light.js";

export { lagrangeDark, lagrangeLight };

export const lagrange: ThemeSchemes = { dark: lagrangeDark, light: lagrangeLight };
