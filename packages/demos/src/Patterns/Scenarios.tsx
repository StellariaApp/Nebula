"use client";

import {
  Accordion,
  ActionIcon,
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Code,
  Divider,
  FileInput,
  GradientText,
  Kbd,
  NavLink,
  Progress,
  SearchInput,
  Segment,
  Select,
  Stat,
  StatusBadge,
  Stepper,
  Switch,
  Table,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Timeline,
  Title,
} from "@stellaria/nebula-web";
import { useEffect, useState, type ReactElement, type ReactNode } from "react";

import { Deferred } from "../defer";
import { ScenarioComponents } from "../Scenarios/Components";

const AreaChart = Deferred(async () => (await import("@stellaria/nebula-web/charts")).AreaChart);
const BarChart = Deferred(async () => (await import("@stellaria/nebula-web/charts")).BarChart);
const PieChart = Deferred(async () => (await import("@stellaria/nebula-web/charts")).PieChart);
const SparkLine = Deferred(async () => (await import("@stellaria/nebula-web/charts")).SparkLine);

const FLOW = [
  { month: "Feb", matched: 812, pending: 96 },
  { month: "Mar", matched: 947, pending: 71 },
  { month: "Apr", matched: 1024, pending: 88 },
  { month: "May", matched: 1102, pending: 54 },
  { month: "Jun", matched: 1180, pending: 47 },
  { month: "Jul", matched: 1248, pending: 36 },
];

const WEEK = [
  { day: "Mon", volume: 41 },
  { day: "Tue", volume: 58 },
  { day: "Wed", volume: 36 },
  { day: "Thu", volume: 72 },
  { day: "Fri", volume: 64 },
];

const SERIES = [
  { key: "matched", label: "Matched", color: "primary" },
  { key: "pending", label: "Pending", color: "warning" },
] as const;

const LEDGER = [
  { id: "MX-4471", account: "0012 3456", amount: "184,200.00", state: "matched" },
  { id: "MX-4470", account: "0012 3456", amount: "92,860.40", state: "matched" },
  { id: "MX-4468", account: "0044 1902", amount: "31,004.15", state: "review" },
  { id: "MX-4465", account: "0091 7730", amount: "7,412.00", state: "matched" },
] as const;

const ACTIVITY = [
  { title: "Statement imported", meta: "09:04", description: "1,284 movements from BBVA" },
  { title: "Rules applied", meta: "09:06", description: "1,248 matched automatically" },
  { title: "Awaiting review", meta: "09:07", description: "36 need a human" },
] as const;

const THREADS = [
  {
    who: "Carlos Iglesias",
    when: "10:21",
    subject: "Launch recap",
    unread: true,
    tag: "Work",
    tone: "info",
  },
  {
    who: "Stripe",
    when: "Yesterday",
    subject: "Invoice INV-0241 is due",
    unread: true,
    tag: "Billing",
    tone: "warning",
  },
  {
    who: "Maya Okafor",
    when: "Mon",
    subject: "Design review: v3",
    unread: false,
    tag: undefined,
    tone: undefined,
  },
  {
    who: "Parker Wren",
    when: "Fri",
    subject: "Q2 growth plan",
    unread: false,
    tag: undefined,
    tone: undefined,
  },
  {
    who: "Amelia Ruiz",
    when: "Apr 22",
    subject: "Weekly summary",
    unread: false,
    tag: "Travel",
    tone: "success",
  },
] as const;

const LABELS = [
  { label: "Work", color: "semantic.info.500" },
  { label: "Billing", color: "semantic.warning.500" },
  { label: "Travel", color: "semantic.success.500" },
  { label: "Urgent", color: "semantic.error.500" },
] as const;

const SPEND = [
  { name: "Rent", value: 1400 },
  { name: "Food", value: 620 },
  { name: "Transport", value: 210 },
  { name: "Other", value: 340 },
];

const TXN = [
  { id: "0xaa2b", type: "Contract", asset: "ETH", value: "0.1231", fiat: "320.65", when: "Dec 8" },
  { id: "0xbb4e", type: "Received", asset: "USDC", value: "500.00", fiat: "500.00", when: "Dec 7" },
  { id: "0xcc71", type: "Swap", asset: "SOL", value: "1.4200", fiat: "277.66", when: "Dec 5" },
] as const;

const STEPS = [
  { label: "Account", description: "Email and password" },
  { label: "Workspace", description: "Name and members" },
  { label: "Connect", description: "Bank and ledger" },
  { label: "Done", description: "Start reconciling" },
];

const FAQ = [
  {
    value: "themes",
    label: "How does theming work?",
    content:
      "One NebulaTheme object retunes colour, type, geometry, density, motion and glass across the whole catalogue.",
  },
  {
    value: "platforms",
    label: "Does it run on React Native?",
    content: "The contract lives in the tokens; each platform implements only the visual layer.",
  },
  {
    value: "budget",
    label: "How big is it?",
    content:
      "size-limit measures every entry point in brotli kB and fails the build when it drifts.",
  },
];

const MAILBOXES = [
  { label: "Inbox", count: "4" },
  { label: "Starred", count: "2" },
  { label: "Sent", count: undefined },
  { label: "Archive", count: undefined },
];

const HOLDINGS = [
  { asset: "BTC", name: "Bitcoin", value: "1,283.84", diff: "+2.34%", trend: "up" },
  { asset: "ETH", name: "Ethereum", value: "1,087.25", diff: "-1.12%", trend: "down" },
  { asset: "SOL", name: "Solana", value: "195.54", diff: "+4.72%", trend: "up" },
] as const;

const STATES = [
  { value: "mx", label: "Mexico" },
  { value: "es", label: "Spain" },
  { value: "co", label: "Colombia" },
];

const PROMISES = [
  { title: "Rules engine", description: "1,248 movements matched without a human" },
  { title: "Audit trail", description: "Every decision, with who and when" },
  { title: "Exports", description: "CSV, MT940 and your ERP" },
] as const;

const MEMBERS = [
  { who: "Ana Ruiz", role: "Admin", state: "matched" },
  { who: "Beto Lima", role: "Editor", state: "matched" },
  { who: "Cruz Vega", role: "Viewer", state: "review" },
] as const;

export const SCENARIOS = [
  "components",
  "dashboard",
  "mail",
  "finances",
  "onboarding",
  "settings",
] as const;

export type Scenario = (typeof SCENARIOS)[number];

function Shell({ children }: { children: ReactNode }): ReactElement {
  return (
    <Box display="flex" direction="column" gap="md">
      {children}
    </Box>
  );
}

function Head(): ReactElement {
  return (
    <Box display="flex" align="flex-end" justify="space-between" gap="md" wrap="wrap">
      <Box display="flex" direction="column" gap="xs" align="flex-start">
        <Badge variant="light">Reconciliation</Badge>
        <Title order={3} fz="h3">
          <GradientText>Every movement, matched</GradientText>
        </Title>
        <Text fz="body2" c="text.secondary" maw="52ch">
          One catalogue, one set of props. Everything you see is retinted by the theme alone.
        </Text>
      </Box>
      <Box display="flex" gap="sm" align="center" wrap="wrap">
        <Button size="sm" variant="gradient">
          Close period
        </Button>
        <Button size="sm" variant="outline">
          Export
        </Button>
      </Box>
    </Box>
  );
}

function Dashboard(): ReactElement {
  return (
    <Shell>
      <Head />
      <Box
        display="grid"
        gap="md"
        gridTemplateColumns={{ base: "1fr", tablet: "repeat(3, minmax(0, 1fr))" }}
      >
        {[
          {
            label: "Matched",
            value: "1,248",
            diff: "+12%",
            trend: "up",
            spark: [812, 947, 1024, 1102, 1180, 1248],
            color: "primary",
          },
          {
            label: "Pending",
            value: "36",
            diff: "-24%",
            trend: "down",
            spark: [96, 71, 88, 54, 47, 36],
            color: "warning",
          },
          {
            label: "Settled today",
            value: "MXN 4.2M",
            diff: "+3.1%",
            trend: "up",
            spark: [3.1, 3.4, 3.2, 3.8, 4, 4.2],
            color: "success",
          },
        ].map((item) => (
          <Card key={item.label} withBorder r="md" p="md">
            <Box display="flex" direction="column" gap="sm">
              <Stat
                label={item.label}
                value={item.value}
                diff={item.diff}
                trend={item.trend as "up" | "down"}
                diffLabel={item.trend === "up" ? "increase" : "decrease"}
              />
              <SparkLine
                data={item.spark}
                color={item.color as "primary"}
                height={34}
                withArea
                label={`${item.label} trend`}
              />
            </Box>
          </Card>
        ))}
      </Box>

      <Box
        display="grid"
        gap="md"
        gridTemplateColumns={{ base: "1fr", laptop: "minmax(0, 3fr) minmax(0, 2fr)" }}
      >
        <Card withBorder r="md" p="md">
          <AreaChart
            data={FLOW}
            series={[...SERIES]}
            xAxis={{ key: "month" }}
            height={196}
            withLegend
            withTooltip
            withGrid
            fillOpacity={0.22}
            curve="monotone"
            title="Matched against pending"
            summary="Matched rose from 812 in February to 1,248 in July while pending fell from 96 to 36."
          />
        </Card>
        <Card withBorder r="md" p="md">
          <Box display="flex" direction="column" gap="md">
            <Text fz="body2" fw="semibold">
              Today
            </Text>
            <Timeline items={[...ACTIVITY]} active={2} variant="light" />
            <Divider />
            <Box display="flex" direction="column" gap="xs">
              <Box display="flex" justify="space-between" align="baseline">
                <Text fz="caption" c="text.muted">
                  Auto-match rate
                </Text>
                <Text fz="caption" fw="semibold">
                  97.2%
                </Text>
              </Box>
              <Progress value={97.2} color="success" size="sm" label="Auto-match rate" />
            </Box>
          </Box>
        </Card>
      </Box>

      <Card withBorder r="md" padding="none">
        <Table highlightOnHover density="compact" caption="Latest movements" captionVisible={false}>
          <Table.Head>
            <Table.Row>
              <Table.Title>Reference</Table.Title>
              <Table.Title>Account</Table.Title>
              <Table.Title>Amount</Table.Title>
              <Table.Title>State</Table.Title>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {LEDGER.map((row) => (
              <Table.Row key={row.id}>
                <Table.Cell>
                  <Text fz="body3" fw="medium">
                    {row.id}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text fz="body3" c="text.secondary">
                    {row.account}
                  </Text>
                </Table.Cell>
                <Table.Cell numeric>{row.amount}</Table.Cell>
                <Table.Cell>
                  <StatusBadge status={row.state} size="sm" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </Shell>
  );
}

function Mail(): ReactElement {
  return (
    <Shell>
      <Box
        display="grid"
        gap="md"
        gridTemplateColumns={{
          base: "1fr",
          laptop: "minmax(0, 1fr) minmax(0, 2fr) minmax(0, 2fr)",
        }}
      >
        <Card withBorder r="md" p="sm">
          <Box display="flex" direction="column" gap="xxs">
            <Button size="sm" variant="gradient" fullWidth>
              New email
            </Button>
            <Divider my="xs" />
            {MAILBOXES.map((box, index) => (
              <NavLink
                key={box.label}
                label={box.label}
                active={index === 0}
                {...(box.count === undefined
                  ? {}
                  : {
                      rightSection: (
                        <Badge variant="light" size="xs">
                          {box.count}
                        </Badge>
                      ),
                    })}
              />
            ))}
            <Divider my="xs" />
            <Text fz="caption" c="text.muted" fw="semibold" tt="uppercase" ls="wide" px="xs">
              Labels
            </Text>
            {LABELS.map((tag) => (
              <Box key={tag.label} display="flex" align="center" gap="sm" px="xs" py="xxs">
                <Box w={8} h={8} r="full" bg={tag.color} />
                <Text fz="body3" c="text.secondary">
                  {tag.label}
                </Text>
              </Box>
            ))}
          </Box>
        </Card>

        <Card withBorder r="md" padding="none">
          <Box display="flex" direction="column">
            <Box p="sm" bdbw={1} bdbs="solid" bdc="border.subtle">
              <SearchInput size="sm" placeholder="Search mail" aria-label="Search mail" />
            </Box>
            {THREADS.map((thread, index) => (
              <Box
                key={thread.subject}
                p="sm"
                bg={index === 0 ? "surface.hover" : undefined}
                bdbw={index === THREADS.length - 1 ? 0 : 1}
                bdbs="solid"
                bdc="border.subtle"
                display="flex"
                gap="sm"
                align="flex-start"
              >
                <Avatar name={thread.who} size="sm" variant="light" color="accent" />
                <Box display="flex" direction="column" gap="xxs" style={{ minWidth: 0, flex: 1 }}>
                  <Box display="flex" justify="space-between" gap="sm" align="baseline">
                    <Text fz="body3" fw={thread.unread ? "semibold" : "regular"}>
                      {thread.who}
                    </Text>
                    <Text fz="caption" c="text.muted">
                      {thread.when}
                    </Text>
                  </Box>
                  <Text fz="caption" c="text.secondary">
                    {thread.subject}
                  </Text>
                  {thread.tag === undefined ? null : (
                    <Box display="flex">
                      <Badge variant="light" size="xs" color={thread.tone}>
                        {thread.tag}
                      </Badge>
                    </Box>
                  )}
                </Box>
                {thread.unread ? <Box w={8} h={8} r="full" bg="primary.500" /> : null}
              </Box>
            ))}
          </Box>
        </Card>

        <Card withBorder r="md" p="md">
          <Box display="flex" direction="column" gap="sm">
            <Box display="flex" justify="space-between" align="center" gap="sm">
              <Title order={4} fz="h6">
                Launch recap
              </Title>
              <Box display="flex" gap="xs">
                <ActionIcon size="sm" variant="ghost" aria-label="Archive">
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M3 7h18v4H3zM5 11v9h14v-9M9 15h6" />
                  </svg>
                </ActionIcon>
                <ActionIcon size="sm" variant="ghost" aria-label="Delete">
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" />
                  </svg>
                </ActionIcon>
              </Box>
            </Box>
            <Box display="flex" align="center" gap="sm">
              <Avatar name="Carlos Iglesias" size="sm" variant="light" />
              <Box display="flex" direction="column">
                <Text fz="body3" fw="semibold">
                  Carlos Iglesias
                </Text>
                <Text fz="caption" c="text.muted">
                  to me · 10:21
                </Text>
              </Box>
            </Box>
            <Divider />
            <Text fz="body3" c="text.secondary" lh="relaxed">
              We agreed on the final launch date and the three must-ship items: onboarding tour,
              billing update flow, and the analytics dashboard.
            </Text>
            <Box display="flex" align="center" gap="sm" p="xs" r="sm" bg="surface.sunken">
              <ThemeIcon size="sm" variant="light" radius="sm">
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M14 3v5h5M6 3h9l5 5v13H6z" />
                </svg>
              </ThemeIcon>
              <Box display="flex" direction="column" style={{ minWidth: 0, flex: 1 }}>
                <Text fz="body3" fw="medium">
                  go-no-go.pdf
                </Text>
                <Text fz="caption" c="text.muted">
                  248 kB
                </Text>
              </Box>
              <ActionIcon size="sm" variant="ghost" aria-label="Download attachment">
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" />
                </svg>
              </ActionIcon>
            </Box>
            <Textarea placeholder="Reply…" autosize rows={2} aria-label="Reply" />
            <Box display="flex" justify="space-between" align="center" gap="sm" wrap="wrap">
              <Box display="flex" gap="sm">
                <Button size="sm" variant="gradient">
                  Send
                </Button>
                <Button size="sm" variant="ghost">
                  Later
                </Button>
              </Box>
              <Box display="flex" gap="xs" align="center">
                <Kbd>⌘</Kbd>
                <Kbd>↵</Kbd>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </Shell>
  );
}

function Finances(): ReactElement {
  return (
    <Shell>
      <Box
        display="grid"
        gap="md"
        gridTemplateColumns={{ base: "1fr", tablet: "repeat(4, minmax(0, 1fr))" }}
      >
        {[
          { label: "Total balance", value: "USD 5,427.48", diff: "+5.32%", trend: "up" },
          { label: "24h change", value: "USD 120.18", diff: "+2.24%", trend: "up" },
          { label: "Top performer", value: "SOL", diff: "+4.72%", trend: "up" },
          { label: "Holdings", value: "8", diff: undefined, trend: undefined },
        ].map((item) => (
          <Card key={item.label} withBorder r="md" p="md">
            <Stat
              label={item.label}
              value={item.value}
              {...(item.diff === undefined
                ? {}
                : {
                    diff: item.diff,
                    trend: item.trend as "up",
                    diffLabel: "increase",
                  })}
            />
          </Card>
        ))}
      </Box>

      <Box
        display="grid"
        gap="md"
        gridTemplateColumns={{ base: "1fr", laptop: "minmax(0, 3fr) minmax(0, 2fr)" }}
      >
        <Card withBorder r="md" p="md">
          <BarChart
            data={WEEK}
            series={[{ key: "volume", label: "Volume", color: "primary" }]}
            xAxis={{ key: "day" }}
            height={200}
            withTooltip
            withGrid
            radius={6}
            title="Weekly volume"
            summary="Volume peaked on Thursday at 72 and bottomed on Wednesday at 36."
          />
        </Card>

        <Card withBorder r="md" p="md">
          <Box display="flex" direction="column" gap="sm">
            <Box display="flex" justify="space-between" align="baseline">
              <Text fz="body2" fw="semibold">
                Holdings
              </Text>
              <Badge variant="light" size="sm">
                8
              </Badge>
            </Box>
            {HOLDINGS.map((row) => (
              <Box key={row.asset} display="flex" align="center" justify="space-between" gap="sm">
                <Box display="flex" align="center" gap="sm">
                  <Avatar name={row.asset} size="sm" variant="light" radius="full" />
                  <Box display="flex" direction="column">
                    <Text fz="body3" fw="semibold">
                      {row.asset}
                    </Text>
                    <Text fz="caption" c="text.muted">
                      {row.name}
                    </Text>
                  </Box>
                </Box>
                <Stat
                  label=""
                  value={row.value}
                  diff={row.diff}
                  trend={row.trend}
                  diffLabel={row.trend === "up" ? "increase" : "decrease"}
                />
              </Box>
            ))}
            <Button size="sm" variant="outline" fullWidth>
              See all holdings
            </Button>
          </Box>
        </Card>
      </Box>

      <Box
        display="grid"
        gap="md"
        gridTemplateColumns={{ base: "1fr", laptop: "minmax(0, 2fr) minmax(0, 3fr)" }}
      >
        <Card withBorder r="md" p="md">
          <PieChart
            data={SPEND}
            valueKey="value"
            labelKey="name"
            donut
            height={188}
            withLegend
            withTooltip
            title="Spending by category"
            summary="Rent is the largest category at 1,400, followed by food at 620."
          />
        </Card>

        <Card withBorder r="md" padding="none">
          <Table
            highlightOnHover
            density="compact"
            caption="Recent activity"
            captionVisible={false}
          >
            <Table.Head>
              <Table.Row>
                <Table.Title>Txn</Table.Title>
                <Table.Title>Type</Table.Title>
                <Table.Title>Asset</Table.Title>
                <Table.Title>Value</Table.Title>
                <Table.Title>Date</Table.Title>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {TXN.map((row) => (
                <Table.Row key={row.id}>
                  <Table.Cell>
                    <Code>{row.id}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="light" size="sm">
                      {row.type}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fz="body3" fw="medium">
                      {row.asset}
                    </Text>
                  </Table.Cell>
                  <Table.Cell numeric>{row.fiat}</Table.Cell>
                  <Table.Cell>
                    <Text fz="caption" c="text.muted">
                      {row.when}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      </Box>
    </Shell>
  );
}

function Onboarding(): ReactElement {
  return (
    <Shell>
      <Card withBorder r="md" p="md">
        <Stepper steps={STEPS} active={2} variant="light" />
      </Card>

      <Box
        display="grid"
        gap="md"
        gridTemplateColumns={{ base: "1fr", laptop: "minmax(0, 3fr) minmax(0, 2fr)" }}
      >
        <Card withBorder r="md" p="md">
          <Box display="flex" direction="column" gap="md">
            <Box display="flex" direction="column" gap="xxs" align="flex-start">
              <Badge variant="light" size="sm">
                Step 3 of 4
              </Badge>
              <Title order={3} fz="h5">
                Connect your ledger
              </Title>
              <Text fz="body3" c="text.secondary" maw="52ch">
                Nebula never sees your credentials. The resolver is injected by your app.
              </Text>
            </Box>
            <Divider />
            <Box
              display="grid"
              gap="md"
              gridTemplateColumns={{ base: "1fr", tablet: "repeat(2, minmax(0, 1fr))" }}
            >
              <TextInput label="Institution" placeholder="BBVA Mexico" required />
              <Select label="Country" placeholder="Select one" data={STATES} />
              <TextInput label="Account" placeholder="0012 3456 7890" />
              <TagsInput label="Cost centres" placeholder="Add and press enter" />
            </Box>
            <FileInput label="Statement" placeholder="Upload a CSV or MT940" />
            <Alert variant="light" color="info" title="Sandbox first">
              Nothing is written until you confirm the mapping on the next step.
            </Alert>
            <Box display="flex" gap="sm" wrap="wrap">
              <Button size="sm" variant="gradient">
                Continue
              </Button>
              <Button size="sm" variant="ghost">
                Back
              </Button>
            </Box>
          </Box>
        </Card>

        <Card withBorder r="md" p="md">
          <Box display="flex" direction="column" gap="md">
            <Text fz="body2" fw="semibold">
              What you get
            </Text>
            <Timeline items={[...PROMISES]} active={3} variant="light" />
            <Divider />
            <Box display="flex" direction="column" gap="xs">
              <Text fz="caption" c="text.muted">
                Setup progress
              </Text>
              <Progress value={75} size="sm" label="Setup progress" />
            </Box>
          </Box>
        </Card>
      </Box>
    </Shell>
  );
}

function Settings(): ReactElement {
  return (
    <Shell>
      <Box
        display="grid"
        gap="md"
        gridTemplateColumns={{ base: "1fr", laptop: "minmax(0, 2fr) minmax(0, 3fr)" }}
      >
        <Card withBorder r="md" p="md">
          <Box display="flex" direction="column" gap="md">
            <Box display="flex" align="center" gap="sm">
              <Avatar name="Ana Ruiz" size="lg" variant="light" color="primary" />
              <Box display="flex" direction="column">
                <Text fz="body2" fw="semibold">
                  Ana Ruiz
                </Text>
                <Text fz="caption" c="text.muted">
                  ana.ruiz@stellaria.dev
                </Text>
              </Box>
            </Box>
            <Divider />
            <Box display="flex" direction="column" gap="sm">
              <Switch defaultChecked label="Email digests" />
              <Switch defaultChecked label="Drift alerts" />
              <Switch label="Weekly export" />
              <Switch label="Beta features" />
            </Box>
            <Divider />
            <Alert variant="light" color="warning" title="Danger zone">
              Deleting a workspace removes every mapping in it.
            </Alert>
            <Button size="sm" variant="outline" color="error">
              Delete workspace
            </Button>
          </Box>
        </Card>

        <Card withBorder r="md" p="md">
          <Box display="flex" direction="column" gap="md">
            <Text fz="body2" fw="semibold">
              Frequently asked
            </Text>
            <Accordion data={FAQ} defaultValue="themes" />
            <Divider />
            <Text fz="body2" fw="semibold">
              Members
            </Text>
            {MEMBERS.map((row) => (
              <Box key={row.who} display="flex" align="center" justify="space-between" gap="sm">
                <Box display="flex" align="center" gap="sm">
                  <Avatar name={row.who} size="sm" variant="light" />
                  <Box display="flex" direction="column">
                    <Text fz="body3" fw="medium">
                      {row.who}
                    </Text>
                    <Text fz="caption" c="text.muted">
                      {row.role}
                    </Text>
                  </Box>
                </Box>
                <StatusBadge status={row.state} size="sm" />
              </Box>
            ))}
          </Box>
        </Card>
      </Box>
    </Shell>
  );
}

const VIEWS: [Scenario, ReactElement][] = [
  ["components", <ScenarioComponents />],
  ["dashboard", <Dashboard />],
  ["mail", <Mail />],
  ["finances", <Finances />],
  ["onboarding", <Onboarding />],
  ["settings", <Settings />],
];

export default function Scenarios({ active }: { active: Scenario }): ReactElement {
  const index = Math.max(
    0,
    VIEWS.findIndex(([name]) => name === active),
  );
  const [seen, set_seen] = useState<readonly Scenario[]>([]);

  useEffect(() => {
    set_seen((prev) => (prev.includes(active) ? prev : [...prev, active]));
  }, [active]);

  return (
    <Segment.Content w="100%" gap="lg" auto>
      {VIEWS.map(([name, view], position) => (
        <Segment.Content.Item key={name} value={name}>
          {Math.abs(position - index) <= 1 || seen.includes(name) ? view : null}
        </Segment.Content.Item>
      ))}
    </Segment.Content>
  );
}
