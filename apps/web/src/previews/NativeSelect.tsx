import { NativeSelect } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <NativeSelect
      w={240}
      label="Density"
      data={[
        { value: "compact", label: "Compact" },
        { value: "normal", label: "Normal" },
      ]}
    />
  ),
};

export default preview;
