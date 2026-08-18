# ADR-168 — El contrato CSS y su runtime se mudan a `@stellaria/nebula-themes`, aislados por plataforma

- **Estado**: **aceptada** · 2026-08-17 — decidida por el propietario
- **Cambia API pública**: sí, y **rompe**. `vars`, `ThemeToVars`, `themeClass` y `CompileTheme` dejan
  de exportarse desde `@stellaria/nebula-web`.
- **Añade dependencias**: `@vanilla-extract/css` (dev) y `@vanilla-extract/dynamic` (peer opcional)
  en `@stellaria/nebula-themes`. Requiere esta justificación por docs/01 §8.
- **Toca**: `docs/01` §8, `docs/02` §1 y §4, la estructura de `packages/themes`.

## Contexto

Un tema de producto no puede vivir donde vive hoy. `packages/demos` los construye —`BuildProduct`
sobre dos semillas de paleta— y `apps/web` los recompila por su cuenta en `lib/product-themes.ts`.
El playground tiene sus propias fixtures. Tres sitios construyendo lo mismo.

Mudarlos a `@stellaria/nebula-themes` es lo obvio. Lo que lo complica es que un consumidor no quiere
sólo el objeto: quiere **su clase y su CSS**, que es lo único que sirve para pintar sin parpadeo
([ADR-163](ADR-163-el-provider-acepta-un-tema-ya-materializado-como-clase.md),
[ADR-164](ADR-164-compile-theme-materializa-en-caliente.md)).

Y ahí aparece la pared. `CompileTheme` necesita los nombres de las custom properties, y **los genera
Vanilla Extract al compilar el contrato**:

```
vars.color.primary["500"]  →  var(--color-primary-500__z8cd5qb1)
```

El sufijo es un hash del fichero que declara el contrato. Nadie fuera de esa compilación puede
saberlo. Así que mientras `contract.css.ts` viva en `packages/web`, `CompileTheme` vive con él, y un
paquete de temas que no pueda materializar sus temas está a medias.

## Decisión

**El contrato CSS se muda a `@stellaria/nebula-themes`**, y `packages/web` lo importa. Eso **no**
invierte el grafo de docs/01 §8: la dirección es `tokens → themes → web`, y web importando de themes
va a favor.

### 1. Lo que se muda

| Qué                | De                       | A                                     |
| ------------------ | ------------------------ | ------------------------------------- |
| `contract.css.ts`  | `packages/web/src/theme`  | `packages/themes/src/web`             |
| `theme-vars.ts`    | `packages/web/src/theme`  | `packages/themes/src/web`             |
| `compile-theme.ts` | `packages/web/src/theme`  | `packages/themes/src/web`             |
| `identity.ts`      | `packages/web/src/theme`  | `packages/themes/src/web`             |
| `themes.css.ts`    | `packages/web/src/theme`  | `packages/themes/src/web`             |
| `ink.ts`           | `packages/web/src/theme`  | `packages/themes/src/web`             |
| `resolve-variant.ts` | `packages/web/src/theme` | `packages/themes/src/web`            |

`ink` y `resolve-variant` entran en la mudanza porque `theme-vars` los necesita, y al mirarlos se ve
que ya estaban mal colocados: `ink` no importa nada —es la decisión de tinta legible de ADR-021, pura
lógica sobre el tema— y `resolve-variant` traduce recetas del `variantMap` a `var()`. Los dos hablan
de temas, no de componentes.

`packages/web` conserva lo que sí es suyo —`layers` y `media`, capas de cascada y media queries— y
pasa a importar `vars` desde `@stellaria/nebula-themes/web`. Son 149 ficheros y es un cambio de ruta,
no de código.

### 2. La plataforma parte los subpaths

Es la condición que hace que esto no castigue a native:

```
@stellaria/nebula-themes            → datos: Light, Dark, Themes, LoadTheme, Schema
@stellaria/nebula-themes/<tema>     → datos de un tema
@stellaria/nebula-themes/all        → datos de todos

@stellaria/nebula-themes/web        → vars, CLASSES, CSS, CompileTheme
@stellaria/nebula-themes/<tema>/web → la clase y el CSS de ese tema
@stellaria/nebula-themes/all/web    → CLASSES y CSS de todos
```

Lo que se comparte entre plataformas no toca CSS. Lo que toca CSS lleva `/web` en la ruta y native no
lo importa nunca.

### 3. Las dependencias entran como peer opcional, no como dependencia

- **`@vanilla-extract/css`**: `devDependency`. Es de build — el plugin compila `createThemeContract`
  a CSS estático y deja en el JS sólo las cadenas de los nombres. No viaja al consumidor.
- **`@vanilla-extract/dynamic`**: **peer opcional**. Sólo lo usa `CompileTheme`, o sea sólo los
  subpaths `/web`. Quien no los importe no lo instala.

Es literalmente lo que docs/01 §8 prescribe para este caso: «las pesadas se aíslan en subpaths
tree-shakeables o **peers opcionales** para no castigar al consumidor que no las usa». `native`
depende de `themes` y sigue sin ver Vanilla Extract por ningún lado.

`packages/themes` pasa a construirse con Vite y el plugin de VE, como `packages/web`. Deja de ser
`tsc` plano.

### 4. La estructura es tema-esquema, y `official` pasa a `default`

```
packages/themes/src/themes/<tema>/<esquema>.ts
```

`nebula/dark.ts`, `nebula/light.ts`, `aurora/dark.ts`… La ruta dice los dos ejes de
[ADR-166](ADR-166-la-identidad-del-tema-y-su-esquema-son-ejes-distintos.md) sin repetirlos en el
nombre del fichero.

Todo lo que decía `official` pasa a `default`: `officialThemes` → `Themes`, `OfficialThemeName` →
`ThemeName`, `OFFICIAL_CLASSES` → `DEFAULT_CLASSES`. Con diez temas en el paquete, «oficial» dejó de
distinguir nada — todos lo son. Lo que distingue a `nebula` es que es **el de por defecto**.

### 5. Los temas de producto son variantes, y no entran en el gate de a11y

`check:contrast` sigue recorriendo el par por defecto y el tema de humo, no los trece. Los productos
son demostración de que el catálogo se retiñe, no superficies que Nebula certifique.

**Se acepta a sabiendas y queda escrito**: el paquete publica diez temas cuyo contraste nadie
verifica en CI. Quien los use en producto los valida con `pnpm check:contrast --theme <suyo>.json`,
que es el mismo motor. Si algún día uno de ellos pasa a ser el tema de un producto real, entra en el
gate ese día.

## Alternativas

**Dejar `CompileTheme` en web y que themes exporte sólo datos.** Es lo que hay y funciona. Se
descarta porque deja al consumidor juntando dos paquetes para una sola cosa, y porque la duplicación
que motiva este ADR —tres sitios construyendo los mismos temas— seguiría existiendo: nadie tendría un
sitio evidente donde ponerla.

**Mover el contrato a `@stellaria/nebula-tokens`.** Lo pondría aún más arriba y lo haría accesible a
todos. Se descarta sin discusión: tokens tiene **cero dependencias de runtime** por decisión cerrada,
y `createThemeContract` es Vanilla Extract.

**Un paquete nuevo, `@stellaria/nebula-theme-web`.** Aísla perfecto y no toca a nadie. Se descarta
porque parte en dos algo que se lee como uno: el tema y su materialización son la misma cosa vista
desde dos plataformas, y eso es lo que un subpath expresa mejor que un paquete.

## Consecuencias

- **Rompe** para quien importe `vars`, `ThemeToVars`, `themeClass` o `CompileTheme` de
  `@stellaria/nebula-web`. Va en las notas con la ruta nueva; es sustitución de import.
- Los nombres de las custom properties **cambian**, porque VE los deriva de la ruta del fichero. El
  render es idéntico —contrato y temas se recompilan juntos— pero cualquier CSS del consumidor que
  escriba una var a mano deja de encontrarla. El gate visual lo verifica.
- `packages/themes` gana un `vite.config.ts` y una entrada por subpath, más entradas de `size-limit`.
- Desaparecen `apps/web/src/lib/product-themes.ts`, las fixtures de temas del playground y las
  construcciones duplicadas de `packages/demos`.
- **No cierra** el agujero de los `breakpoints`, que siguen sin llegar al CSS.
