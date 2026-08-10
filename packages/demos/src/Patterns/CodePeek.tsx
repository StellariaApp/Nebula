"use client";

import {
  Box,
  Button,
  Card,
  Chip,
  CodeHighlight,
  Segment,
  Text,
  Title,
  Tooltip,
  Transition,
  GlassSurface,
  GradientBackground,
  StarField,
} from "@stellaria/nebula-web";
import { useState, type ReactElement } from "react";

const SNIPPET = `<Card padding="none" r="xl" withBorder>
  <Box h={168} style={{ background: SCENE }}>
    <NoiseOverlay />
  </Box>

  <Box px="lg" pb="lg" pt="md" display="flex" direction="column" gap="sm">
    <Title order={3} fz="h5">Swiss Chalet</Title>

    <Text fz="body3" c="text.secondary" lh="relaxed">
      Cozy wooden chalet nestled in the Swiss Alps,
      with a warm fireplace and direct access to
      the ski slopes.
    </Text>

    <Box display="flex" gap="xs">
      <Chip size="sm" icon={<Trophy />} defaultChecked>
        Guest Favorite
      </Chip>
      <Chip size="sm">4 Night Stay</Chip>
    </Box>

    <Button fullWidth r="full">Reserve now</Button>
  </Box>
</Card>`;

const HEIGHT = 412;
const SCENE_HEIGHT = 168;

const TROPHY = (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M8 4h8v5a4 4 0 01-8 0zM8 6H5v1a3 3 0 003 3M16 6h3v1a3 3 0 01-3 3M10 17h4M9 20h6" />
  </svg>
);

export interface CodePeekLabels {
  filename: string;
  copy: string;
  copied: string;
  code: string;
  result: string;
  view: string;
  tooltip: string;
  info: string;
}

const FALLBACK: CodePeekLabels = {
  filename: "app/listing.tsx",
  copy: "Copy the snippet",
  copied: "Copied",
  code: "Code",
  result: "Result",
  view: "What to show",
  tooltip: "The scene is gradients over theme vars, so it retints too",
  info: "About this surface",
};

function Rendered({ labels }: { labels: CodePeekLabels }): ReactElement {
  return (
    <Box display="flex" align="center" justify="center" h="100%" w="100%">
      <Card padding="none" r="xl" shadow="none" withBorder w="100%" maw={320} overflow="hidden">
        <Tooltip
          label={labels.tooltip}
          withArrow
          trigger={
            <Box h={SCENE_HEIGHT} w="100%" position="relative" overflow="hidden" bg="transparent" />
          }
        />
        <GradientBackground
          position="absolute"
          inset={0}
          gradient={{
            to: "primary.500",
            from: "text.primary.10",
          }}
        >
          <StarField color="light.100" accentColor="light.100" translucency={12} />
        </GradientBackground>
        <GlassSurface display="flex" direction="column" gap="sm" p="md" r="none" bdw={0} bdtw={1}>
          <Box gap="sm">
            <Title order={3} fz="h5">
              Swiss Chalet
            </Title>
            <Text fz="body2" c="text.secondary" lh="relaxed">
              Cozy wooden chalet nestled in the Swiss Alps, with a warm fireplace and direct access
              to the ski slopes.
            </Text>
          </Box>
          <Box display="flex" gap="xs" wrap="wrap">
            <Chip align="center" size="sm" variant="light" icon={TROPHY} defaultChecked>
              Guest Favorite
            </Chip>
            <Chip align="center" size="sm" variant="outline" defaultChecked>
              4 Night Stay
            </Chip>
          </Box>
          <Button fullWidth r="full">
            Reserve now
          </Button>
        </GlassSurface>
      </Card>
    </Box>
  );
}

export default function CodePeek({ labels }: { labels?: CodePeekLabels }): ReactElement {
  const text = labels ?? FALLBACK;
  const [view, set_view] = useState("result");

  return (
    <Box display="flex" direction="column" gap="md">
      <Box display="flex" align="center" justify="space-between" gap="sm">
        <Text fz="caption" c="text.muted" ff="mono">
          {text.filename}
        </Text>
        <Segment value={view} size="sm" onChange={set_view}>
          <Segment.Control
            aria-label={text.view}
            data={[
              { value: "code", label: text.code },
              { value: "result", label: text.result },
            ]}
          />
        </Segment>
      </Box>

      <Box position="relative" h={HEIGHT}>
        <Transition mounted={view === "code"} transition="fade" position="absolute" inset={0}>
          <CodeHighlight
            code={SNIPPET}
            lang="tsx"
            withCopy
            h={HEIGHT}
            r="lg"
            maxHeight={HEIGHT}
            labels={{ copy: text.copy, copied: text.copied }}
          />
        </Transition>
        <Transition mounted={view === "result"} transition="fade" position="absolute" inset={0}>
          <Rendered labels={text} />
        </Transition>
      </Box>
    </Box>
  );
}
