import { ImageGallery } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <ImageGallery
      w={320}
      cols={3}
      images={[
        { src: "/logo.svg", alt: "Nebula" },
        { src: "/icon.svg", alt: "Nebula mark" },
        { src: "/logo.svg", alt: "Nebula again" },
      ]}
    />
  ),
};

export default preview;
