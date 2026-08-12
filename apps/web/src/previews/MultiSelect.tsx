import { MultiSelect } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <MultiSelect
      w={300}
      label="Subpaths"
      data={[
        { value: "charts", label: "/charts" },
        { value: "datagrid", label: "/datagrid" },
        { value: "editor", label: "/editor" },
      ]}
    />
  ),
};

export default preview;
