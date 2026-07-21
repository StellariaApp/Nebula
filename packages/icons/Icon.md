# @stellaria/nebula-icons

Iconos de Nebula (ADR-008 + ADR-023). Dos formas de usarlos según necesites tipado o dinamismo, más packs curados. lucide es el **set base recomendado** y **peer opcional**: el core no depende de lucide en runtime (registra desde tu lucide o desde tus propios SVG).

## Tipado: `CreateIcons` (recomendado)

La app crea su set una vez; `name` se infiere de las claves (autocompletado + error de compilación si el nombre no existe). Sin estado global, sin module augmentation, tree-shakeable.

```ts
import { CreateIcons } from "@stellaria/nebula-icons";
import { Home, Search } from "lucide-react";
import { DashboardPack } from "@stellaria/nebula-icons/packs";

export const { Icon } = CreateIcons({ home: Home, search: Search, ...DashboardPack });

<Icon name="home" />          // ✔ autocompleta
<Icon name="dashboard" />     // ✔ del pack
<Icon name="xxx" />           // ✘ error de compilación
```

Devuelve `{ Icon, names, has }` (`has` es type-guard para validar nombres en runtime).

## Packs curados — `@stellaria/nebula-icons/packs`

`NavigationPack` · `ActionsPack` · `StatusPack` · `DashboardPack` · `FormsPack` · `MediaPack` · `FilesPack` · `CommunicationPack` · `CommonPack` · `AllIconsPack` (todos). Se componen por spread y quedan tipados:

```ts
import { CreateIcons } from "@stellaria/nebula-icons";
import { CommonPack, DashboardPack } from "@stellaria/nebula-icons/packs";

export const { Icon } = CreateIcons({ ...CommonPack, ...DashboardPack });
```

Importar un pack bundlea sus iconos (de tu lucide, tree-shakeado); el core y los demás packs no se arrastran (subpath, ADR-014).

## Dinámico: registry global + `RegisterIcons`

Cuando los nombres no se conocen en compilación (plugins, CMS, API), usa el `Icon` global con `name: string`:

```ts
import { Icon, RegisterIcons } from "@stellaria/nebula-icons";
RegisterIcons(iconsFromServer);
<Icon name={nameFromApi} />
```

## a11y y tamaño

Sin `label` el icono es decorativo (`aria-hidden`, `focusable="false"`); con `label` pasa a `role="img"` + `aria-label`. Tamaño por defecto `1em` (escala con el texto) y color `currentColor` (lo tiñe el componente web que lo use, no el paquete de iconos, que vive por debajo del tema).

## Naming

`CreateIcons`/`RegisterIcons` y los packs (`CommonPack`…) van en PascalCase (ADR-019: funciones y constantes globales admiten PascalCase). `IconName` es `string`: el tipado fuerte lo da `CreateIcons`, no module augmentation — el patrón de interfaz augmentable de ADR-008 choca con el lint estricto (ver ADR-023).
