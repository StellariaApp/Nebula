import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export type ChartDatum = Readonly<Record<string, string | number | null | undefined>>;

export interface ChartSeries {
  key: string;
  label?: string | undefined;
  color?: ColorExtended | undefined;
  stackId?: string | undefined;
}

export interface ChartAxis {
  key?: string | undefined;
  label?: string | undefined;
  hide?: boolean | undefined;
  tickFormatter?: ((value: string | number, index: number) => string) | undefined;
}

export interface ChartBaseProps extends StyleProps {
  /** The title `figcaption`, which is what the canvas `aria-labelledby` points at. Not rendered without `title`. */
  titleProps?: TextSlotProps | undefined;
  /** The summary paragraph, which is the accessible description of the chart. Not rendered without `summary`. */
  summaryProps?: TextSlotProps | undefined;
  /**
   * The canvas the chart is painted on. Its height is written AFTER the slot, because it comes from
   * `height`; with `title` or `summary` it also carries the `role="img"` and the `aria-labelledby`
   * that give it an accessible name, so rewriting those here leaves the chart nameless.
   */
  canvasProps?: BoxSlotProps | undefined;
  /** The `details` that discloses the data table. Only exists with `withDataTable`. */
  detailsProps?: ComponentPropsWithoutRef<"details"> | undefined;
  /** The `summary` that opens that disclosure, where `dataTableLabel` lands. Only exists with `withDataTable`. */
  detailsSummaryProps?: ComponentPropsWithoutRef<"summary"> | undefined;
  /** The data table inside the disclosure. Only exists with `withDataTable`. */
  tableProps?: ComponentPropsWithoutRef<"table"> | undefined;
  /**
   * The rows, one per point along the axis. Every key a `series` or an axis names has to exist on
   * them — a missing key is not an error, it simply plots nothing.
   */
  data: readonly ChartDatum[];
  /**
   * Which keys of `data` are drawn, and in what order. The order also assigns the palette, so
   * reordering this recolours the chart; pin a `color` on the series to stop that.
   */
  series: readonly ChartSeries[];
  /**
   * The category axis. Left out it reads the `name` key, which is why data shaped that way needs no
   * axis config at all.
   */
  xAxis?: ChartAxis | undefined;
  /** The value axis. Left out it scales itself to the data. */
  yAxis?: ChartAxis | undefined;
  /**
   * Height of the canvas in pixels. The width always comes from the container — only the height is
   * fixed, because a chart with no height collapses to nothing inside a responsive wrapper.
   * @default 260
   */
  height?: number | undefined;
  /** Whether hovering a point opens the tooltip. */
  withTooltip?: boolean | undefined;
  /** Whether the series legend is drawn. */
  withLegend?: boolean | undefined;
  /** Whether the background grid is drawn. */
  withGrid?: boolean | undefined;
  /**
   * The caption, and the accessible name of the canvas through `aria-labelledby`. Without it — and
   * without `summary` — the canvas carries no `role="img"` at all, so the chart is invisible to
   * assistive tech rather than merely unnamed.
   */
  title?: string | undefined;
  /**
   * The prose description of what the chart shows, and the canvas's accessible description. This is
   * where the trend goes: a screen reader gets nothing from the shape of the line.
   */
  summary?: string | undefined;
  /**
   * Discloses the same data as a real table under the chart, which is what makes the figures
   * reachable rather than merely described. Collapsed by default, so it costs no room.
   */
  withDataTable?: boolean | undefined;
  /**
   * What the disclosure that opens the table says. It falls back to "View data as a table", English
   * by default (ADR-120); translate it at the call site.
   */
  dataTableLabel?: string | undefined;
  /**
   * What replaces the whole chart when `data` is empty. Without it an empty chart still renders its
   * frame and axes, which reads as broken rather than as empty.
   */
  empty?: ReactNode | undefined;
  className?: string | undefined;
}

export interface BarChartProps extends ChartBaseProps {
  /**
   * Which way the bars run. `"vertical"` lays them along the y axis, which is the one that survives
   * long category labels — horizontal bars have to truncate them.
   * @default "horizontal"
   */
  layout?: "horizontal" | "vertical" | undefined;
  /** How rounded the end of each bar is, as a raw length. @default 4 */
  radius?: number | undefined;
}

export interface LineChartProps extends ChartBaseProps {
  /**
   * How the line joins its points. It smooths by default, which reads well for a trend but implies
   * values between the points that were never measured; `"linear"` claims nothing, and `"step"` is
   * the honest one for a value that changes in jumps.
   * @default "monotone"
   */
  curve?: "linear" | "monotone" | "step" | undefined;
  /**
   * Whether each point is marked. Worth turning on when the points are few and read as readings,
   * and worth leaving off past a few dozen, where the dots merge into the line anyway.
   */
  withDots?: boolean | undefined;
}

export interface AreaChartProps extends LineChartProps {
  /**
   * How solid the fill under the line is. It stays low on purpose: stacked areas at full opacity
   * hide each other, and the point of the fill is volume, not colour.
   */
  fillOpacity?: number | undefined;
}

export interface PieChartProps extends Omit<ChartBaseProps, "series" | "xAxis" | "yAxis"> {
  /** Key of `data` holding the number each slice is sized by. */
  valueKey: string;
  /** Key of `data` holding the name of each slice, used in the legend and the tooltip. */
  labelKey: string;
  /**
   * One colour per slice, in the order of `data`. Left out, the chart palette assigns them; give
   * this only when the slices carry meaning a palette cannot, like a status.
   */
  colors?: readonly ColorExtended[] | undefined;
  /**
   * Opens the hole in the middle. It is what makes room for a total in the centre, and it is the
   * shape that compares slices better — an angle at the centre is harder to read than an arc.
   * @default false
   */
  donut?: boolean | undefined;
  /**
   * How thick the ring is when `donut` is on, measured inwards from the outer edge. Read by nothing
   * on a solid pie.
   * @default 32
   */
  thickness?: number | undefined;
}

export interface SparkLineProps extends StyleProps {
  /**
   * The values, in order. They are scaled to their own minimum and maximum, so the line always fills
   * the box — two sparklines side by side are NOT comparable unless their ranges already match.
   * A single value draws a flat line, and an empty array draws nothing.
   */
  data: readonly number[];
  /** The scale it is drawn from. @default "primary" */
  color?: ColorExtended | undefined;
  /** Width of the drawing, in pixels. Fixed, not responsive: it is sized to sit inline in a cell. @default 96 */
  width?: number | undefined;
  /** Height of the drawing, in pixels. @default 28 */
  height?: number | undefined;
  /** Thickness of the line. @default 2 */
  strokeWidth?: number | undefined;
  /** Fills underneath the line, which reads as volume rather than as rate. @default false */
  withArea?: boolean | undefined;
  /**
   * The accessible name. A sparkline has no axes and no figures, so without this it says nothing at
   * all — put the reading in words here, since the shape carries none.
   */
  label?: string | undefined;
  className?: string | undefined;
}

export type TrendDirection = "up" | "down" | "flat";

export interface TrendIndicatorProps extends Omit<StyleProps, "direction"> {
  /** The arrow. Decorative: the direction is announced separately with hidden text. */
  arrowProps?: BoxSlotProps | undefined;
  /** The number shown, and the one whose sign picks the arrow when `direction` is left out. */
  value: number;
  /**
   * Forces the arrow instead of deriving it from the sign of `value`. For a figure whose direction
   * is not its sign — a rank, where falling to 3rd is an improvement.
   */
  direction?: TrendDirection | undefined;
  /**
   * How the number is printed. The default signs positives and adds a percent — replace it for any
   * figure that is not a percentage, since nothing else here checks the unit.
   * @default a signed percentage, like `+12 %`
   */
  format?: ((value: number) => string) | undefined;
  /**
   * Swaps which direction reads as good, without touching the arrow. For a figure where rising is
   * bad — churn, latency, cost — so the arrow still points up and the colour still warns.
   * @default false
   */
  invertColors?: boolean | undefined;
  /**
   * What is announced in place of "up", "down" or "unchanged". The arrow is `aria-hidden`, so this
   * hidden text is the only thing carrying the direction; it is English by default (ADR-120).
   */
  label?: string | undefined;
  className?: string | undefined;
}

export interface RadarChartProps extends Omit<ChartBaseProps, "xAxis" | "yAxis"> {
  /** Key of the angular axis: each distinct value is a vertex of the polygon. */
  angleKey: string;
  /**
   * Height of the canvas in pixels. It is taller than the other charts by default because a radar
   * needs room in both axes at once — its vertices run all the way round.
   * @default 280
   */
  height?: number | undefined;
  /**
   * How solid the fill inside each polygon is. It stays low because overlapping series is the whole
   * point of a radar, and an opaque fill hides the ones behind.
   * @default 0.22
   */
  fillOpacity?: number | undefined;
  /** Whether the vertices are named around the edge. Without them the shape has no referent. */
  withAxisLabels?: boolean | undefined;
  /**
   * Pins the outer ring to a fixed value instead of the largest one in `data`. It is what makes two
   * radars comparable: scaled to their own maximum, the same shape can mean different numbers.
   */
  maxValue?: number | undefined;
}

export interface ChartLegendEntry {
  key: string;
  label: string;
  color: string;
}

export interface ChartLegendProps extends StyleProps {
  /** Every legend entry. It carries `data-interactive`, which depends on whether there is an `onToggle`. */
  itemProps?: ComponentPropsWithoutRef<"button"> | undefined;
  entries: readonly ChartLegendEntry[];
  /** @default [] */
  hidden?: readonly string[] | undefined;
  onToggle?: ((key: string) => void) | undefined;
  label?: string | undefined;
  className?: string | undefined;
}

export interface ChartTooltipDatum {
  key: string;
  label: string;
  value: string | number;
  color: string;
}

export interface ChartTooltipProps extends StyleProps {
  /** The tooltip title, when there is one. */
  titleProps?: TextSlotProps | undefined;
  /** Every series row. It spreads over all of them. */
  rowProps?: BoxSlotProps | undefined;
  /** The value of each row, already passed through `format` when there is one. */
  valueProps?: TextSlotProps | undefined;
  title?: ReactNode | undefined;
  items: readonly ChartTooltipDatum[];
  format?: ((value: string | number, key: string) => string) | undefined;
  className?: string | undefined;
}

export interface ChartPanelItem {
  id: string;
  title?: ReactNode | undefined;
  description?: ReactNode | undefined;
  action?: ReactNode | undefined;
  span?: 1 | 2 | 3 | undefined;
  content: ReactNode;
}

export interface ChartPanelProps extends StyleProps {
  /** Every panel card. It spreads over ALL of them; the width comes from the `span` of each panel. */
  cardProps?: ComponentPropsWithoutRef<"section"> | undefined;
  /** The header of each panel. Not rendered when the panel has no title and no action. */
  headProps?: BoxSlotProps | undefined;
  /** The title of each panel, which is the `h3` its `aria-labelledby` points at. */
  titleProps?: TextSlotProps | undefined;
  /** The description of each panel, when it has one. */
  descriptionProps?: TextSlotProps | undefined;
  panels: readonly ChartPanelItem[];
  cols?: 1 | 2 | 3 | undefined;
  gap?: "sm" | "md" | "lg" | undefined;
  label?: string | undefined;
  className?: string | undefined;
}
