# ADR-167 — El script de arranque se llama `ThemeScript`, y sus claves se nombran una a una

- **Estado**: **aceptada** · 2026-08-17 — decidida por el propietario
- **Cambia API pública**: sí, y **rompe**. Renombra un componente exportado y cambia una prop.
- **Toca**: `ColorSchemeScript` → `ThemeScript`, `storageKey` → `storageKeys`, `docs/02` §4.

## Contexto

El componente se llamaba `ColorSchemeScript` cuando sólo hacía eso: fijar `color-scheme` en `<html>`
antes del primer pintado. Hace tiempo que no.

Hoy pone la clase del tema, escribe `data-theme` y `data-scheme`, elige entre un mapa de identidades
que puede traer el consumidor ([ADR-155](ADR-155-el-script-de-arranque-acepta-temas-que-no-son-los-oficiales.md)),
y desde [ADR-166](ADR-166-la-identidad-del-tema-y-su-esquema-son-ejes-distintos.md) resuelve dos
ejes. El `color-scheme` es la última línea de lo que hace, no lo que es.

Es el mismo defecto que ADR-165 corrigió en el atributo: un nombre que describe una parte y se lee
como si fuera el todo. Quien busca «cómo evito el parpadeo del tema» no busca `ColorSchemeScript`.

Y la clave de almacenamiento arrastra su propia historia. Era una (`nebula-theme`), luego pasó a ser
un prefijo del que salían dos (`nebula-theme`, `nebula-scheme`). Un prefijo del que se derivan
nombres es un formato implícito: el consumidor no puede nombrar una clave sin renombrarlas todas, y
no puede convivir con claves que ya tenga.

## Decisión

### 1. `ColorSchemeScript` pasa a `ThemeScript`

Sin alias ni reexport del nombre viejo. La librería está en `0.x`, el cambio es una sustitución de
texto, y mantener los dos deja al consumidor sin saber cuál es el bueno — el mismo argumento de
ADR-165, que ya se aplicó al atributo.

### 2. `storageKey` pasa a `storageKeys`, un nombre por eje

```ts
storageKeys?: { theme?: string; scheme?: string };
```

Con `{ theme: "nebula-theme", scheme: "nebula-scheme" }` por defecto, que es lo que el prefijo
producía. Cada clave se nombra entera, así que el consumidor puede encajar en las que ya tenga sin
renombrar nada más, y añadir un eje mañana no toca las de hoy.

Lo toman igual `ThemeScript` y `NebulaProvider`: son los dos extremos del mismo almacenamiento y no
pueden discrepar.

## Alternativas

**Dejar el nombre.** Cero trabajo. Se descarta porque el nombre ya no describe lo que hace, y el
coste de arreglarlo sólo sube con los consumidores.

**`NebulaScript`, `BootScript`, `ThemeBootScript`.** El primero repite la marca que ADR-165 acaba de
quitar del atributo. Los otros dos describen *cuándo* corre en vez de *de qué* va, y el cuándo ya lo
dice estar en el `<head>`.

**Mantener `storageKey` como prefijo y aceptar la derivación.** Es lo que hay y funciona mientras
nadie tenga claves propias. Se descarta porque el consumidor no puede intervenir en un nombre sin
mover los demás, y porque un prefijo del que salen nombres es un formato que nadie declaró.

## Consecuencias

- **Rompe** para quien importe `ColorSchemeScript` o pase `storageKey`. Va en las notas con el
  reemplazo literal.
- `docs/02` §4 y los ADR que lo nombran en su texto se quedan como están: registran lo que se decidió
  cuando se decidió. Este ADR es el que dice cómo se llama hoy.
- El nombre deja sitio para lo que viene: si el script acaba restaurando más ejes que la identidad y
  el esquema, `ThemeScript` los cubre sin volver a quedarse corto.
