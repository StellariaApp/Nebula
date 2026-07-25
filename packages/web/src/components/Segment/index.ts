import { SegmentContent as SegmentContentBase, SegmentContentItem } from "./Content.js";
import { SegmentControl as SegmentControlBase, SegmentControlItem } from "./Control.js";
import { SegmentFooter, SegmentHeader } from "./Section.js";
import { Segment as SegmentRoot } from "./Segment.js";

const SegmentControl = Object.assign(SegmentControlBase, { Item: SegmentControlItem });
const SegmentContent = Object.assign(SegmentContentBase, { Item: SegmentContentItem });

export const Segment = Object.assign(SegmentRoot, {
  Control: SegmentControl,
  Content: SegmentContent,
  Header: SegmentHeader,
  Footer: SegmentFooter,
});

export { SegmentContent, SegmentContentItem, SegmentControl, SegmentControlItem };
export { SegmentFooter, SegmentHeader };
export type {
  SegmentContentItemProps,
  SegmentContentProps,
  SegmentControlData,
  SegmentControlItemProps,
  SegmentControlProps,
  SegmentItemData,
  SegmentProps,
  SegmentSectionProps,
} from "./Segment.types.js";
