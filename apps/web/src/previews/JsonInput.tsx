import { JsonInput } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: <JsonInput w={320} label="Theme JSON" defaultValue={`{ "scheme": "dark" }`} />,
};

export default preview;
