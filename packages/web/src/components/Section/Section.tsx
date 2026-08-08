"use client";

import {
  Children,
  isValidElement,
  useId,
  useMemo,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";
import { m } from "motion/react";

import { ContainsPart } from "../../utils/children.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { Alert } from "../Alert/Alert.js";
import { LoadingOverlay } from "../LoadingOverlay/LoadingOverlay.js";
import { useReveal } from "../Reveal/use-reveal.js";

import { SectionActions } from "./components/Actions.js";
import { SectionAside } from "./components/Aside.js";
import { SectionDescription } from "./components/Description.js";
import { SectionFooter } from "./components/Footer.js";
import { SectionHeader, SectionHeading } from "./components/Header.js";
import { SectionTitle } from "./components/Title.js";
import { SectionContext } from "./Section.context.js";
import * as styles from "./Section.css.js";
import type { SectionProps } from "./Section.types.js";
import * as variables from "./Section.vars.css.js";

interface Split {
  header: ReactNode[];
  footer: ReactNode[];
  body: ReactNode[];
}

const REGIONS = new Map<unknown, keyof Split>([
  [SectionHeader, "header"],
  [SectionFooter, "footer"],
]);

function SplitChildren(children: ReactNode): Split {
  const split: Split = { header: [], footer: [], body: [] };
  Children.forEach(children, (child) => {
    if (child === null || child === undefined || child === false) return;
    const region = isValidElement(child) ? REGIONS.get(child.type) : undefined;
    split[region ?? "body"].push(child);
  });
  return split;
}

const DEFAULT_WIDTH = 1180;

export function Section(props: SectionProps): ReactElement {
  const {
    children,
    title,
    description,
    actions,
    aside,
    footer,
    loading = false,
    error,
    empty,
    size = "md",
    isEmpty = false,
    order = 2,
    divided = false,
    glass = false,
    reveal = false,
    contentWidth = DEFAULT_WIDTH,
    className,
    "aria-label": aria_label,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const title_id = useId();
  const parts = useMemo(() => SplitChildren(children), [children]);
  const has_title = title !== undefined;
  const has_own_header = parts.header.length > 0;
  const context = useMemo(() => ({ titleId: title_id, order }), [title_id, order]);
  const names_region = useMemo(
    () => has_title || ContainsPart(children, SectionTitle),
    [has_title, children],
  );

  const labelling = names_region
    ? { "aria-labelledby": title_id }
    : aria_label === undefined
      ? {}
      : { "aria-label": aria_label };

  const rail_vars = assignInlineVars({ [variables.contentMax]: LengthToCss(contentWidth) });
  const revealed = useReveal();
  const animating = reveal && revealed.armed;
  const Root: ElementType = animating ? m.section : "section";

  return (
    <SectionContext.Provider value={context}>
      <Root
        {...(reveal ? { ref: revealed.ref } : {})}
        className={cx(styles.section, styles.size[size], sprinkle_class, className)}
        style={{ ...rail_vars, ...sprinkle_style }}
        data-glass={glass ? "true" : undefined}
        data-reveal={reveal ? revealed["data-reveal"] : undefined}
        {...(animating
          ? {
              initial: revealed.initial,
              animate: revealed.animate,
              transition: revealed.transition,
            }
          : {})}
        {...labelling}
        {...rest}
      >
        <div
          className={cx(styles.rail, styles.rail_size[size])}
          data-divided={divided ? "true" : undefined}
        >
          {has_own_header ? (
            parts.header
          ) : has_title || description !== undefined || actions !== undefined ? (
            <SectionHeader>
              <SectionHeading>
                {has_title ? <SectionTitle>{title}</SectionTitle> : null}
                {description === undefined ? null : (
                  <SectionDescription>{description}</SectionDescription>
                )}
              </SectionHeading>
              {actions === undefined && aside === undefined ? null : (
                <SectionActions>
                  {aside === undefined ? null : <SectionAside>{aside}</SectionAside>}
                  {actions}
                </SectionActions>
              )}
            </SectionHeader>
          ) : null}

          <div className={styles.body}>
            {error !== undefined ? (
              typeof error === "string" ? (
                <Alert color="error" live="alert">
                  {error}
                </Alert>
              ) : (
                error
              )
            ) : isEmpty && empty !== undefined ? (
              empty
            ) : (
              parts.body
            )}
            <LoadingOverlay visible={loading} />
          </div>

          {parts.footer.length > 0 ? (
            parts.footer
          ) : footer === undefined ? null : (
            <SectionFooter>{footer}</SectionFooter>
          )}
        </div>
      </Root>
    </SectionContext.Provider>
  );
}

Section.displayName = "Section";
