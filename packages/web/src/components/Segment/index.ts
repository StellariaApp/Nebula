import { SegmentContent as SegmentContentBase, SegmentContentItem } from "./components/Content.js";
import { SegmentControl as SegmentControlBase, SegmentControlItem } from "./components/Control.js";
import { SegmentFooter, SegmentHeader } from "./components/Section.js";
import { Segment as SegmentRoot } from "./Segment.js";

const SegmentControl = /* @__PURE__ */ Object.assign(SegmentControlBase, { Item: SegmentControlItem });
const SegmentContent = /* @__PURE__ */ Object.assign(SegmentContentBase, { Item: SegmentContentItem });

export const Segment = /* @__PURE__ */ Object.assign(SegmentRoot, {
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
