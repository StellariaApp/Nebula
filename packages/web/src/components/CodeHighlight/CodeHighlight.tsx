"use client";

import { useMemo, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { ButtonCopy } from "../ButtonCopy/ButtonCopy.js";

import * as styles from "./CodeHighlight.css.js";
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
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const text = useMemo(
    () => (labels === undefined ? CODE_HIGHLIGHT_LABELS : { ...CODE_HIGHLIGHT_LABELS, ...labels }),
    [labels],
  );

  const plain = code ?? "";
  const css_vars = assignInlineVars({
    [styles.scrollHeight]: maxHeight === undefined ? "none" : LengthToCss(maxHeight),
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
        <div className={styles.header}>
          <span>{filename ?? lang}</span>
          {withCopy ? (
            <ButtonCopy
              value={copy_value}
              size="xs"
              variant="ghost"
              copyLabel={text.copy}
              copiedLabel={text.copied}
            />
          ) : null}
        </div>
      ) : withCopy ? (
        <div className={styles.floatingCopy}>
          <ButtonCopy
            value={copy_value}
            size="xs"
            variant="ghost"
            copyLabel={text.copy}
            copiedLabel={text.copied}
          />
        </div>
      ) : null}

      <div className={styles.scroll}>
        <pre className={styles.pre} tabIndex={0} aria-label={text.region(lang)}>
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
