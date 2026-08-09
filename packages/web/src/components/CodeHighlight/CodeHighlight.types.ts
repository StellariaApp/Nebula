import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { ButtonCopyProps } from "../ButtonCopy/ButtonCopy.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface CodeHighlightLabels {
  copy: string;
  copied: string;
  region: (lang: string | undefined) => string;
}

/**
 * Code block with the theme surface, line numbers, scrolling and copy.
 *
 * **It does not highlight on its own** ([ADR-061](../../../../../docs/adr/ADR-061-rich-content-tiptap-y-dependencias-de-w43.md)):
 * `code` renders as plain text and `html` expects already-highlighted markup, injected with
 * `dangerouslySetInnerHTML`. Sanitising that HTML is the responsibility of whoever produces it.
 */
export interface CodeHighlightProps extends StyleProps {
  /** The header. Only rendered with `filename` or `lang`. */
  headerProps?: BoxSlotProps | undefined;
  /** The header label, which renders `filename` and falls back to `lang` when there is none. */
  filenameProps?: TextSlotProps | undefined;
  /** The floating anchor for the copy button. It only exists WITHOUT a header: with one, the button goes inside it. */
  floatingCopyProps?: BoxSlotProps | undefined;
  /** The copy button, in the header or floating. The component computes its `value`. */
  copyProps?: Omit<ButtonCopyProps, "value"> | undefined;
  /**
   * The code block, which is the focusable region with an accessible name. The line numbers and the
   * code have no slot: they share a line metric, and separating them knocks the numbers out of line.
   */
  preProps?: ComponentPropsWithoutRef<"pre"> | undefined;
  code?: string | undefined;
  html?: string | undefined;
  lang?: string | undefined;
  filename?: ReactNode | undefined;
  withLineNumbers?: boolean | undefined;
  withCopy?: boolean | undefined;
  firstLine?: number | undefined;
  maxHeight?: number | undefined;
  labels?: Partial<CodeHighlightLabels> | undefined;
  className?: string | undefined;
}

export interface CodeHighlightTab extends Omit<CodeHighlightProps, "className"> {
  value: string;
  label: ReactNode;
}

export interface CodeHighlightTabsProps extends StyleProps {
  /** The tab bar. Each block is configured through its own `tabs` entry, not from here. */
  tabListProps?: BoxSlotProps | undefined;
  tabs: readonly CodeHighlightTab[];
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  withLineNumbers?: boolean | undefined;
  withCopy?: boolean | undefined;
  maxHeight?: number | undefined;
  label?: string | undefined;
  labels?: Partial<CodeHighlightLabels> | undefined;
  className?: string | undefined;
}
