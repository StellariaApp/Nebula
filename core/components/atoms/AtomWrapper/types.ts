import { OptionsAsWrapper } from "./constans";
import { CSSC } from "../../types/components";

export type AtomWrapperProps = CSSC<
  HTMLElement,
  {
    children?: React.ReactNode;
    as?: typeof OptionsAsWrapper[number];
  }
>;

export type SelectorAsWrapper = Record<
  typeof OptionsAsWrapper[number],
  (props: AtomWrapperProps) => JSX.Element
>;
