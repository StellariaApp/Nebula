import type { ThemeSchemes } from "../registry.js";

import { halleyDark } from "./dark.js";
import { halleyLight } from "./light.js";

export { halleyDark, halleyLight };

export const halley: ThemeSchemes = { dark: halleyDark, light: halleyLight };
