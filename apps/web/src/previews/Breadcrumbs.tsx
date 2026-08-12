import { Breadcrumbs } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Breadcrumbs
      items={[
        { key: "guides", label: "Guides", href: "/guides/getting-started" },
        { key: "components", label: "Components", href: "/guides/components" },
        { key: "button", label: "Button" },
      ]}
    />
  ),
};

export default preview;
