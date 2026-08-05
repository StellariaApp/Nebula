"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden.js";

import * as styles from "./Table.css.js";
import type {
  TableCellProps,
  TableProps,
  TableRowProps,
  TableScrollProps,
  TableSectionProps,
} from "./Table.types.js";

function TableRoot(props: TableProps): ReactElement {
  const {
    children,
    caption,
    captionVisible = false,
    striped = false,
    withBorder = false,
    highlightOnHover = false,
    density = "normal",
    stickyHeader = false,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  return (
    <table
      className={cx(
        styles.table,
        withBorder ? styles.bordered : undefined,
        sprinkle_class,
        className,
      )}
      style={sprinkle_style}
      data-density={density}
      data-striped={striped ? "true" : undefined}
      data-hoverable={highlightOnHover ? "true" : undefined}
      data-sticky={stickyHeader ? "true" : undefined}
    >
      {caption === undefined ? null : captionVisible ? (
        <caption className={styles.caption}>{caption}</caption>
      ) : (
        <caption>
          <VisuallyHidden>{caption}</VisuallyHidden>
        </caption>
      )}
      {children}
    </table>
  );
}

function Head(props: TableSectionProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);
  return (
    <thead className={cx(styles.head, sprinkle_class, className)} style={sprinkle_style}>
      {children}
    </thead>
  );
}

function Body(props: TableSectionProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);
  return (
    <tbody className={cx(sprinkle_class, className)} style={sprinkle_style}>
      {children}
    </tbody>
  );
}

function Foot(props: TableSectionProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);
  return (
    <tfoot className={cx(styles.foot, sprinkle_class, className)} style={sprinkle_style}>
      {children}
    </tfoot>
  );
}

function Row(props: TableRowProps): ReactElement {
  const { children, selected = false, onPress, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  return (
    <tr
      className={cx(
        styles.row,
        onPress === undefined ? undefined : styles.pressable,
        sprinkle_class,
        className,
      )}
      style={sprinkle_style}
      data-selected={selected ? "true" : undefined}
      {...(selected ? { "aria-selected": true } : {})}
      {...(onPress === undefined
        ? {}
        : {
            onClick: onPress,
            tabIndex: 0,
            role: "button",
            onKeyDown: (event: React.KeyboardEvent<HTMLTableRowElement>) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              onPress();
            },
          })}
    >
      {children}
    </tr>
  );
}

function Title(props: TableCellProps): ReactElement {
  const {
    children,
    numeric = false,
    align,
    colSpan,
    scope = "col",
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  return (
    <th
      scope={scope}
      className={cx(
        styles.cell,
        styles.title,
        styles.align[align ?? (numeric ? "end" : "start")],
        sprinkle_class,
        className,
      )}
      style={sprinkle_style}
      {...(colSpan === undefined ? {} : { colSpan })}
    >
      {children}
    </th>
  );
}

function Cell(props: TableCellProps): ReactElement {
  const { children, numeric = false, align, colSpan, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  return (
    <td
      className={cx(
        styles.cell,
        styles.align[align ?? (numeric ? "end" : "start")],
        numeric ? styles.numeric : undefined,
        sprinkle_class,
        className,
      )}
      style={sprinkle_style}
      {...(colSpan === undefined ? {} : { colSpan })}
    >
      {children}
    </td>
  );
}

function ScrollContainer(props: TableScrollProps): ReactElement {
  const { children, minWidth = 640, label = "Tabla desplazable", className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  return (
    <div
      className={cx(styles.scroll, sprinkle_class, className)}
      style={sprinkle_style}
      tabIndex={0}
      role="region"
      aria-label={label}
    >
      <div className={styles.scroll_inner} style={{ minWidth }}>
        {children}
      </div>
    </div>
  );
}

TableRoot.displayName = "Table";
Head.displayName = "Table.Head";
Body.displayName = "Table.Body";
Foot.displayName = "Table.Foot";
Row.displayName = "Table.Row";
Title.displayName = "Table.Title";
Cell.displayName = "Table.Cell";
ScrollContainer.displayName = "Table.ScrollContainer";

export const Table = Object.assign(TableRoot, {
  Head,
  Body,
  Foot,
  Row,
  Title,
  Cell,
  ScrollContainer,
});
