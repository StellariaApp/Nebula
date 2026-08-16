"use client";

import { Badge, ButtonCopy, Code, Flex, GlassSurface, GradientBorder } from "@stellaria/nebula-web";
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
    <GradientBorder beam r="xl">
      <GlassSurface level="default" p="lg" r="xl" display="flex" direction="column" gap="md">
        <Flex
          direction={{
            base: "column",
            laptop: "row",
          }}
          justify={{
            base: "center",
            laptop: "space-between",
          }}
          align="center"
          gap="sm"
        >
          <Flex justify="center" align="center" gap="xs">
            <Code>{INSTALL}</Code>
            <ButtonCopy
              size="sm"
              variant="ghost"
              value={INSTALL}
              copyLabel={labels.copy}
              copiedLabel={labels.copied}
            />
          </Flex>
          <Badge variant="light" color="success" size="sm">
            {labels.checks}
          </Badge>
        </Flex>
      </GlassSurface>
    </GradientBorder>
  );
}
