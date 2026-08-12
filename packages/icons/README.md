# @stellaria/nebula-icons

One `Icon` component over an extensible registry, with the same names on web and native and
tree-shaking per icon.

## Install

```bash
pnpm add @stellaria/nebula-icons
pnpm add lucide-react   # optional: only if you use the bundled pack
```

`react` is a peer. `lucide-react` is an **optional** peer: without it the component still works with
whatever you register yourself.

## What you get

```tsx
import { Icon } from "@stellaria/nebula-icons";

<Icon name="check" size={20} />;
```

Register your own, and they answer to the same names on both platforms:

```tsx
import { CreateIcons } from "@stellaria/nebula-icons";

const icons = CreateIcons({ invoice: MyInvoiceSvg });
```

The bundled pack lives behind a subpath so you only pay for what you import:

```tsx
import { lucide } from "@stellaria/nebula-icons/packs";
```

## Compatibility

React 19.2+. ESM only. Node 20+ to build.

## Documentation

<https://nebula.stellaria.app>

## Licence

MIT.
