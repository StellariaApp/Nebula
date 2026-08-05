import { GridCol } from "./components/Col.js";
import { Grid as GridRoot } from "./Grid.js";

export const Grid = /* @__PURE__ */ Object.assign(GridRoot, { Col: GridCol });

export { GridCol };
export type {
  ColSpan,
  GridColOwnProps,
  GridColProps,
  GridOwnProps,
  GridProps,
} from "./Grid.types.js";
