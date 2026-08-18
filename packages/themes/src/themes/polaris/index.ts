import type { ThemeSchemes } from "../registry.js";

import { polarisDark } from "./dark.js";
import { polarisLight } from "./light.js";

export { polarisDark, polarisLight };

export const polaris: ThemeSchemes = { dark: polarisDark, light: polarisLight };
