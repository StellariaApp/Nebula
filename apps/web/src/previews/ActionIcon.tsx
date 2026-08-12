import { ActionIcon, Tooltip } from "@stellaria/nebula-web";
import { FULL, SIZES, ByVariant, BySize, STAR } from "./kit";
import type { Preview } from "./types";

const preview: Preview = {
  base: <ActionIcon aria-label="Star">{STAR}</ActionIcon>,
  groups: [
    ByVariant(FULL, (variant) => (
      <ActionIcon variant={variant} aria-label="Star">
        {STAR}
      </ActionIcon>
    )),
    BySize(SIZES, (size) => (
      <ActionIcon size={size} aria-label="Star">
        {STAR}
      </ActionIcon>
    )),
  ],
  usage: {
    code: `<Tooltip label="Add to favourites" trigger={
<ActionIcon variant="light" aria-label="Add to favourites">
  <Star />
</ActionIcon>
} />`,
    node: (
      <Tooltip
        label="Add to favourites"
        trigger={
          <ActionIcon variant="light" aria-label="Add to favourites">
            {STAR}
          </ActionIcon>
        }
      />
    ),
  },
};

export default preview;
