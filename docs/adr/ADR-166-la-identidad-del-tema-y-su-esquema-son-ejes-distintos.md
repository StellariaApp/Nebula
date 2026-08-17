# ADR-166 — La identidad del tema y su esquema son ejes distintos

- **Estado**: **aceptada** · 2026-08-17 — decidida por el propietario
- **Cambia API pública**: sí. `meta.name` cambia de significado, `defaultTheme` y `setTheme` ganan
  formas, y el mapa de `ColorSchemeScript` cambia de forma.
- **Toca**: `docs/02` §2 y §4, `NebulaTheme.meta`, `NebulaProvider`, `ColorSchemeScript`.
- **Simplifica**: [ADR-163](ADR-163-el-provider-acepta-un-tema-ya-materializado-como-clase.md) §4
  deja de hacer falta, y [ADR-165](ADR-165-el-atributo-del-tema-pierde-la-marca.md) pasa de ser un
  renombrado cosmético a decir algo cierto.

## Contexto

Los dos temas oficiales se llaman `dark` y `light`:

```ts
meta: { name: "dark", scheme: "dark", version: "0.1.0" }
```

El nombre y el esquema son la misma palabra, así que **la identidad del tema no existe como dato**.
Eso está bien mientras el único tema sea Nebula. Deja de estarlo en cuanto hay temas de producto,
porque `rosette` tiene dos esquemas y los dos son `rosette`.

**La prueba de que hace falta es que ya se construyó por fuera.** `packages/demos/src/themes/products.ts`
tiene el modelo entero, improvisado sobre los nombres:

```ts
meta: { name: dark ? name : `${name}-light`, scheme, version: "0.1.0" },   // BuildProduct

const LIGHT_SUFFIX = /-light$/;
export function NameFromTheme(theme: NebulaTheme): ThemeName {
  const stem = theme.meta.name.replace(LIGHT_SUFFIX, "");                  // deshacer el sufijo
  return stem in PRODUCT_SEEDS ? (stem as ThemeName) : "nebula";
}
```

Un sufijo que se pega al nombre y una expresión regular que lo despega. Y encima de eso,
`ThemeName = "nebula" | ProductName` y `ThemeChoice = { name, scheme, … }`, que son exactamente los
dos ejes que el contrato no tiene. Los «siete ejes» que [ADR-155](ADR-155-el-script-de-arranque-acepta-temas-que-no-son-los-oficiales.md)
menciona salen de ahí.

Lo mismo asoma en `ColorSchemeScript`, que deduce el esquema leyendo el nombre:

```js
var s = t.indexOf("dark") > -1 ? "dark" : "light";
```

Tres sitios distintos derivando un dato que debería estar declarado. Cuando tres piezas
independientes improvisan la misma información, lo que falta es un campo.

## Decisión

**`meta.name` nombra la identidad; `meta.scheme` nombra el esquema.** Los dos temas oficiales pasan
a llamarse `nebula`, y se distinguen por su `scheme`.

### 1. Lo que el consumidor escribe

```tsx
<NebulaProvider defaultTheme="dark" />                              // esquema; identidad = nebula
<NebulaProvider defaultTheme={{ theme: "rosette", scheme: "dark" }} themes={products} />

setTheme("light")                          // conserva la identidad, cambia el esquema
setTheme({ theme: "rosette", scheme: "dark" })
```

`setTheme("light")` conservando la identidad es lo que hace que un conmutador claro/oscuro de
producto funcione sin que el producto tenga que saber cómo se llaman sus propios temas.

### 2. El registro tiene la forma de los dos ejes

```ts
themes?: Record<string, { dark: MaterializedTheme; light: MaterializedTheme }>;
```

Es el registro de ADR-163 con el segundo eje explícito. `nebula` está dentro por defecto.

### 3. `officialThemes` no cambia de forma

Sigue siendo `{ light, dark }`. **La clave siempre fue el esquema**, no el nombre, así que
`officialThemes["dark"]` sigue significando lo mismo y los doce ficheros que lo usan no se tocan. Lo
único que cambia dentro es `meta.name`.

### 4. Lo guardado lleva los dos ejes, y lo viejo se sigue leyendo

El formato pasa a `"<identidad>:<esquema>"`. Un valor sin `:` —lo que hay guardado hoy— se lee como
esquema suelto sobre la identidad por defecto, así que **no hay migración**: quien tenga `"dark"` en
su `localStorage` sigue aterrizando en Nebula oscuro.

### 5. El script deja de adivinar

`ColorSchemeScript` recibe `Record<identidad, { dark: clase; light: clase }>` y saca el esquema de
la clave en la que encontró la clase. Se acaba la trampa de que un tema llamado `rosette-noche`
saliera con `color-scheme` invertido, y con ella el §4 de ADR-163.

### 6. `data-theme` empieza a decir la verdad

```html
<html data-theme="nebula" data-scheme="dark">
```

ADR-165 quitó la marca del atributo. Esto le da contenido: antes `data-theme="dark"` repetía lo que
`data-scheme` ya decía.

## Alternativas

**Dejar el sufijo y la regex.** Funciona hoy en `demos`. Se descarta porque obliga a cada consumidor
a reinventarlo, y porque un tema cuyo nombre no siga la convención rompe en silencio — no falla, sale
mal.

**Un tercer campo `family` junto a `name`.** Conserva `meta.name = "dark"` y no rompe nada. Se
descarta porque deja dos campos donde uno diría lo mismo, y porque el campo que sobra es justamente
el que hoy miente.

**Que la identidad viva sólo en el registro del consumidor**, sin tocar `meta`. Tentador porque
`packages/themes` no se tocaría. Se descarta porque entonces un `NebulaTheme` suelto —el de ADR-121,
el del preview del Theme Creator— sigue sin saber quién es, y es justo el caso donde hace falta.

## Consecuencias

- **Rompe** para quien lea `theme.meta.name` esperando `"dark"`. Dentro del repo son `products.ts`
  (que se simplifica y pierde `NameFromTheme`), las fixtures del playground y algún test.
- **No rompe** `defaultTheme="dark"` ni `setTheme("light")`, que es la inmensa mayoría del uso: se
  reinterpretan como esquema y hacen lo mismo que antes.
- **Dos temas comparten `meta.name`**, así que deja de valer como clave de React. `ProductSwitch` y
  las fixtures del playground usan `key={theme.meta.name}` y pasan a `name + scheme`.
- Native no se toca: aún no tiene provider, y el modelo de Unistyles es identidad + esquema, así que
  esto lo alinea en vez de complicarlo.
- El baseline visual no se mueve: mismo CSS y mismas clases, sólo cambia el valor de un atributo.
- **Sigue abierto** el agujero de los `breakpoints`, que no llegan al CSS.
