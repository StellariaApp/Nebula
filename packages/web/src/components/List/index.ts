import { ListItem } from "./components/Item.js";
import { List as ListRoot } from "./List.js";

export const List = /* @__PURE__ */ Object.assign(ListRoot, { Item: ListItem });

export { ListItem };
export type {
  ListItemOwnProps,
  ListItemProps,
  ListOwnProps,
  ListProps,
  ListType,
} from "./List.types.js";
