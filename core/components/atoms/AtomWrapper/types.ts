import { OptionsAsWrapper } from "./constans";
import { CSSC } from "../../types/components";

export type AsWrapper = typeof OptionsAsWrapper[number];

export type AtomWrapperProps = CSSC<
  HTMLElement,
  {
    children?: React.ReactNode;
    as?: AsWrapper;
  }
>;

export type SelectorAsWrapper = Record<
  typeof OptionsAsWrapper[number],
  (props: AtomWrapperProps) => JSX.Element
>;
