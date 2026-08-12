import { Select } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Select
      w={280}
      label="Theme"
      placeholder="Pick one"
      data={[
        { value: "dark", label: "Dark" },
        { value: "light", label: "Light" },
        { value: "system", label: "System" },
      ]}
    />
  ),
};

export default preview;
