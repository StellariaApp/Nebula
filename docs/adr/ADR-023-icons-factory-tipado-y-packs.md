# ADR-023 — Icons: factory tipado `CreateIcons` + packs curados (extiende ADR-008)

- **Estado**: aceptada · 2026-07-21 (checkpoint W2.2 con el propietario)
- **Contexto**: ADR-008 fijó `@stellaria/nebula-icons` = componente `Icon` + registry con `RegisterIcons` y ampliación de `IconName` por **module augmentation**. Al implementarlo (W2.2) surgieron dos problemas: (1) la interfaz augmentable vacía `IconRegistry` choca con el lint estricto del monorepo (`no-empty-object-type` + `no-redundant-type-constituents`) y no se puede exonerar con `eslint-disable` (ADR-019 prohíbe comentarios); (2) el registro es **runtime** y el tipo se necesita en **compilación** — con augmentation, registro y `declare module` son dos fuentes de verdad que pueden divergir. El propietario pidió tipar `Icon name=` a partir de los iconos registrados y disponer de packs para dashboards/apps.

## Decisión

### 1. `CreateIcons(map)` — factory tipado (mecanismo principal)

```ts
import { CreateIcons } from "@stellaria/nebula-icons";
import { Home, Search } from "lucide-react";
import { DashboardPack } from "@stellaria/nebula-icons/packs";

export const { Icon, names, has } = CreateIcons({ home: Home, search: Search, ...DashboardPack });
// Icon: name se INFIERE de las claves -> autocompletado + error si el nombre no existe
```

`name` se infiere del objeto (`Extract<keyof M, string>`). **Sin augmentation, sin tocar lint, sin estado global mutable, tree-shakeable.** Devuelve `{ Icon, names, has }` (`has` es type-guard). La app crea su set una vez y usa el `Icon` tipado en todas sus vistas.

### 2. Packs curados en subpath `@stellaria/nebula-icons/packs`

`NavigationPack`, `ActionsPack`, `StatusPack`, `DashboardPack`, `FormsPack`, `MediaPack`, `FilesPack`, `CommunicationPack`, `CommonPack` y `AllIconsPack` (une todos). Cada uno es `Record<nombre, IconComponent>` que re-exporta lucide; se componen por spread y el resultado queda tipado por `CreateIcons`. Nombres de export en **PascalCase** (ADR-019: constantes globales admiten PascalCase). Aislados en subpath (ADR-014): el core (`Icon`/`CreateIcons`) no los arrastra.

### 3. Registry global + `RegisterIcons` — se conserva para casos dinámicos

Cuando los nombres no se conocen en compilación (plugins, CMS, nombres desde API), el `Icon` global + `RegisterIcons` siguen disponibles con `name: string`.

### 4. `lucide-react` como peerDependency **opcional**

El core de iconos no depende de lucide (registry agnóstico + `CreateIcons` acepta cualquier `IconComponent`, incl. SVG propios). lucide entra solo si usas los packs o registras iconos de lucide; por eso es peer opcional. Consecuencia: size-limit externaliza lucide, así que las entradas miden el **glue propio de Nebula** (~200 B `Icon`/`CreateIcons`; ~880 B con un pack), no el peso de lucide (que el consumidor ya tree-shakea por imports nombrados).

## Consecuencias

- `IconName` público queda como `string` (el tipado fuerte lo da `CreateIcons`, no la augmentation). Se abandona el mecanismo de module augmentation de ADR-008 por incompatibilidad con el lint; la capacidad (nombres tipados) se cumple mejor con el factory.
- API pública nueva: `CreateIcons`, `CreatedIconProps`, `IconSet`, subpath `/packs`. `Icon`/`RegisterIcons`/`ResolveIcon`/`HasIcon`/`RegisteredIconNames`/`ClearIcons` se mantienen.
- Native (`@stellaria/nebula-native-icons`, futuro) replicará `CreateIcons` con `lucide-react-native` para paridad W/N (ADR-008).
