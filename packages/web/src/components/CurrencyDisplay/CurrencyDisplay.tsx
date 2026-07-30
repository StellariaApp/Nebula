"use client";

import type { ReactElement } from "react";

import { useLocale } from "react-aria";

import { Skeleton } from "../Skeleton/Skeleton.js";
import { Text } from "../Text/Text.js";

import { FormatCurrency, ToAmount } from "./currency-display-format.js";
import type { CurrencyDisplayProps } from "./CurrencyDisplay.types.js";

export function CurrencyDisplay(props: CurrencyDisplayProps): ReactElement {
  const {
    amount,
    currency = "USD",
    locale: locale_prop,
    decimals,
    sign = "auto",
    compact = false,
    hideSymbol = false,
    prefix,
    suffix,
    transform,
    colorBySign = false,
    loading = false,
    fallback = "—",
    component = "span",
    ...text_rest
  } = props;

  const { locale: ambient } = useLocale();
  const locale = locale_prop ?? ambient;

  if (loading) return <Skeleton width="6ch" height="1em" />;

  const value = ToAmount(amount);
  if (value === null) {
    return (
      <Text component={component} {...text_rest}>
        {fallback}
      </Text>
    );
  }

  const formatted = FormatCurrency({
    amount: value,
    locale,
    currency,
    decimals,
    sign,
    compact,
    hideSymbol,
  });

  const tone = colorBySign && value !== 0 ? (value > 0 ? "success.600" : "error.600") : undefined;

  return (
    <Text component={component} {...text_rest} {...(tone === undefined ? {} : { c: tone })}>
      {prefix}
      {transform === undefined ? formatted : transform(formatted)}
      {suffix}
    </Text>
  );
}

CurrencyDisplay.displayName = "CurrencyDisplay";
