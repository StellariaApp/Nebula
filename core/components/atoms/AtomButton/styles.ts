import { css, ex } from "excss";
import type { AtomButtonProps, AtomButtonType } from "./types";
import { ThemeTypes } from "../../types/theme";

export const base = css`
  --btn-color: var(--color-white);
  --btn-bg: var(--color-primary);
  --btn-gradient-primary: var(--color-accent-tertiary);
  --btn-gradient-secondary: var(--color-primary);
  --btn-bg-opacity: var(--bg-opacity);
  --btn-bg-blur: var(--bg-blur);
  --btn-gradient: linear-gradient(
    90deg,
    var(--btn-gradient-primary) 0%,
    var(--btn-gradient-secondary) 100%
  );

  border-radius: 4px;
  font-family: var(--font-inter);
  font-size: 12px;
  font-weight: 600;
  padding: 8px 24px;
  cursor: pointer;

  background-color: var(--btn-bg);
  border: 2px solid var(--btn-bg);
  color: var(--btn-color);

  &:hover {
    filter: brightness(1.1);
  }
  &:active {
    filter: brightness(0.9);
  }

  transition: all 0.2s ease-in-out;
`;

const astheme = {
  primary: css`
    --btn-color: var(--color-white) !important;
    --btn-bg: var(--color-primary) !important;
    --btn-gradient-primary: var(--color-accent-tertiary) !important;
    --btn-gradient-secondary: var(--color-primary) !important;
  `,
  secondary: css`
    --btn-color: var(--color-white) !important;
    --btn-bg: var(--color-secondary) !important;
    --btn-gradient-primary: var(--color-primary) !important;
    --btn-gradient-secondary: var(--color-secondary) !important;
  `,
  tertiary: css`
    --btn-color: var(--color-white) !important;
    --btn-bg: var(--color-tertiary) !important;
    --btn-gradient-primary: var(--color-tertiary) !important;
    --btn-gradient-secondary: var(--color-accent-primary) !important;
  `,
  "accent-primary": css`
    --btn-color: var(--color-white) !important;
    --btn-bg: var(--color-accent-primary) !important;
    --btn-gradient-primary: var(--color-accent-primary) !important;
    --btn-gradient-secondary: var(--color-accent-secondary) !important;
  `,
  "accent-secondary": css`
    --btn-color: var(--color-white) !important;
    --btn-bg: var(--color-accent-secondary) !important;
    --btn-gradient-primary: var(--color-accent-secondary) !important;
    --btn-gradient-secondary: var(--color-accent-tertiary) !important;
  `,
  "accent-tertiary": css`
    --btn-color: var(--color-white) !important;
    --btn-bg: var(--color-accent-tertiary) !important;
    --btn-gradient-primary: var(--color-accent-tertiary) !important;
    --btn-gradient-secondary: var(--color-primary) !important;
  `,
} as Record<ThemeTypes, string>;

const astype = {
  flat: css``,
  outlined: css`
    position: relative;
    background-color: transparent !important;
    border: 2px solid var(--btn-bg) !important;
    color: var(--btn-bg) !important;
    &:hover {
      background-color: var(--btn-bg) !important;
      color: var(--btn-color) !important;
    }
    &:before {
      content: "";
      left: 0px;
      top: 0px;
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: var(--btn-bg) !important;
      z-index: -1;
      opacity: var(--btn-bg-opacity);
      backdrop-filter: var(--btn-bg-blur);
    }
  `,
  gradient: css`
    padding: 10px 26px !important;
    border: -2px solid var(--btn-gradient) !important;
    background: var(--btn-gradient) !important;
  `,
} as Record<AtomButtonType, string>;

export const StylesDynamic = ex({
  default: {
    astype: "flat",
    astheme: "primary",
  },
  astype,
  astheme,
});

export const StylesButton = (props: AtomButtonProps) => {
  const { astheme, astype } = props;
  const clases = ex.join(base, StylesDynamic({ astype, astheme }));
  return clases;
};
