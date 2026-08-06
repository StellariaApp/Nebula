import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export interface GlobalSearchResult {
  id: string;
  title: string;
  description?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  group?: string | undefined;
  href?: string | undefined;
  onSelect?: (() => void) | undefined;
}

export interface GlobalSearchLabels {
  trigger: string;
  input: string;
  placeholder: string;
  empty: string;
  loading: string;
  recent: string;
  results: (count: number) => string;
  shortcut: string;
}

export interface GlobalSearchProps extends StyleProps {
  results: readonly GlobalSearchResult[];
  onQueryChange: (query: string) => void;
  onSelect?: ((result: GlobalSearchResult) => void) | undefined;
  opened?: boolean | undefined;
  onOpenChange?: ((opened: boolean) => void) | undefined;
  query?: string | undefined;
  loading?: boolean | undefined;
  debounce?: number | undefined;
  recent?: readonly GlobalSearchResult[] | undefined;
  withTrigger?: boolean | undefined;
  withShortcut?: boolean | undefined;
  empty?: ReactNode | undefined;
  labels?: Partial<GlobalSearchLabels> | undefined;
  className?: string | undefined;
}
