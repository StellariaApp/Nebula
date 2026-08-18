import type { ThemeSchemes } from "../registry.js";

import { auroraDark } from "./dark.js";
import { auroraLight } from "./light.js";

export { auroraDark, auroraLight };

export const aurora: ThemeSchemes = { dark: auroraDark, light: auroraLight };
