"use client";

import CodePeek from "@stellaria/nebula-demos/Patterns/CodePeek";
import {
  Badge,
  Box,
  ButtonCopy,
  Code,
  Divider,
  GlassSurface,
  GradientBorder,
} from "@stellaria/nebula-web";
import type { ReactElement } from "react";

export interface HeroPreviewLabels {
  copy: string;
  copied: string;
  checks: string;
  filename: string;
  snippetCopy: string;
  code: string;
  component: string;
  view: string;
  tooltip: string;
  info: string;
}

const INSTALL = "pnpm add @stellaria/nebula-web";

export function HeroPreview({ labels }: { labels: HeroPreviewLabels }): ReactElement {
  return (
    <GradientBorder
      beam
      r="xl"
      width={2}
      w={{
        base: "100%",
        laptop: "max-content",
      }}
    >
      <GlassSurface level="default" p="lg" r="xl" display="flex" direction="column" gap="md">
        <CodePeek
          labels={{
            filename: labels.filename,
            copy: labels.snippetCopy,
            copied: labels.copied,
            code: labels.code,
            component: labels.component,
            view: labels.view,
            tooltip: labels.tooltip,
            info: labels.info,
          }}
        />
        <Divider />
        <Box display="flex" align="center" justify="space-between" gap="sm" wrap="wrap">
          <Box display="flex" align="center" gap="xs">
            <Code>{INSTALL}</Code>
            <ButtonCopy
              size="sm"
              variant="ghost"
              value={INSTALL}
              copyLabel={labels.copy}
              copiedLabel={labels.copied}
            />
          </Box>
          <Badge variant="light" color="success" size="sm">
            {labels.checks}
          </Badge>
        </Box>
      </GlassSurface>
    </GradientBorder>
  );
}
