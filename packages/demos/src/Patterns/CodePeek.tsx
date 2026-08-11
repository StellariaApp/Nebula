"use client";

import {
  Button,
  Card,
  Chip,
  CodeHighlight,
  Segment,
  Text,
  Title,
  Tooltip,
  GlassSurface,
  GradientBackground,
  StarField,
  Flex,
  Divider,
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
  component: string;
  view: string;
  tooltip: string;
  info: string;
}

const FALLBACK: CodePeekLabels = {
  filename: "app/listing.tsx",
  copy: "Copy the snippet",
  copied: "Copied",
  code: "Code",
  component: "component",
  view: "What to show",
  tooltip: "The scene is gradients over theme vars, so it retints too",
  info: "About this surface",
};

function Rendered({ labels }: { labels: CodePeekLabels }): ReactElement {
  return (
    <Flex w="100%" align="center" justify="center">
      <Card padding="none" shadow="none" w={320}>
        <Tooltip
          label={labels.tooltip}
          withArrow
          trigger={
            <Flex
              z={1}
              h={168}
              position="relative"
              overflow="hidden"
              bg="transparent"
              align="flex-end"
            >
              <GlassSurface position="absolute" bottom={12} right={12} p="xxs" gap="md">
                <Chip size="sm" variant="filled" icon={TROPHY}>
                  Guest Favorite
                </Chip>
              </GlassSurface>
            </Flex>
          }
        />
        <GradientBackground position="absolute" inset={0}>
          <StarField color="light.100" accentColor="light.100" translucency={12} />
        </GradientBackground>
        <GlassSurface
          level="strong"
          display="flex"
          direction="column"
          rtr="none"
          rtl="none"
          bdw={0}
          bdtw={1}
        >
          <Flex direction="column" gap="md" py="md" px="lg">
            <Flex direction="column" gap="xxs">
              <Title order={3} fz="h5" lh="normal">
                Swiss Chalet
              </Title>
              <Text fz="body2" c="text.secondary" lh="relaxed">
                Cozy wooden chalet nestled in the Swiss Alps, with a warm fireplace and direct
                access to the ski slopes.
              </Text>
            </Flex>
          </Flex>
          <Divider color="text.primary.10" />
          <Flex direction="row" gap="md" py="md" px="lg">
            <Button fullWidth r="full">
              Reserve now
            </Button>
          </Flex>
        </GlassSurface>
      </Card>
    </Flex>
  );
}

export default function CodePeek({ labels }: { labels?: CodePeekLabels }): ReactElement {
  const text = labels ?? FALLBACK;
  const [view, set_view] = useState("component");

  return (
    <Segment value={view} size="sm" onChange={set_view}>
      <Flex direction="column" gap="md" h="max-content" align="center" justify="center">
        <Flex w="100%" align="center" justify="space-between" gap="sm">
          <Text fz="caption" c="text.muted" ff="mono">
            {text.filename}
          </Text>
          <Segment.Control
            aria-label={text.view}
            data={[
              { value: "component", label: text.component },
              { value: "code", label: text.code },
            ]}
          />
        </Flex>
        <Segment.Content auto autoWidth swipeable loop gap="md">
          <Segment.Content.Item value="component">
            <Rendered labels={text} />
          </Segment.Content.Item>
          <Segment.Content.Item value="code">
            <CodeHighlight
              variant="glass"
              code={SNIPPET}
              lang="tsx"
              withCopy
              r="lg"
              h={420}
              miw={480}
              labels={{ copy: text.copy, copied: text.copied }}
            />
          </Segment.Content.Item>
        </Segment.Content>
      </Flex>
    </Segment>
  );
}
