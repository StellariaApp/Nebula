import { css, ex } from "excss";
import type { AtomButtonProps, AtomButtonType } from "./types";
import { ThemeTypes } from "../../types/theme";

export const StylesBase = css`
  --btn-color: var(--color-white);
  --btn-bg: var(--color-primary);
  --btn-gradient-primary: var(--color-accent-tertiary);
  --btn-gradient-secondary: var(--color-primary);
  --btn-gradient: linear-gradient(
    90deg,
    var(--btn-gradient-primary) 0%,
    var(--btn-gradient-secondary) 100%
  );

  width: max-content;
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

export const StylesDynamic = ex({
  default: {
    astype: "flat",
    astheme: "primary",
  },
  astheme: {
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
  } as Record<ThemeTypes, string>,
  astype: {
    flat: css``,
    outlined: css`
      background-color: transparent !important;
      border: 2px solid var(--btn-bg) !important;
      color: var(--btn-bg) !important;
      &:hover {
        background-color: var(--btn-bg) !important;
        color: var(--btn-color) !important;
      }
    `,
    gradient: css`
      padding: 10px 26px !important;
      border: -2px solid var(--btn-gradient) !important;
      background: var(--btn-gradient) !important;
    `,
  } as Record<AtomButtonType, string>,
});

export const StylesButton = (props: AtomButtonProps) => {
  const { astheme, astype } = props;
  const clases = ex.join(StylesBase, StylesDynamic({ astype, astheme }));
  return clases;
};
