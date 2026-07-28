import { forwardRef, Fragment, type ElementType, type ReactElement, type Ref } from "react";

import { Mark } from "../Mark/Mark.js";
import { Text } from "../Text/Text.js";

import type { HighlightOwnProps, HighlightProps } from "./Highlight.types.js";

interface Segment {
  text: string;
  match: boolean;
}

function EscapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function SplitByTerms(text: string, terms: string[]): Segment[] {
  const valid = terms.filter((term) => term.length > 0).map(EscapeRegExp);
  if (valid.length === 0) return [{ text, match: false }];

  const splitter = new RegExp(`(${valid.join("|")})`, "gi");
  const matcher = new RegExp(`^(?:${valid.join("|")})$`, "i");

  return text
    .split(splitter)
    .filter((part) => part.length > 0)
    .map((part) => ({ text: part, match: matcher.test(part) }));
}

const HighlightComponent = forwardRef<HTMLElement, HighlightOwnProps>(
  function Highlight(props, ref) {
    const { component, highlight, color = "warning", children, ...rest } = props;

    const terms = Array.isArray(highlight) ? highlight : [highlight];
    const segments = SplitByTerms(children ?? "", terms);

    return (
      <Text ref={ref} component={component ?? "p"} {...rest}>
        {segments.map((segment, index) =>
          segment.match ? (
            <Mark key={index} color={color}>
              {segment.text}
            </Mark>
          ) : (
            <Fragment key={index}>{segment.text}</Fragment>
          ),
        )}
      </Text>
    );
  },
);

interface HighlightComponent {
  <C extends ElementType = "p">(props: HighlightProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Highlight = HighlightComponent as unknown as HighlightComponent;
Highlight.displayName = "Highlight";
