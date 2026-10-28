import { animation } from "../tokens/animation.js";
import { radius, sizes, spacing, zIndex } from "../tokens/layout.js";
import { palettes } from "../tokens/palettes.js";
import { font } from "../tokens/typography.js";

import { DARK_SCHEME, LIGHT_SCHEME, type SchemeRecipe } from "./scheme.js";

const PREFIX = "--nebula";
const ROOT_PX = 16;

type Declaration = readonly [name: string, value: string];

function Rem(px: number): string {
  return px === 0 ? "0" : `${String(px / ROOT_PX)}rem`;
}

function Block(selector: string, declarations: Declaration[], indent = ""): string {
  const lines = declarations.map(([name, value]) => `${indent}  ${name}: ${value};`);
  return [`${indent}${selector} {`, ...lines, `${indent}}`].join("\n");
}

function ScaleDeclarations(name: string, scale: Record<string, string>): Declaration[] {
  return Object.entries(scale).map(([shade, value]) => [`${PREFIX}-${name}-${shade}`, value]);
}

function RoleDeclarations(group: string, roles: Record<string, string>): Declaration[] {
  return Object.entries(roles).map(([role, value]) => [`${PREFIX}-color-${group}-${role}`, value]);
}

export function SchemeDeclarations(scheme: SchemeRecipe): Declaration[] {
  const { colors } = scheme;
  return [
    ...ScaleDeclarations("color-primary", colors.primary),
    ...ScaleDeclarations("color-accent", colors.accent),
    ...ScaleDeclarations("color-gray", colors.gray),
    ...ScaleDeclarations("color-success", colors.semantic.success),
    ...ScaleDeclarations("color-warning", colors.semantic.warning),
    ...ScaleDeclarations("color-error", colors.semantic.error),
    ...ScaleDeclarations("color-info", colors.semantic.info),
    ...RoleDeclarations("surface", colors.surface),
    ...RoleDeclarations("text", colors.text),
    ...RoleDeclarations("border", colors.border),
    ...Object.entries(scheme.shadows).map<Declaration>(([level, value]) => [
      `${PREFIX}-shadow-${level}`,
      value,
    ]),
  ];
}

export function StaticDeclarations(): Declaration[] {
  const declarations: Declaration[] = [];

  for (const [name, scale] of Object.entries(palettes)) {
    declarations.push(...ScaleDeclarations(`palette-${name}`, scale));
  }

  declarations.push(
    [`${PREFIX}-font-family-sans`, font.family.sans],
    [`${PREFIX}-font-family-mono`, font.family.mono],
  );
  for (const [name, px] of Object.entries(font.size)) {
    declarations.push([`${PREFIX}-font-size-${name}`, Rem(px)]);
  }
  for (const [name, value] of Object.entries(font.leading)) {
    declarations.push([`${PREFIX}-leading-${name}`, String(value)]);
  }
  for (const [name, value] of Object.entries(font.lineHeight)) {
    declarations.push([`${PREFIX}-line-height-${name}`, String(value)]);
  }
  for (const [name, value] of Object.entries(font.weight)) {
    declarations.push([`${PREFIX}-font-weight-${name}`, String(value)]);
  }
  for (const [name, value] of Object.entries(font.letterSpacing)) {
    declarations.push([`${PREFIX}-letter-spacing-${name}`, `${String(value)}em`]);
  }

  for (const [name, units] of Object.entries(spacing.scale)) {
    declarations.push([`${PREFIX}-space-${name}`, Rem(units * spacing.unit)]);
  }

  for (const [name, px] of Object.entries(radius)) {
    declarations.push([`${PREFIX}-radius-${name}`, name === "full" ? `${String(px)}px` : Rem(px)]);
  }

  for (const [name, px] of Object.entries(sizes.control)) {
    declarations.push([`${PREFIX}-size-control-${name}`, Rem(px)]);
  }
  for (const [name, px] of Object.entries(sizes.compact)) {
    declarations.push([`${PREFIX}-size-compact-${name}`, Rem(px)]);
  }

  for (const [name, ms] of Object.entries(animation.duration)) {
    declarations.push([`${PREFIX}-duration-${name}`, `${String(ms)}ms`]);
  }
  for (const [name, curve] of Object.entries(animation.easing)) {
    declarations.push([`${PREFIX}-easing-${name}`, curve]);
  }

  for (const [name, value] of Object.entries(zIndex)) {
    declarations.push([`${PREFIX}-z-${name}`, String(value)]);
  }

  return declarations;
}

export function ReducedMotionDeclarations(): Declaration[] {
  return Object.keys(animation.duration).map<Declaration>((name) => [
    `${PREFIX}-duration-${name}`,
    "0ms",
  ]);
}

export function BuildTokensCss(): string {
  const light = SchemeDeclarations(LIGHT_SCHEME);
  const dark = SchemeDeclarations(DARK_SCHEME);

  const sections = [
    Block(":root", [["color-scheme", "light dark"], ...StaticDeclarations(), ...light]),
    Block(':root[data-theme="light"],\n[data-theme="light"]', [
      ["color-scheme", "light"],
      ...light,
    ]),
    "@media (prefers-color-scheme: dark) {\n" +
      Block(':root:not([data-theme="light"])', [["color-scheme", "dark"], ...dark], "  ") +
      "\n}",
    Block(':root[data-theme="dark"],\n[data-theme="dark"]', [["color-scheme", "dark"], ...dark]),
    "@media (prefers-reduced-motion: reduce) {\n" +
      Block(":root", ReducedMotionDeclarations(), "  ") +
      "\n}",
  ];

  return `${sections.join("\n\n")}\n`;
}
