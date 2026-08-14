"use client";

import { Avatar, Badge, Box, Button, Card, Code, Stat, Table, Text } from "@stellaria/nebula-web";
import type { ReactElement } from "react";

import { Deferred } from "../defer";

const BarChart = Deferred(async () => (await import("@stellaria/nebula-web/charts")).BarChart);
const PieChart = Deferred(async () => (await import("@stellaria/nebula-web/charts")).PieChart);

const WEEK = [
  { day: "Mon", volume: 41 },
  { day: "Tue", volume: 58 },
  { day: "Wed", volume: 36 },
  { day: "Thu", volume: 72 },
  { day: "Fri", volume: 64 },
];

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

const HOLDINGS = [
  { asset: "BTC", name: "Bitcoin", value: "1,283.84", diff: "+2.34%", trend: "up" },
  { asset: "ETH", name: "Ethereum", value: "1,087.25", diff: "-1.12%", trend: "down" },
  { asset: "SOL", name: "Solana", value: "195.54", diff: "+4.72%", trend: "up" },
] as const;

const TOTALS = [
  { label: "Total balance", value: "USD 5,427.48", diff: "+5.32%", trend: "up" },
  { label: "24h change", value: "USD 120.18", diff: "+2.24%", trend: "up" },
  { label: "Top performer", value: "SOL", diff: "+4.72%", trend: "up" },
  { label: "Holdings", value: "8", diff: undefined, trend: undefined },
];

export function Finances(): ReactElement {
  return (
    <Box display="flex" direction="column" gap="md">
      <Box
        display="grid"
        gap="md"
        gridTemplateColumns={{ base: "1fr", tablet: "repeat(4, minmax(0, 1fr))" }}
      >
        {TOTALS.map((item) => (
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
    </Box>
  );
}
