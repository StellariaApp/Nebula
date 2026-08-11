"use client";

import { useMemo, type ReactElement } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { Segment } from "../Segment/index.js";

import * as styles from "./CodeHighlight.css.js";
import { CodeHighlight } from "./CodeHighlight.js";
import type { CodeHighlightTabsProps } from "./CodeHighlight.types.js";

export function CodeHighlightTabs(props: CodeHighlightTabsProps): ReactElement {
  const {
    tabs,
    value,
    defaultValue,
    onChange,
    withLineNumbers,
    withCopy,
    maxHeight,
    label,
    labels,
    className,
    tabListProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const first = tabs[0]?.value ?? "";
  const [active, set_active] = useUncontrolled(value, defaultValue ?? first, onChange);

  const data = useMemo(() => tabs.map((tab) => ({ value: tab.value, label: tab.label })), [tabs]);

  const current = tabs.find((tab) => tab.value === active) ?? tabs[0];

  return (
    <div
      className={cx(styles.root({}), sprinkle_class, className)}
      style={sprinkle_style}
      {...rest}
    >
      <Box {...tabListProps} className={cx(styles.tab_list, tabListProps?.className)}>
        <Segment value={active} onChange={set_active} size="sm">
          <Segment.Control data={data} {...(label === undefined ? {} : { "aria-label": label })} />
        </Segment>
      </Box>
      {current === undefined ? null : (
        <CodeHighlight
          {...current}
          className={styles.bare}
          {...(withLineNumbers === undefined ? {} : { withLineNumbers })}
          {...(withCopy === undefined ? {} : { withCopy })}
          {...(maxHeight === undefined ? {} : { maxHeight })}
          {...(labels === undefined ? {} : { labels })}
        />
      )}
    </div>
  );
}

CodeHighlightTabs.displayName = "CodeHighlightTabs";
