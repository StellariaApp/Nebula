# `logo` — por qué el logotipo se tiñe con vars y no con JavaScript

El logotipo se repinta al cambiar de producto, como el resto de la página. Lo hace **solo con CSS
vars**, sin `useTheme()` y sin `"use client"`, y eso condiciona de dónde salen sus colores: se monta
en `site-footer` y en `surfaces`, que son componentes de servidor.

## De dónde sale el eje

De `gradient.brand.edge → gradient.brand.tip`: **las dos paradas que el tema publica**, la primera y
la última de su degradado de marca.

Esto es nuevo. Hasta [ADR-170](../../../../docs/adr/ADR-170-el-tema-publica-sus-degradados.md) los
degradados eran data no-CSS que había que leer del objeto `theme` por contexto, así que usarlos
habría obligado a `useTheme()` y a volver cliente el pie de página entero. Mientras duró esa
restricción el eje se reconstruía con `primary.500 → accent.500`, que sí eran vars.

**Reconstruirlo no era equivalente, y la diferencia se midió.** De los dieciséis temas, **quince
salían mal**:

| tema | lo que pintaba | lo que declara |
| ---- | -------------- | -------------- |
| `nebula` | indigo 500 → violet 500 | igual — de ahí que no se notara |
| `apolo` | orange 500 → rose 500 | rose 500 → orange 400 — **invertido** |
| `halo` | cyan 500 → slate 500 | cyan 400 → slate 300 |
| `eclipse` | red 500 → rose 500 | red 600 → rose 500 |

El caso de `apolo` es el que enseña el problema: su primario es el naranja pero su degradado **sale**
del rosa, así que el logotipo pintaba el eje al revés que cualquier botón de la misma página.

## La tinta de las estrellas

`ink.primary`, no `#fff`. Con eso las estrellas obedecen `ink.floor` como cualquier otro relleno del
catálogo (ADR-132): un tema que baje el suelo las mantiene claras sobre un primario claro, y uno que
lo suba las voltea. Antes eran blancas fijas y se perdían sobre un producto de primario claro.

## Lo que sigue con la marca cableada, a propósito

`public/logo.svg` conserva `#3F37C9`/`#9D4EDD`. Lo consume `og-card.tsx` a través de Satori, que no
resuelve CSS vars ni tiene tema, y una tarjeta social debe salir siempre con la identidad de Nebula
(ADR-020) sea cual sea el producto que el visitante tuviera puesto. No es deuda: es el único sitio
donde la marca no debe seguir al tema.
