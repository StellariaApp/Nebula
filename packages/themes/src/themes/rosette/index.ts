import type { ThemeSchemes } from "../registry.js";

import { rosetteDark } from "./dark.js";
import { rosetteLight } from "./light.js";

export { rosetteDark, rosetteLight };

export const rosette: ThemeSchemes = { dark: rosetteDark, light: rosetteLight };
