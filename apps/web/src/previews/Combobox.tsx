import { Combobox } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Combobox
      w={280}
      label="Component"
      placeholder="Type to filter"
      data={[
        { value: "button", label: "Button" },
        { value: "badge", label: "Badge" },
        { value: "card", label: "Card" },
      ]}
    />
  ),
};

export default preview;
