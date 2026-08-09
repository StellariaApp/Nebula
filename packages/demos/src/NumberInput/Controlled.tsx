"use client";

import { Box, NumberInput } from "@stellaria/nebula-web";
import { useState, type ReactElement } from "react";

export default function NumberInputControlled(): ReactElement {
  const [value, set_value] = useState(3);

  return (
    <Box maw={220}>
      <NumberInput label="Quantity" value={value} onChange={set_value} min={0} max={10} />
    </Box>
  );
}
