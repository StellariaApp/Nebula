import { css, ex } from "excss";
import { AsText, AsThemeKeysText, AtomTextProps } from "./types";
import { AsTypeKeys } from "../../types/theme";

export const base = css`
  --text-primary-color: var(--color-primary);
  --text-color: var(--color-text);
  --text-font-family: var(--font-family-primary);
  --text-font-weight: 600;
  --text-font-size: 14px;

  --text-gradient-primary: var(--color-accent-tertiary);
  --text-gradient-secondary: var(--color-primary);

  --text-shadow: var(--color-text);

  --text-gradient: linear-gradient(
    90deg,
    var(--text-gradient-primary) 0%,
    var(--text-gradient-secondary) 100%
  );

  color: var(--text-color);
  font-family: var(--text-font-family);
  font-weight: var(--text-font-weight);
  font-size: var(--text-font-size);
`;

const astype = {
  flat: css``,
  outlined: css`
    color: var(--background) !important;
    text-shadow: var(--text-shadow) 0px 0px 2px, var(--text-shadow) 0px 0px 2px,
      var(--text-shadow) 0px 0px 2px, var(--text-shadow) 0px 0px 2px,
      var(--text-shadow) 0px 0px 2px, var(--text-shadow) 0px 0px 2px;
    -webkit-font-smoothing: antialiased;
  `,
  gradient: css`
    font-weight: 800 !important;
    background: var(--text-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `,
} as Record<AsTypeKeys, string>;

const astheme = {
  text: css`
    --text-color: var(--color-text) !important;
    --text-shadow: var(--color-text) !important;
    --text-gradient-primary: var(--color-accent-tertiary) !important;
    --text-gradient-secondary: var(--color-primary) !important;
  `,
  title: css`
    --text-color: var(--color-title) !important;
    --text-shadow: var(--color-title) !important;
    --text-gradient-primary: var(--color-accent-tertiary) !important;
    --text-gradient-secondary: var(--color-primary) !important;
  `,
  subtitle: css`
    --text-color: var(--color-subtitle) !important;
    --text-shadow: var(--color-subtitle) !important;
    --text-gradient-primary: var(--color-accent-tertiary) !important;
    --text-gradient-secondary: var(--color-primary) !important;
  `,
  primary: css`
    --text-color: var(--color-primary) !important;
    --text-shadow: var(--color-primary) !important;
    --text-gradient-primary: var(--color-accent-tertiary) !important;
    --text-gradient-secondary: var(--color-primary) !important;
  `,
  secondary: css`
    --text-color: var(--color-secondary) !important;
    --text-shadow: var(--color-secondary) !important;
    --text-gradient-primary: var(--color-primary) !important;
    --text-gradient-secondary: var(--color-secondary) !important;
  `,
  tertiary: css`
    --text-color: var(--color-tertiary) !important;
    --text-shadow: var(--color-tertiary) !important;
    --text-gradient-primary: var(--color-tertiary) !important;
    --text-gradient-secondary: var(--color-accent-primary) !important;
  `,
  "accent-primary": css`
    --text-color: var(--color-accent-primary) !important;
    --text-shadow: var(--color-accent-primary) !important;
    --text-gradient-primary: var(--color-accent-primary) !important;
    --text-gradient-secondary: var(--color-accent-secondary) !important;
  `,
  "accent-secondary": css`
    --text-color: var(--color-accent-secondary) !important;
    --text-shadow: var(--color-accent-secondary) !important;
    --text-gradient-primary: var(--color-accent-secondary) !important;
    --text-gradient-secondary: var(--color-accent-tertiary) !important;
  `,
  "accent-tertiary": css`
    --text-color: var(--color-accent-tertiary) !important;
    --text-shadow: var(--color-accent-tertiary) !important;
    --text-gradient-primary: var(--color-primary) !important;
    --text-gradient-secondary: var(--color-accent-tertiary) !important;
  `,
} as Record<AsThemeKeysText, string>;

const as = {
  span: css`
    --text-font-size: 14px !important;
  `,
  p: css`
    --text-font-size: 14px !important;
  `,
  a: css`
    --text-font-size: 14px !important;
    --text-font-weight: 600 !important;
    cursor: pointer;
  `,
  h1: css`
    --text-font-size: 42px !important;
    --text-font-family: var(--font-family-secondary) !important;
  `,
  h2: css`
    --text-font-size: 32px !important;
    --text-font-family: var(--font-family-secondary) !important;
  `,
  h3: css`
    --text-font-size: 24px !important;
    --text-font-family: var(--font-family-secondary) !important;
  `,
  h4: css`
    --text-font-size: 20px !important;
    --text-font-family: var(--font-family-secondary) !important;
  `,
  h5: css`
    --text-font-size: 18px !important;
    --text-font-family: var(--font-family-secondary) !important;
  `,
  h6: css`
    --text-font-size: 16px !important;
    --text-font-family: var(--font-family-secondary) !important;
  `,
} as Record<AsText, string>;

export const StylesDynamic = ex({
  default: {
    astheme: "text",
    astype: "flat",
    as: "span",
  },
  astype,
  astheme,
  as,
});

export const StylesButton = (props: AtomTextProps) => {
  const { astheme, astype, as } = props;
  const clases = ex.join(base, StylesDynamic({ astype, astheme, as }));
  return clases;
};
