"use client";

import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  FileInput,
  Progress,
  Select,
  Stepper,
  TagsInput,
  Text,
  TextInput,
  Timeline,
  Title,
} from "@stellaria/nebula-web";
import type { ReactElement } from "react";

const STEPS = [
  { label: "Account", description: "Email and password" },
  { label: "Workspace", description: "Name and members" },
  { label: "Connect", description: "Bank and ledger" },
  { label: "Done", description: "Start reconciling" },
];

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

export function Onboarding(): ReactElement {
  return (
    <Box display="flex" direction="column" gap="md">
      <Card withBorder r="md" p="md" reveal={{ index: 0 }}>
        <Stepper steps={STEPS} active={2} variant="light" />
      </Card>

      <Box
        display="grid"
        gap="md"
        gridTemplateColumns={{ base: "1fr", laptop: "minmax(0, 3fr) minmax(0, 2fr)" }}
        reveal={{ index: 1 }}
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

        <Card withBorder r="md" p="md" reveal={{ index: 2 }}>
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
    </Box>
  );
}
