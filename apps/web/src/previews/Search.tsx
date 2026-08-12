import { Search } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Search
      w={360}
      labels={{ placeholder: "Search components", search: "Search", refresh: "Refresh" }}
    />
  ),
};

export default preview;
