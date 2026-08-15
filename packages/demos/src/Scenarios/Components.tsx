"use client";

import {
  Anchor,
  AnimatedGradient,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Code,
  Divider,
  GradientBorder,
  GradientText,
  Indicator,
  Kbd,
  Loader,
  PasswordInput,
  PinInput,
  Progress,
  Rating,
  Skeleton,
  Slider,
  StatusBadge,
  Switch,
  Text,
  TextInput,
} from "@stellaria/nebula-web";
import { useState, type ReactElement, type ReactNode } from "react";

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

function Working(): ReactElement {
  const [busy, set_busy] = useState(false);

  return (
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
  );
}

export function ScenarioComponents(): ReactElement {
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
      <Card withBorder r="md" p="md">
        <Box display="flex" direction="column" gap="md">
          <TextInput label="Your email" placeholder="ana@email.com" required />
          <PasswordInput label="Password" placeholder="••••••••" />
        </Box>
      </Card>

      <Card withBorder r="md" p="md">
        <Box display="flex" direction="column" gap="md">
          <Text fz="body2" fw="semibold">
            Verify account
          </Text>
          <Text fz="caption" c="text.muted">
            We sent a code to a****@email.com
          </Text>
          <PinInput length={4} defaultValue="43" aria-label="Verification code" />
          <Box display="flex" gap="sm" align="center">
            <Text fz="caption" c="text.muted">
              Didn&apos;t get it?
            </Text>
            <Anchor href="#resend" fz="caption">
              Resend
            </Anchor>
          </Box>
        </Box>
      </Card>

      <Card withBorder r="md" p="md">
        <Box display="flex" direction="column" gap="md">
          <Box display="flex" gap="sm" align="center" wrap="wrap">
            <Button size="sm">Filled</Button>
            <Button size="sm" variant="outline">
              Outline
            </Button>
            <Button size="sm" variant="gradient">
              Gradient
            </Button>
            <Button size="sm" variant="glass">
              Glass
            </Button>
          </Box>
          <Divider />
          <Box display="flex" gap="md" align="center" wrap="wrap">
            <Checkbox defaultChecked label="Checkbox" />
            <Switch defaultChecked label="Switch" />
          </Box>
          <Rating defaultValue={4} aria-label="Rating" />
        </Box>
      </Card>

      <Card withBorder r="md" p="md">
        <Box display="flex" direction="column" gap="md">
          <Box display="flex" justify="space-between" align="baseline">
            <Text fz="body2" fw="semibold">
              Price
            </Text>
            <Text fz="body3" c="text.secondary">
              USD 250.00
            </Text>
          </Box>
          <Slider defaultValue={62} label="Price" />
          <Divider />
          <Box display="flex" gap="xs" align="center" wrap="wrap">
            <Text fz="caption" c="text.muted">
              Open the palette
            </Text>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </Box>
        </Box>
      </Card>

      <Card withBorder r="md" p="md">
        <Box display="flex" direction="column" gap="sm">
          <Box display="flex" align="center" gap="sm">
            <Indicator processing>
              <Avatar name="Ana Ruiz" color="primary" variant="light" />
            </Indicator>
            <Box display="flex" direction="column">
              <Text fz="body3" fw="semibold">
                Ana Ruiz
              </Text>
              <Text fz="caption" c="text.muted">
                Reconciliation lead
              </Text>
            </Box>
          </Box>
          <Divider />
          <Box display="flex" gap="xs" wrap="wrap">
            <StatusBadge status="matched" size="sm" />
            <Badge variant="light" size="sm" color="info">
              Verified
            </Badge>
            <Badge variant="outline" size="sm">
              Admin
            </Badge>
          </Box>
          <Code>@stellaria/nebula-web</Code>
        </Box>
      </Card>

      <Cell title="Indeterminate work">
        <Working />
      </Cell>

      <GradientBorder beam r="md" width={2} h="100%">
        <Card p="md" h="100%">
          <Box display="flex" direction="column" gap="sm" h="100%">
            <Text fz="caption" c="text.muted" fw="semibold" tt="uppercase" ls="wide">
              The beam
            </Text>
            <Text fz="caption" c="text.muted" lh="normal">
              A lit border that sweeps the perimeter. It stops flat at <Code>minimal</Code>.
            </Text>
            <Box display="flex" align="center" gap="sm" mt="auto">
              <Loader size="sm" />
            </Box>
          </Box>
        </Card>
      </GradientBorder>

      <Cell title="Animated gradient">
        <AnimatedGradient r="sm" p="md" h="100%">
          <Box display="flex" direction="column" gap="xs" justify="center" h="100%">
            <Text fz="body2" fw="semibold" c="text.onGradient">
              Brand in motion
            </Text>
            <Text fz="caption" c="text.onGradient">
              The stops drift; the tier decides whether they move at all.
            </Text>
          </Box>
        </AnimatedGradient>
      </Cell>

      <Cell title="Gradient text">
        <Box display="flex" direction="column" gap="xs" justify="center" h="100%">
          <Text fz="h4" fw="bold">
            <GradientText>Same switch</GradientText>
          </Text>
          <Text fz="caption" c="text.muted" lh="normal">
            One switch retunes colour, type, motion and glass at once.
          </Text>
        </Box>
      </Cell>
    </Box>
  );
}
