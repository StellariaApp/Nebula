"use client";

import { Segment } from "@stellaria/nebula-web";
import { type ComponentType, type ReactElement } from "react";

import { Deferred } from "../defer";

export const SCENARIOS = ["dashboard", "mail", "finances", "onboarding", "settings"] as const;

export type Scenario = (typeof SCENARIOS)[number];

const HOLD = 620;

const VIEWS: Record<Scenario, ComponentType<{ height?: number | undefined }>> = {
  dashboard: Deferred(async () => (await import("../Scenarios/Dashboard")).Dashboard),
  mail: Deferred(async () => (await import("../Scenarios/Mail")).Mail),
  finances: Deferred(async () => (await import("../Scenarios/Finances")).Finances),
  onboarding: Deferred(async () => (await import("../Scenarios/Onboarding")).Onboarding),
  settings: Deferred(async () => (await import("../Scenarios/Settings")).Settings),
};

export default function Scenarios({ scenario }: { scenario: Scenario }): ReactElement {
  const View = VIEWS[scenario];
  return (
    <Segment.Content w="100%" gap="lg">
      <Segment.Content.Item key={scenario} value={scenario}>
        <View height={HOLD} />
      </Segment.Content.Item>
    </Segment.Content>
  );
}
