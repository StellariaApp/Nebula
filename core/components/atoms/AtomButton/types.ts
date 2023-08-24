import { CSSC } from "../../types/components";
import { ThemeTypes } from "../../types/theme";

export type AtomButtonType = "flat" | "outlined" | "gradient";

export type AtomButtonProps = CSSC<
  HTMLElement,
  {
    children?: React.ReactNode;
    astheme?: ThemeTypes;
    astype?: AtomButtonType;
  }
>;
