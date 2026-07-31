import type { ReactNode } from "react";

import type { SelectOption } from "../../collections/options.js";
import type { StyleProps } from "../../utils/style-props.js";

export interface TransferListLabels {
  add: string;
  addAll: string;
  remove: string;
  removeAll: string;
  search: string;
  empty: string;
  count: (selected: number, total: number) => string;
}

export interface TransferListPane {
  title?: ReactNode | undefined;
  empty?: ReactNode | undefined;
}

export interface TransferListProps extends Omit<StyleProps, "color"> {
  data: readonly SelectOption[];
  value?: readonly string[] | undefined;
  defaultValue?: readonly string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  source?: TransferListPane | undefined;
  target?: TransferListPane | undefined;
  searchable?: boolean | undefined;
  height?: number | undefined;
  disabled?: boolean | undefined;
  labels?: Partial<TransferListLabels> | undefined;
  className?: string | undefined;
}
