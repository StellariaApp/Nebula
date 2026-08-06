import {
  Card as CardRoot,
  CardActions,
  CardBadges,
  CardImage,
  CardMeta,
  CardSection,
} from "./Card.js";

export const Card = /* @__PURE__ */ Object.assign(CardRoot, {
  Section: CardSection,
  Image: CardImage,
  Badges: CardBadges,
  Meta: CardMeta,
  Actions: CardActions,
});

export { CardActions, CardBadges, CardImage, CardMeta, CardSection };
export type { CardImageProps, CardProps, CardSectionProps, CardSlotProps } from "./Card.types.js";
