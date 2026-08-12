import { TransferList } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <TransferList
      w={420}
      height={160}
      data={[
        { value: "charts", label: "Charts" },
        { value: "datagrid", label: "DataGrid" },
        { value: "editor", label: "RichTextEditor" },
      ]}
      defaultValue={["charts"]}
    />
  ),
};

export default preview;
