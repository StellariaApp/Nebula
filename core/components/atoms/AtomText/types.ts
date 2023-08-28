import { OptionsAsText } from "./constans";
import { CSSC } from "../../types/components";
import { AsThemeKeys, AsTypeKeys } from "../../types/theme";

export type AsText = typeof OptionsAsText[number];

export type AtomTextProps = CSSC<
  HTMLElement,
  {
    children?: React.ReactNode;
    astheme?: AsThemeKeys;
    astype?: AsTypeKeys;
    as?: AsText;
  }
>;

export type SelectorAsText = Record<
  typeof OptionsAsText[number],
  (props: AtomTextProps) => JSX.Element
>;
