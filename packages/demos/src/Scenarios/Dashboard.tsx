"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  GradientBorder,
  GradientText,
  Progress,
  Stat,
  StatusBadge,
  Table,
  Text,
  Timeline,
  Title,
} from "@stellaria/nebula-web";
import type { ReactElement } from "react";

import { Deferred } from "../defer";

const AreaChart = Deferred(async () => (await import("@stellaria/nebula-web/charts")).AreaChart);
const SparkLine = Deferred(async () => (await import("@stellaria/nebula-web/charts")).SparkLine);

const FLOW = [
  { month: "Feb", matched: 812, pending: 96 },
  { month: "Mar", matched: 947, pending: 71 },
  { month: "Apr", matched: 1024, pending: 88 },
  { month: "May", matched: 1102, pending: 54 },
  { month: "Jun", matched: 1180, pending: 47 },
  { month: "Jul", matched: 1248, pending: 36 },
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

const CARDS = [
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
];

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

export function Dashboard(): ReactElement {
  return (
    <Box display="flex" direction="column" gap="md">
      <Head />
      <Box
        display="grid"
        gap="md"
        gridTemplateColumns={{ base: "1fr", tablet: "repeat(3, minmax(0, 1fr))" }}
      >
        {CARDS.map((item) => (
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
        <GradientBorder beam r="md" h="100%">
          <Card p="md" h="100%">
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
        </GradientBorder>
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
    </Box>
  );
}
