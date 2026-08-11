"use client";

import { useMemo, useState, type ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";
import { Button } from "../Button/Button.js";
import { ButtonCopy } from "../ButtonCopy/ButtonCopy.js";
import { Text } from "../Text/Text.js";

import * as styles from "./CodeHighlight.css.js";
import * as code_highlight_vars from "./CodeHighlight.vars.css.js";
import { CODE_HIGHLIGHT_LABELS } from "./labels.js";
import type { CodeHighlightProps } from "./CodeHighlight.types.js";

const COLLAPSED = 240;

export function LineNumbers(source: string, first: number): string {
  const total = source.split("\n").length;
  const lines: string[] = [];
  for (let index = 0; index < total; index += 1) lines.push(String(first + index));
  return lines.join("\n");
}

export function CodeHighlight(props: CodeHighlightProps): ReactElement {
  const {
    code,
    html,
    lang,
    filename,
    variant,
    color = "primary",
    glass = "subtle",
    expandable = false,
    collapsedHeight = COLLAPSED,
    withLineNumbers = false,
    withCopy = true,
    firstLine = 1,
    maxHeight,
    labels,
    className,
    headerProps,
    filenameProps,
    floatingCopyProps,
    copyProps,
    preProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const text = useMemo(
    () => (labels === undefined ? CODE_HIGHLIGHT_LABELS : { ...CODE_HIGHLIGHT_LABELS, ...labels }),
    [labels],
  );

  const { theme } = useTheme();
  const [open, set_open] = useState(false);

  const plain = code ?? "";
  const resolved =
    variant === undefined ? null : ResolveVariant(variant, color, theme, undefined, glass);

  const folded = expandable && !open;
  const ceiling = folded ? collapsedHeight : maxHeight;

  const css_vars = assignInlineVars({
    [code_highlight_vars.scrollHeight]: ceiling === undefined ? "none" : LengthToCss(ceiling),
    ...(resolved === null
      ? {}
      : {
          [code_highlight_vars.bg]: resolved.background,
          [code_highlight_vars.fg]: resolved.foreground,
          [code_highlight_vars.borderColor]: resolved.borderColor,
          [code_highlight_vars.backdropFilter]: resolved.backdropFilter,
        }),
  });

  const has_header = filename !== undefined || lang !== undefined;
  const copy_value = plain === "" && html !== undefined ? StripTags(html) : plain;
  const dressed = resolved !== null;

  return (
    <div
      className={cx(styles.root({ dressed }), sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      data-lang={lang}
      {...rest}
    >
      {has_header ? (
        <Box {...headerProps} className={cx(styles.header({ dressed }), headerProps?.className)}>
          <Text inherit component="span" {...filenameProps}>
            {filename ?? lang}
          </Text>
          {withCopy ? (
            <ButtonCopy
              value={copy_value}
              size="xs"
              variant="ghost"
              copyLabel={text.copy}
              copiedLabel={text.copied}
              {...copyProps}
            />
          ) : null}
        </Box>
      ) : withCopy ? (
        <Box
          {...floatingCopyProps}
          className={cx(styles.floating_copy, floatingCopyProps?.className)}
        >
          <ButtonCopy
            value={copy_value}
            size="xs"
            variant="ghost"
            copyLabel={text.copy}
            copiedLabel={text.copied}
            {...copyProps}
          />
        </Box>
      ) : null}

      <div className={styles.scroll}>
        <pre
          tabIndex={0}
          aria-label={text.region(lang)}
          {...preProps}
          className={cx(styles.pre, preProps?.className)}
        >
          {withLineNumbers ? (
            <span className={styles.gutter} aria-hidden="true">
              {LineNumbers(html === undefined ? plain : StripTags(html), firstLine)}
            </span>
          ) : null}
          {html === undefined ? (
            <code className={styles.source}>{plain}</code>
          ) : (
            <code className={styles.source} dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </pre>
      </div>

      {expandable ? (
        <Box className={styles.fold} data-open={open ? "true" : undefined}>
          <Button
            size="xs"
            variant="glass"
            r="full"
            className={styles.fold_button}
            aria-expanded={open}
            onPress={() => {
              set_open((value) => !value);
            }}
          >
            {open ? text.collapse : text.expand}
          </Button>
        </Box>
      ) : null}
    </div>
  );
}

const TAG = /<[^>]*>/g;
const ENTITY: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

export function StripTags(markup: string): string {
  return markup
    .replace(TAG, "")
    .replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, (match) => ENTITY[match] ?? match);
}

CodeHighlight.displayName = "CodeHighlight";
