"use client";

import { useMemo, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";
import { ButtonCopy } from "../ButtonCopy/ButtonCopy.js";
import { Text } from "../Text/Text.js";

import * as styles from "./CodeHighlight.css.js";
import * as code_highlight_vars from "./CodeHighlight.vars.css.js";
import { CODE_HIGHLIGHT_LABELS } from "./labels.js";
import type { CodeHighlightProps } from "./CodeHighlight.types.js";

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

  const plain = code ?? "";
  const css_vars = assignInlineVars({
    [code_highlight_vars.scrollHeight]: maxHeight === undefined ? "none" : LengthToCss(maxHeight),
  });

  const has_header = filename !== undefined || lang !== undefined;
  const copy_value = plain === "" && html !== undefined ? StripTags(html) : plain;

  return (
    <div
      className={cx(styles.root, sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      data-lang={lang}
      {...rest}
    >
      {has_header ? (
        <Box {...headerProps} className={cx(styles.header, headerProps?.className)}>
          <Text component="span" {...filenameProps}>
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
