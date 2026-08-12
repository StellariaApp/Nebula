import { GlassSurface, Text } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <GlassSurface p="md" r="md" w={240}>
      <Text fz="body3">Glass over the page background.</Text>
    </GlassSurface>
  ),
  groups: [
    {
      title: "level",
      items: (["band", "control", "subtle", "default", "strong"] as const).map((level) => ({
        label: level,
        node: (
          <GlassSurface level={level} p="sm" r="md" w={120}>
            <Text fz="caption">{level}</Text>
          </GlassSurface>
        ),
      })),
    },
  ],
};

export default preview;
