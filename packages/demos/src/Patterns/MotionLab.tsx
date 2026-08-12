"use client";

import {
  ActionIcon,
  AnimatedGradient,
  Badge,
  Box,
  Button,
  Card,
  Code,
  Countdown,
  GradientBorder,
  GradientText,
  HoverCard,
  Loader,
  Progress,
  Reveal,
  Skeleton,
  Text,
  ThemeIcon,
  Transition,
  useTheme,
} from "@stellaria/nebula-web";
import { useEffect, useState, type ReactElement, type ReactNode } from "react";

import { useOnScreen } from "../use-on-screen";

const SPRINGS = ["gentle", "default", "snappy"] as const;

const PRESETS = ["scale", "pop", "slide-up", "slide-right"] as const;

const TICK = 2200;

const BOLT = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M13 2L4 14h6l-1 8 9-12h-6z" />
  </svg>
);

const HEART = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 20s-7-4.5-7-9a4 4 0 017-2.6A4 4 0 0119 11c0 4.5-7 9-7 9z" />
  </svg>
);

function Cell({ title, children }: { title: string; children: ReactNode }): ReactElement {
  return (
    <Card withBorder r="md" p="md" h="100%">
      <Box display="flex" direction="column" gap="sm" h="100%">
        <Text fz="caption" c="text.muted" fw="semibold" tt="uppercase" ls="wide">
          {title}
        </Text>
        {children}
      </Box>
    </Card>
  );
}

function Pulse(): ReactElement {
  const [phase, set_phase] = useState(-1);
  const { theme } = useTheme();
  const [ref, visible] = useOnScreen();

  useEffect(() => {
    if (theme.motion.tier === "minimal" || !visible) return;
    const timer = window.setInterval(() => {
      set_phase((value) => (value + 1) % PRESETS.length);
    }, TICK);
    return () => {
      window.clearInterval(timer);
    };
  }, [theme.motion.tier, visible]);

  return (
    <Box ref={ref} display="flex" direction="column" gap="xs" mih={124}>
      {PRESETS.map((preset, index) => (
        <Transition key={preset} mounted={phase !== index} transition={preset}>
          <Box display="flex">
            <Badge variant="light" size="sm">
              {preset}
            </Badge>
          </Box>
        </Transition>
      ))}
    </Box>
  );
}

function Ticking(): ReactElement {
  const [mounted, set_mounted] = useState(false);
  const [ref, visible] = useOnScreen();

  useEffect(() => {
    set_mounted(true);
  }, []);

  return (
    <Box ref={ref}>
      {mounted && visible ? (
        <Countdown to="2027-01-01T00:00:00.000Z" size="sm" withSeconds />
      ) : (
        <Skeleton h={44} r="sm" />
      )}
    </Box>
  );
}

function Tokens(): ReactElement {
  const { theme } = useTheme();
  const rows = [
    { name: "tier", value: theme.motion.tier },
    { name: "duration.base", value: `${String(theme.motion.duration.base)}ms` },
    { name: "spring.default", value: `${String(theme.motion.spring.default.stiffness)}` },
  ];

  return (
    <Box display="flex" direction="column" gap="xs">
      {rows.map((row) => (
        <Box key={row.name} display="flex" justify="space-between" align="baseline" gap="sm">
          <Code>{row.name}</Code>
          <Text fz="caption" c="text.secondary" ta="end">
            {row.value}
          </Text>
        </Box>
      ))}
      <Text fz="caption" c="text.muted" lh="normal">
        Everything on this page reads these, never a hardcoded duration.
      </Text>
    </Box>
  );
}

export default function MotionLab(): ReactElement {
  const [busy, set_busy] = useState(false);
  const { theme } = useTheme();

  return (
    <Box
      display="grid"
      gap="md"
      gridTemplateColumns={{
        base: "1fr",
        tablet: "repeat(2, minmax(0, 1fr))",
        laptop: "repeat(3, minmax(0, 1fr))",
      }}
    >
      <Cell title="Tokens in force">
        <Tokens />
      </Cell>

      <Cell title="Springs, staggered">
        {SPRINGS.map((spring, index) => (
          <Reveal key={spring} spring={spring} index={index}>
            <Box display="flex" align="center" gap="sm">
              <ThemeIcon size="sm" variant="light" radius="full">
                {BOLT}
              </ThemeIcon>
              <Text fz="body3">{spring}</Text>
            </Box>
          </Reveal>
        ))}
      </Cell>

      <Cell title="Presets, on a loop">
        <Pulse />
      </Cell>

      <GradientBorder beam r="md" width={2} h="100%">
        <Card r="inherit" p="md" h="100%">
          <Box display="flex" direction="column" gap="sm" h="100%">
            <Text fz="caption" c="text.muted" fw="semibold" tt="uppercase" ls="wide">
              The beam
            </Text>
            <Text fz="caption" c="text.muted" lh="normal">
              A lit border that sweeps the perimeter. It stops flat at <Code>minimal</Code>.
            </Text>
            <Box display="flex" align="center" gap="sm" mt="auto">
              <Loader size="sm" />
              <Text fz="caption" c="text.secondary">
                {theme.motion.tier}
              </Text>
            </Box>
          </Box>
        </Card>
      </GradientBorder>

      <Cell title="Animated gradient">
        <AnimatedGradient r="sm" p="md" h="100%">
          <Box display="flex" direction="column" gap="xs" justify="center" h="100%">
            <Text fz="body2" fw="semibold" c="text.inverted">
              Brand in motion
            </Text>
            <Text fz="caption" c="text.inverted">
              The stops drift; the tier decides whether they move at all.
            </Text>
          </Box>
        </AnimatedGradient>
      </Cell>

      <Cell title="Indeterminate work">
        <Box display="flex" direction="column" gap="sm">
          <Progress indeterminate size="sm" label="Working" />
          <Skeleton h={12} r="sm" />
          <Skeleton h={12} r="sm" w="70%" />
          <Button
            size="sm"
            variant="outline"
            loading={busy}
            onPress={() => {
              set_busy((value) => !value);
            }}
          >
            {busy ? "Stop" : "Start"}
          </Button>
        </Box>
      </Cell>

      <Cell title="Counting down">
        <Ticking />
      </Cell>

      <Cell title="Hover, with intent">
        <Box display="flex" align="center" gap="sm">
          <HoverCard
            trigger={
              <ActionIcon variant="light" size="lg" r="full" aria-label="Reactions">
                {HEART}
              </ActionIcon>
            }
          >
            <Box display="flex" direction="column" gap="xxs" p="xs">
              <Text fz="body3" fw="semibold">
                Opens on intent
              </Text>
              <Text fz="caption" c="text.muted">
                Enter and exit delays come from the theme, not from a magic number.
              </Text>
            </Box>
          </HoverCard>
          <Text fz="caption" c="text.muted" lh="normal">
            Hover the button.
          </Text>
        </Box>
      </Cell>

      <Cell title="Gradient text">
        <Box display="flex" direction="column" gap="xs" justify="center" h="100%">
          <Text fz="h4" fw="bold">
            <GradientText>Same switch</GradientText>
          </Text>
          <Text fz="caption" c="text.muted" lh="normal">
            One theme object retunes colour, type, motion and glass at once.
          </Text>
        </Box>
      </Cell>
    </Box>
  );
}
