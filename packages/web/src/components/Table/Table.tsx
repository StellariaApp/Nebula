import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden.js";

import * as styles from "./Table.css.js";
import type {
  TableCellProps,
  TableProps,
  TableRowProps,
  TableScrollProps,
  TableSectionProps,
} from "./Table.types.js";

export function TableRoot(props: TableProps): ReactElement {
  const {
    children,
    caption,
    captionProps,
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
      {caption === undefined ? null : (
        <Text
          component="caption"
          {...captionProps}
          className={cx(captionVisible ? styles.caption : undefined, captionProps?.className)}
        >
          {captionVisible ? caption : <VisuallyHidden>{caption}</VisuallyHidden>}
        </Text>
      )}
      {children}
    </table>
  );
}

export function TableHead(props: TableSectionProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);
  return (
    <thead className={cx(styles.head, sprinkle_class, className)} style={sprinkle_style}>
      {children}
    </thead>
  );
}

export function TableBody(props: TableSectionProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);
  return (
    <tbody className={cx(sprinkle_class, className)} style={sprinkle_style}>
      {children}
    </tbody>
  );
}

export function TableFoot(props: TableSectionProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);
  return (
    <tfoot className={cx(styles.foot, sprinkle_class, className)} style={sprinkle_style}>
      {children}
    </tfoot>
  );
}

/**
 * Una fila.
 *
 * Su raiz es un `Box component="tr"` y no un `<tr>` suelto, y es lo que le da `reveal` sin
 * reimplementarlo: el observador y la transicion viven en la cascara de `Box`, que solo se monta
 * cuando alguien pide la entrada.
 *
 * Aqui la prop no es una comodidad: envolver la fila NO es una opcion, porque entre `<tbody>` y
 * `<tr>` no cabe ningun otro elemento. O lo declara la fila, o no hay forma de animarla.
 */
export function TableRow(props: TableRowProps): ReactElement {
  const { children, selected = false, onPress, className, reveal, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  return (
    <Box
      component="tr"
      {...(reveal === undefined ? {} : { reveal })}
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
    </Box>
  );
}

export function TableTitle(props: TableCellProps): ReactElement {
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

export function TableCell(props: TableCellProps): ReactElement {
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

export function TableScrollContainer(props: TableScrollProps): ReactElement {
  const { children, minWidth = 640, label = "Scrollable table", className, ...style_rest } = props;
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
TableHead.displayName = "Table.Head";
TableBody.displayName = "Table.Body";
TableFoot.displayName = "Table.Foot";
TableRow.displayName = "Table.Row";
TableTitle.displayName = "Table.Title";
TableCell.displayName = "Table.Cell";
TableScrollContainer.displayName = "Table.ScrollContainer";
