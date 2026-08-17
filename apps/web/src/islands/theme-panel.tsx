"use client";

import { useTheme } from "@stellaria/nebula-hooks";
import {
  ChoiceFromTheme,
  ResolveChoice,
  BRAND_STOPS,
  THEME_NAMES,
  type Corner,
  type Density,
  type ThemeChoice,
  type ThemeName,
} from "@stellaria/nebula-demos/themes/products";
import {
  ActionIcon,
  Affix,
  Box,
  Popover,
  ColorSwatch,
  Divider,
  GlassSurface,
  Radio,
  RadioGroup,
  Segment,
  Switch,
  Text,
} from "@stellaria/nebula-web";
import type { MotionTier } from "@stellaria/nebula-tokens";
import { useEffect, useId, useRef, useState, type ReactElement } from "react";

const TIERS: readonly MotionTier[] = ["minimal", "standard", "expressive"];

const CORNERS: readonly Corner[] = ["sharp", "soft", "round"];

const DENSITIES: readonly Density[] = ["compact", "cosy", "roomy"];

export interface ThemePanelLabels {
  open: string;
  close: string;
  region: string;
  product: string;
  scheme: string;
  dark: string;
  light: string;
  motion: string;
  glass: string;
  corner: string;
  density: string;
  lede: string;
}

const SLIDERS = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M4 8h10M18 8h2M4 16h4M12 16h8" />
    <circle cx="16" cy="8" r="2" />
    <circle cx="10" cy="16" r="2" />
  </svg>
);

const CLOSE = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

function Brand(name: ThemeName): string {
  const [from, to] = BRAND_STOPS[name];
  return `linear-gradient(120deg, ${from}, ${to})`;
}

export function ThemePanel({
  labels,
  anchored = false,
}: {
  labels: ThemePanelLabels;
  /** En la barra: el disparador va en línea y el panel se abre hacia abajo, colgado de él. */
  anchored?: boolean | undefined;
}): ReactElement {
  const { theme, setTheme } = useTheme();
  const [open, set_open] = useState(false);
  const panel_id = useId();
  const shell = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || anchored) return;

    const Away = (event: PointerEvent): void => {
      const node = shell.current;
      if (node !== null && !node.contains(event.target as Node)) set_open(false);
    };
    const Escape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") set_open(false);
    };

    document.addEventListener("pointerdown", Away);
    document.addEventListener("keydown", Escape);
    return () => {
      document.removeEventListener("pointerdown", Away);
      document.removeEventListener("keydown", Escape);
    };
  }, [open, anchored]);

  const choice = ChoiceFromTheme(theme);
  const { name, scheme } = choice;

  function Apply(patch: Partial<ThemeChoice>): void {
    setTheme(ResolveChoice({ ...choice, ...patch }));
  }

  const panel = (
    <GlassSurface
      component="section"
      id={panel_id}
      level={anchored ? "band" : "strong"}
      withBorder={!anchored}
      r="lg"
      p="lg"
      w={368}
      mah="calc(100dvh - 140px)"
      overflow="auto"
      display="flex"
      direction="column"
      gap="md"
      aria-label={labels.region}
    >
      <Box display="flex" align="flex-start" justify="space-between" gap="sm">
        <Box display="flex" direction="column" gap="xxs">
          <Text fz="body2" fw="semibold">
            {labels.region}
          </Text>
          <Text fz="caption" c="text.muted">
            {labels.lede}
          </Text>
        </Box>
        <ActionIcon
          size="sm"
          variant="ghost"
          r="full"
          aria-label={labels.close}
          onPress={() => {
            set_open(false);
          }}
        >
          {CLOSE}
        </ActionIcon>
      </Box>

      <Divider />

      <RadioGroup
        label={labels.product}
        value={name}
        size="sm"
        onChange={(value) => {
          Apply({ name: value as ThemeName });
        }}
      >
        {THEME_NAMES.map((entry) => (
          <Radio
            key={entry}
            value={entry}
            label={
              <Box display="flex" align="center" gap="sm">
                <ColorSwatch color={Brand(entry)} size={16} />
                <Text fz="body3" tt="capitalize">
                  {entry}
                </Text>
              </Box>
            }
          />
        ))}
      </RadioGroup>

      <Divider />

      <Box display="flex" direction="column" gap="xs">
        <Text fz="caption" c="text.muted" fw="semibold" tt="uppercase" ls="wide">
          {labels.scheme}
        </Text>
        <Segment
          value={scheme}
          size="sm"
          fullWidth
          onChange={(value) => {
            Apply({ scheme: value === "light" ? "light" : "dark" });
          }}
        >
          <Segment.Control
            aria-label={labels.scheme}
            data={[
              { value: "dark", label: labels.dark },
              { value: "light", label: labels.light },
            ]}
          />
        </Segment>
      </Box>

      <Box display="flex" direction="column" gap="xs">
        <Text fz="caption" c="text.muted" fw="semibold" tt="uppercase" ls="wide">
          {labels.corner}
        </Text>
        <Segment
          value={choice.corner}
          size="sm"
          fullWidth
          onChange={(value) => {
            Apply({ corner: value as Corner });
          }}
        >
          <Segment.Control aria-label={labels.corner} data={[...CORNERS]} />
        </Segment>
      </Box>

      <Box display="flex" direction="column" gap="xs">
        <Text fz="caption" c="text.muted" fw="semibold" tt="uppercase" ls="wide">
          {labels.density}
        </Text>
        <Segment
          value={choice.density}
          size="sm"
          fullWidth
          onChange={(value) => {
            Apply({ density: value as Density });
          }}
        >
          <Segment.Control aria-label={labels.density} data={[...DENSITIES]} />
        </Segment>
      </Box>

      <Box display="flex" direction="column" gap="xs">
        <Text fz="caption" c="text.muted" fw="semibold" tt="uppercase" ls="wide">
          {labels.motion}
        </Text>
        <Segment
          value={theme.motion.tier}
          size="sm"
          fullWidth
          onChange={(value) => {
            Apply({ motion: value as MotionTier });
          }}
        >
          <Segment.Control aria-label={labels.motion} data={[...TIERS]} />
        </Segment>
      </Box>

      <Switch
        size="sm"
        label={labels.glass}
        checked={theme.effects.glass.enabled}
        onChange={(checked) => {
          Apply({ glass: checked });
        }}
      />
    </GlassSurface>
  );

  const trigger = (
    <ActionIcon
      size={anchored ? "md" : "lg"}
      r="full"
      variant="glass"
      glass="strong"
      aria-label={open ? labels.close : labels.open}
      aria-expanded={open}
      {...(open ? { "aria-controls": panel_id } : {})}
      onPress={() => {
        set_open((value) => !value);
      }}
    >
      {SLIDERS}
    </ActionIcon>
  );

  if (anchored) {
    return (
      <Popover
        trigger={trigger}
        opened={open}
        onOpenChange={set_open}
        placement="bottom end"
        padding="none"
        radius="lg"
      >
        {panel}
      </Popover>
    );
  }

  return (
    <Affix position={{ bottom: 24, right: 24 }}>
      <Box ref={shell} display="flex" direction="column" align="flex-end" gap="sm">
        {open ? panel : null}
        {trigger}
      </Box>
    </Affix>
  );
}
