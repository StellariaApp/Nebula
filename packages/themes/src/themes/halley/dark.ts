import type { NebulaTheme } from "@stellaria/nebula-tokens";

import { BuildProduct } from "../../utils/build-product.js";
import { THEMES_SEEDS } from "../_seed/index.js";

export const halleyDark: NebulaTheme = BuildProduct(THEMES_SEEDS.halley, "dark");
