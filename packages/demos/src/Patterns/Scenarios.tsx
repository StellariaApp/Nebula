"use client";

import { Segment } from "@stellaria/nebula-web";
import { useEffect, useState, type ComponentType, type ReactElement } from "react";

import { Deferred } from "../defer";
import { ScenarioComponents } from "../Scenarios/Components";

export const SCENARIOS = [
  "components",
  "dashboard",
  "mail",
  "finances",
  "onboarding",
  "settings",
] as const;

export type Scenario = (typeof SCENARIOS)[number];

const HOLD = 620;

const VIEWS: [Scenario, ComponentType<{ height?: number | undefined }>][] = [
  ["components", ScenarioComponents],
  ["dashboard", Deferred(async () => (await import("../Scenarios/Dashboard")).Dashboard)],
  ["mail", Deferred(async () => (await import("../Scenarios/Mail")).Mail)],
  ["finances", Deferred(async () => (await import("../Scenarios/Finances")).Finances)],
  ["onboarding", Deferred(async () => (await import("../Scenarios/Onboarding")).Onboarding)],
  ["settings", Deferred(async () => (await import("../Scenarios/Settings")).Settings)],
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
      {VIEWS.map(([name, View], position) => (
        <Segment.Content.Item key={name} value={name}>
          {Math.abs(position - index) <= 1 || seen.includes(name) ? <View height={HOLD} /> : null}
        </Segment.Content.Item>
      ))}
    </Segment.Content>
  );
}
