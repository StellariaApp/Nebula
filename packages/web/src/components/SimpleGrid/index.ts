import { SimpleGridCell } from "./components/Cell.js";
import { SimpleGrid as SimpleGridRoot } from "./SimpleGrid.js";

export const SimpleGrid = /* @__PURE__ */ Object.assign(SimpleGridRoot, { Cell: SimpleGridCell });

export { SimpleGridCell };
export type {
  SimpleGridCellOwnProps,
  SimpleGridCellProps,
  SimpleGridCols,
  SimpleGridOwnProps,
  SimpleGridProps,
  SimpleGridResponsive,
  SimpleGridSpan,
} from "./SimpleGrid.types.js";
