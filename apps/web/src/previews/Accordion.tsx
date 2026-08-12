import { Accordion } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Accordion
      w={360}
      data={[
        { value: "what", label: "What is Nebula", content: "A universal UI library." },
        { value: "how", label: "How it themes", content: "One object, seven axes." },
      ]}
    />
  ),
};

export default preview;
