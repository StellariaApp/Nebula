# Por qué dark se ve más vibrante que light, y por qué no es un ajuste de dos líneas

> 2026-07-31. Investigación a petición del propietario. **Ningún cambio quedó aplicado**: se
> intentaron dos y los dos se revirtieron con evidencia. Entrada para WR3.

## 1. El mecanismo, medido

`FlipScale` (`themes/src/themes/scales.ts`) espeja la escala y **deja el 500 fijo**:
`50↔950`, `100↔900`, … `500=500`. En `nebula-dark` se aplica a **las siete escalas** — primary,
accent, gray y los cuatro semánticos.

Las dos recetas `filled` son **idénticas** en los dos temas:

```
filled: { background: "scale.600", foreground: "text.onPrimary", border: "none" }
```

Pero por el espejado, `scale.600` cae en sitios opuestos:

|                        | light                        | dark                         |
| ---------------------- | ---------------------------- | ---------------------------- |
| `scale.600` resuelve a | `indigo.600` = **`#5555f3`** | `indigo.400` = **`#8c9bff`** |
| `text.onPrimary`       | `light.50` (casi blanco)     | `dark.100` (casi negro)      |
| contraste              | 5.28                         | 7.76                         |

De ahí la percepción: en dark el primario es dos peldaños más claro y más saturado.

## 2. Lo que se intentó, y por qué se revirtió

### Intento 1 — el cambio 600 → 500 en la vía de colores extendidos

Cambiar el peldaño por defecto de `ResolveAccent` y `ResolveColorExtended` de `"600"` a `"500"`, más
~19 componentes con `ResolveAccent(color, "600")` explícito.

**Revertido, por dos motivos.**

1. **No ataca el problema.** Esa vía es la de los colores extendidos (`color="teal"`), que resuelve
   contra las paletas crudas — **idénticas en todos los temas**. La diferencia dark/light nace de
   `variantMap` + `FlipScale`, que es otra rama de `ResolveVariant`.
2. **Rompe AA en 15 de 17 paletas.** Las paletas están generadas para que **el 600 sea el peldaño
   accesible sobre blanco**: todas caen justo por encima de 4.5. Medido, texto de color sobre
   superficie blanca:

   |           | paletas por debajo de AA (4.5) |
   | --------- | -----------------------------: |
   | con `600` |                    **1 de 17** |
   | con `500` |                   **16 de 17** |

   `indigo` 5.28→3.70 · `violet` 5.43→3.85 · `green` 4.55→3.28 · `red` 5.46→3.86 · `teal` 4.58→3.30 ·
   `blue` 4.70→3.38 · `cyan` 4.67→3.36 · `lime` 4.65→3.32 · `gold` 4.88→3.51 · `gray` 4.83→3.50 …

   **`check:contrast` no lo detecta**: comprueba pares de roles del contrato, no `ResolveAccent`. Es
   el mismo punto ciego que documentó `geometria-figma-vs-nebula-2026-07-28.md` para `disabled`.

El parche quedó guardado antes de revertir, por si se quiere recuperar alguna parte.

### Intento 2 — igualar dark a light en la receta

Cuatro cambios en `nebula-dark.ts`: `filled` y `glow` de `scale.600` → `scale.400` (que por el
espejado da exactamente `#5555f3`, el hex de light), `text.onPrimary` → `light.50`, y la variante
`gradient` a `foreground: "surface.base"` para no romper el texto sobre el gradiente de marca.

Los contrastes **base** salían todos bien:

|                                               |                               resultado |
| --------------------------------------------- | --------------------------------------: |
| `filled`/`glow`: blanco sobre `indigo.600`    | 5.28 ✅ (el mismo par que ya usa light) |
| `filled`/`glow`: blanco sobre `violet.600`    |                                 5.43 ✅ |
| `gradient`: `surface.base` sobre `indigo.400` |                                 7.86 ✅ |

**Y aun así `check:contrast` dio 14 FAIL**, todos en `nebula-dark` y todos en el estado **hover**:

```
variantMap.filled · primary (texto:hover)   #ffffff  #6c76ff  3.70  4.5  FAIL
variantMap.filled · success (texto:hover)   #ffffff  #00a270  3.28  4.5  FAIL
… (7 escalas × filled y glow)
```

## 3. La causa de fondo: el hover no puede ser correcto en los dos casos

`resolve-variant.ts:320` deriva el hover así:

```
const hover_ref = is_transparent ? TRANSPARENT_HOVER : ShiftRef(recipe.background, 1);
```

y `ShiftRef` mueve **siempre +1 hacia el 950**.

- En **light**, `600 → 700` = `indigo.700`, más oscuro. Con texto blanco, el contraste **sube**. ✅
- En **dark espejado**, `600 → 700` = `indigo.300`, más **claro**. Funcionaba porque la base también
  era clara y el texto era casi negro. ✅
- Con la base movida al lado oscuro, `400 → 500` = `indigo.500`, más claro, **con texto blanco**:
  3.70. ❌

**No hay arreglo acotado**, y esto es lo que convierte el ajuste en un cambio de contrato:

- Invertir el signo de `ShiftRef` en temas `dark` arreglaría `filled` y `glow`, pero **rompería la
  variante `light`**, cuyo fondo es un tinte al 12 % que **debe aclararse** en hover — `docs/06` §5.1
  es explícito: «en light el hover **oscurece**; en dark **aclara**».
- Hacerlo por variante exige que `VariantRecipe` lleve su propia dirección de hover, y eso es
  **ampliar `NebulaTheme`**: ADR, los cinco temas oficiales y el Theme Creator.

Dicho de otro modo: **`FlipScale` tiene horneado el supuesto de que en dark las superficies de marca
son claras y su texto oscuro.** Igualar dark a light no es cambiar dos valores; es retirar ese
supuesto, y el hover es solo el primer sitio donde aflora — `active` (`ShiftRef(…, 2)`) tiene el
mismo problema.

## 4. Las tres salidas

| #   | Ruta                                                                     | Coste                                                                      | Consecuencia                                                                                                                                                           |
| --- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Dirección de hover por variante** en `VariantRecipe`                   | ADR + contrato + los 5 temas + Theme Creator                               | La única que permite igualar dark a light conservando §5.1                                                                                                             |
| 2   | **Desespejar `primary`/`accent` en dark** y recalibrar sus otras recetas | Medio, pero las recetas son globales, así que arrastra a las siete escalas | Medido: `outline`/`ghost` fg pasa de 11.36 a **2.81** y `light` fg de 14.34 a **2.10**. Inviable sin la ruta 1                                                         |
| 3   | **No tocarlo** y llevarlo a WR3                                          | Nulo                                                                       | Encaja con el hueco que ya abrió WR2.5: `docs/06` **no dice** si un mismo peldaño debe dar el mismo color en los dos esquemas, ni cuánto separa un nivel del siguiente |

## 5. Lo que esto añade a la auditoría

Es un hallazgo de **especificación**, no de componente, y refuerza el que abrió WR2.5:

> `docs/06` §5.1 fija la **dirección** del hover por esquema y §5.2 la proporción del separador, pero
> **no dice nada sobre si un rol debe resolver al mismo color en light y en dark**. Hoy no lo hace, y
> nadie escribió que debiera —ni que no—.

Mientras eso no esté decidido, cualquier intento de igualarlos choca con un supuesto implícito
distinto cada vez. Los dos intentos de este documento son la prueba.
