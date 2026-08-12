import { StatusBadge } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: <StatusBadge status="paid" map={{ paid: { label: "Paid", color: "success" } }} />,
};

export default preview;
