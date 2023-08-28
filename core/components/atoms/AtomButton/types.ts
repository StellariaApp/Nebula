import { CSSC } from "../../types/components";
import { AsThemeKeys, AsTypeKeys } from "../../types/theme";

export type AtomButtonProps = CSSC<
  HTMLElement,
  {
    children?: React.ReactNode;
    astheme?: AsThemeKeys;
    astype?: AsTypeKeys;
  }
>;
