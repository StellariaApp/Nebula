import { Box, SearchInput } from "@stellaria/nebula-web";
import type { ReactElement } from "react";

export default function SearchInputBasic(): ReactElement {
  return (
    <Box maw={360}>
      <SearchInput label="Search" placeholder="Type to filter…" />
    </Box>
  );
}
