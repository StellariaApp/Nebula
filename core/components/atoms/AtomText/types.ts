import { OptionsAsText } from "./constans";
import { CSSC } from "../../types/components";
import { AsThemeKeys, AsTypeKeys } from "../../types/theme";

export type AsText = typeof OptionsAsText[number];

export type AsThemeKeysText = AsThemeKeys | "text" | "title" | "subtitle";

export type AtomTextProps = CSSC<
  HTMLElement,
  {
    children?: React.ReactNode;
    astheme?: AsThemeKeysText;
    astype?: AsTypeKeys;
    as?: AsText;
  }
>;

export type SelectorAsText = Record<
  typeof OptionsAsText[number],
  (props: AtomTextProps) => JSX.Element
>;
