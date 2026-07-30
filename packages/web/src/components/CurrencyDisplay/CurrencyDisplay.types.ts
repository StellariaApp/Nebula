import type { ReactNode } from "react";

import type { TextOwnProps } from "../Text/Text.types.js";

export type CurrencySign = "auto" | "always" | "never" | "accounting";

export interface CurrencyDisplayProps extends Omit<TextOwnProps, "children"> {
  amount?: number | string | null | undefined;
  currency?: string | undefined;
  locale?: string | undefined;
  decimals?: number | undefined;
  sign?: CurrencySign | undefined;
  compact?: boolean | undefined;
  hideSymbol?: boolean | undefined;
  prefix?: ReactNode | undefined;
  suffix?: ReactNode | undefined;
  transform?: ((formatted: string) => string) | undefined;
  colorBySign?: boolean | undefined;
  loading?: boolean | undefined;
  fallback?: ReactNode | undefined;
  className?: string | undefined;
}
