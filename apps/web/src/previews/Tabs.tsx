import { Tabs, Text } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Tabs
      w={360}
      data={[
        {
          value: "preview",
          label: "Preview",
          content: <Text fz="body3">The rendered component.</Text>,
        },
        {
          value: "code",
          label: "Code",
          content: <Text fz="body3">The snippet that made it.</Text>,
        },
      ]}
    />
  ),
};

export default preview;
