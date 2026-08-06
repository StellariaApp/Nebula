import {
  TableBody,
  TableCell,
  TableFoot,
  TableHead,
  TableRoot,
  TableRow,
  TableScrollContainer,
  TableTitle,
} from "./Table.js";

export const Table = /* @__PURE__ */ Object.assign(TableRoot, {
  Head: TableHead,
  Body: TableBody,
  Foot: TableFoot,
  Row: TableRow,
  Title: TableTitle,
  Cell: TableCell,
  ScrollContainer: TableScrollContainer,
});

export { TableBody, TableCell, TableFoot, TableHead, TableRow, TableScrollContainer, TableTitle };
export type {
  TableAlign,
  TableCellProps,
  TableProps,
  TableRowProps,
  TableScrollProps,
  TableSectionProps,
} from "./Table.types.js";
