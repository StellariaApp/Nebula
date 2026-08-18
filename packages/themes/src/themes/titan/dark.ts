import type { NebulaTheme } from "@stellaria/nebula-tokens";

import { BuildProduct } from "../../utils/build-product.js";
import { THEMES_SEEDS } from "../_seed/index.js";

export const titanDark: NebulaTheme = BuildProduct(THEMES_SEEDS.titan, "dark");
