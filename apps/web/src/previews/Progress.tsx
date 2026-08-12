import { Progress } from "@stellaria/nebula-web";
import { States } from "./kit";
import type { Preview } from "./types";

const preview: Preview = {
  base: <Progress value={64} w={240} />,
  groups: [
    States(
      { label: "0", node: <Progress value={0} w={200} /> },
      { label: "64", node: <Progress value={64} w={200} /> },
      { label: "100", node: <Progress value={100} w={200} /> },
    ),
  ],
};

export default preview;
