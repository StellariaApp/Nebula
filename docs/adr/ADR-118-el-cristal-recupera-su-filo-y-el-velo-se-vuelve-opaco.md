# ADR-118 — El cristal recupera su filo, y el velo se vuelve opaco

- **Estado**: aceptada · 2026-08-09 (decisión del propietario, calibrada contra la maqueta) · **WN · W5**
- **Sustituye a [ADR-102](ADR-102-el-cristal-no-trae-su-propio-filo.md)**. Enmienda
  [ADR-078](ADR-078-el-cristal-es-una-receta-por-clase-de-superficie.md) en qué distingue un nivel de
  otro.
- **Cambia API pública**: sí. `GlassSurfaceRecipe` gana `borderColor`; `ResolvedVariant` pierde
  `glassBorder`.
- **Rompe**: `ResolvedVariant.glassBorder`.

## Contexto

ADR-102 quitó el filo del cristal cuatro días antes de este ADR, a petición del propietario, con un
argumento que sigue siendo bueno: **había dos sistemas de borde** —siete usos del de cristal contra
133 del semántico— y el de cristal **no lo validaba nadie**, porque el gate de contraste no lo miraba.

Lo que reabre el asunto no es una preferencia, son dos hechos.

**El primero lo dejó escrito el propio ADR-102.** El motivo técnico para preferir un filo sólido era
que `culori` ignora el alfa en `wcagContrast`: reportaba 16.65 donde el compuesto real daba 1.10, así
que con filos translúcidos el gate daba verde a cualquier cosa. Eso se arregló el mismo día —
`CheckTheme` aplana el alfa contra su fondo antes de medir—, y el ADR lo cerró con esta frase:
_«volver a bordes con alfa vuelve a ser una opción medible»_.

**El segundo es la medición.** El propietario reportó un filo duro sobre la maqueta. Medido, el
diagnóstico se partía en dos síntomas con una sola causa:

| filo opaco, velos finos | sobre superficie plana | sobre el mesh `#5e63f8` |
| ----------------------- | ---------------------- | ----------------------- |
| oscuro                  | 1.00 – 1.18            | **3.60**                |
| claro                   | 1.00 – 1.15            | **4.07**                |

Sobre una lámina plana el filo era invisible; sobre un degradado saltaba a 3.6–4.1 y se leía como una
línea muerta pegada encima. La causa: **un color opaco no compone con lo que hay detrás del cristal**,
y con un velo del 2 % lo que hay detrás es casi todo.

## El recorrido, porque el resultado no se entiende sin él

El primer diseño puso el filo **con alfa**, que es la respuesta correcta a un velo fino. Se calibró
contra la maqueta en cuatro pasos, y cada uno lo pidió el propietario mirando la pantalla:

| paso                            | filo                              | qué se vio                                                                           |
| ------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------ |
| filo con alfa, sin teñir        | blanco / tinta puros, 1.19 – 1.87 | «se sienten muy fuertes» — y era cierto: 2× a 8× el resto del catálogo (1.05 – 1.11) |
| teñido 35 % a `surface.overlay` | 1.11 – 1.45                       | mejor, todavía marcado                                                               |
| teñido 60 %                     | 1.05 – 1.24                       | al nivel de un borde plano                                                           |
| teñido 85 – 90 %                | 1.00 – 1.07                       | el filo deja de existir; el tint deja de ser un dial                                 |

El final de ese recorrido dice algo: **lo que sobraba no era el filo, era el contraste entre el filo
y un velo demasiado fino**. De ahí la decisión que sí cierra el problema.

## Decisión

### 1. El velo se vuelve opaco: rampa 0.78 → 0.90, tres puntos por escalón

| nivel     | velo | desenfoque |
| --------- | ---- | ---------- |
| `band`    | 0.78 | 1 px       |
| `control` | 0.81 | 2 px       |
| `subtle`  | 0.84 | 4 px       |
| `default` | 0.87 | 12 px      |
| `strong`  | 0.90 | 16 px      |

**Y los cinco niveles usan la misma tinta por esquema**: `rgba(15, 17, 25, α)` en oscuro,
`rgba(255, 255, 255, α)` en claro. Antes no era así —`band` y `control` llevaban velo blanco en el
tema oscuro, con alfas del 2 % y el 3 %—, y a estas opacidades eso habría dado una banda casi blanca
en un tema oscuro. Sin este cambio el resto no se sostiene.

### 2. Y **por eso** el filo puede ser plano

Un color plano por tema: `#23252c` en oscuro, `#e9e9ea` en claro. Sin alfa.

El argumento del contexto —un color opaco no compone con lo que hay detrás— **deja de aplicar cuando
no queda casi nada detrás**. Medido, filo plano contra el relleno de su propio nivel y contra el mismo
mesh que destapó el problema:

| velo              | filo plano, sobre su relleno | filo plano, **sobre el mesh** |
| ----------------- | ---------------------------- | ----------------------------- |
| fino (2 – 58 %)   | 1.00 – 1.05                  | **3.50 – 4.24**               |
| opaco (78 – 90 %) | **1.20 – 1.21**              | **1.01 – 1.11**               |

Las dos decisiones son una sola: **el filo plano solo es válido porque el velo es opaco.** Subir la
transparencia del velo sin volver al filo con alfa reintroduce la línea muerta, y está medido arriba.

### 3. Un nivel ya no se distingue por el material, sino por el desenfoque

Es la enmienda a ADR-078 y hay que decirla, porque cambia qué significa elegir un nivel. Con la rampa
en doce puntos, **los cinco rellenos componen prácticamente al mismo color**: en el tema claro los
cinco caen en `#fefefe`/`#ffffff` sobre `surface.base`. Lo que separa a `band` de `strong` es
1 px de desenfoque contra 16, no el velo.

Consecuencia práctica: elegir nivel es elegir **cuánto se difumina lo que pasa por debajo**, que es
lo que importa en un `Nav` fijo o una `Section` sobre un `StarField`. Ya no es elegir cuánto se ve.

### 4. `GlassSurfaceRecipe` recupera `borderColor` — color puro, nunca shorthand

```ts
export interface GlassSurfaceRecipe {
  background: string;
  backdropFilter: string;
  borderColor: string;
}
```

**Una clave, no tres.** Se evaluó la forma «cristal real» —filo superior claro, inferior oscuro, como
macOS o visionOS—: triplica el contrato a quince ranuras, obliga a partir el shorthand `border` de
`GlassSurface`, introduce costura en las esquinas con `border-radius`, y el bisel medido en tema claro
da 1.14. Contrato triple por un efecto que no se ve.

Y **`borderColor`, no `border`**. El shorthand `1px solid …` fue lo que obligó al `GlassRecipe()` que
parseaba strings, y ese parseo fue uno de los argumentos de ADR-102 para borrarlo. El ancho es del
consumidor; del material es el color.

`GlassLevel`, `colors.border`, `VariantRecipe.border` y `VariantColorRef` **no se tocan**. No existe
una referencia `glass.<nivel>` en el mapa de variantes, a propósito: el filo es propiedad del
material, no una elección de la receta.

### 5. El gate mide el filo, y por eso este ADR puede existir

`tools/contrast-check` gana la familia **`glass.<nivel> (filo)`**, cinco niveles × siete superficies
= 35 pares nuevos por tema. El fondo del par es el **velo ya compuesto** sobre cada rol de superficie,
y el frente es el filo. Es la maquinaria que ADR-102 dejó lista.

El suelo es **1.15**, y los diez pares miden 1.20–1.21. No es 3: un suelo de 3 forzaría un filo casi
negro sobre lámina clara y mataría el material. Lo que 1.15 protege es que el filo no vuelva a ser
invisible, que es el estado del que salimos.

**Un suelo que no puede fallar no es un gate.** Durante la calibración el suelo llegó a bajar a 1.0
para dejar pasar el filo teñido al 90 %; eso queda anotado como lo que fue —un andamio— y el valor
final vuelve a morder.

### 6. Un tema de terceros sin la clave sigue cargando

Entrada tolerante, salida requerida. En `packages/themes/src/schema.ts` la clave es `.optional()` y
un `.transform` la rellena **por nivel** desde `GLASS_EDGE_FALLBACK`, así que `z.output` mantiene
`borderColor: string` y los dos checks de tipo del esquema siguen verdes sin tocar `LoadTheme`.

El respaldo es **gris neutro** a propósito: una tinta con esquema —blanco o tinta— se invierte y
desaparece en el tema contrario. `GLASS_EDGE_FALLBACK` vive en `packages/themes`, no en
`packages/tokens`: es un apaño de compatibilidad con un solo consumidor, no un token de diseño, y
meterlo en el contrato cerrado exportaría para siempre un gris que no pertenece a ningún tema.

### 7. `AppShell` sigue al `level`, que era el fallo latente

`level` es prop pública en las cinco partes de `AppShell`, y sus nueve filos estaban clavados a
`vars.color.border.default` en la hoja. Hoy eso es inofensivo porque el filo no depende del nivel;
**con este cambio, `<AppShell.Nav level="strong">` habría pintado material `strong` con filo
`subtle`** — justo el desajuste velo/filo que este ADR existe para quitar.

`GlassSurface` pasa a exponer su filo como **var de color** —`borderColor`, y `solidBorderColor` para
la rama sin `backdrop-filter`— en vez de como shorthand, y los nueve filos de `AppShell` lo leen con
`fallbackVar`.

De paso queda cerrada una rama que nadie había mirado: bajo `@supports not (backdrop-filter: …)` el
componente cambiaba el fondo a sólido **y dejaba el filo del cristal**. Ahora también lo devuelve a
`border.default`.

### 8. `ResolvedVariant.glassBorder` se borra

Es API pública y **no lo consume nadie** —verificado por barrido—, sus tres centinelas eran
incoherentes entre sí (`"transparent"`, `"none"`, y un shorthand), y `borderColor` ya lleva el filo.
Borrarlo hoy es gratis; después de W5 sería rompedor.

## Consecuencias

- **Una línea arregla ~22 componentes.** `resolve-variant.ts` pasa a `glass_recipe.borderColor` y con
  eso lo heredan todos los que hacen pass-through de `resolved.borderColor`: Button, Alert, Badge,
  Tag, Chip, ThemeIcon, Avatar, Timeline, Stepper, Progress, Slider, Pagination, Toast, Banderole,
  Hero, QuickAction, Card, Paper y compañía.
- **NO se reapuntan los `fallbackVar` de `Card.css.ts` ni `Paper.css.ts`.** Esa var solo queda sin
  emitir cuando `variant` es `undefined`, es decir en la tarjeta plana y opaca. Apuntarla al filo de
  cristal habría repintado todo `<Card withBorder>` sin variante con un token que no le corresponde.
- **`Section glass` cambia de carácter.** Era una banda al 2 % que dejaba ver el `StarField`; ahora es
  una banda al 78 % que lo difumina. El efecto de «franja intercalada» ya no lo da la transparencia
  sino el desenfoque, y la portada debe revisar dónde alterna.
- **Queda abierta una pregunta de rendimiento.** A 87–90 % de velo, `default` y `strong` apenas dejan
  pasar nada, y `backdrop-filter` sigue siendo la propiedad cara. Si el desenfoque tampoco se aprecia
  en algún nivel, ese nivel debería dejar de pedirlo. Se mide sobre el `Nav` y el `AppShell`, que es
  donde más se nota, y no entra en este PR.
- **`colors.border` no se recalibra.** ADR-102 lo atenuó para imitar al filo de cristal que sustituía;
  ahora que el cristal tiene el suyo, esa atenuación se queda sin motivo. Son 133 usos y queda anotado
  como deuda.
- **`AppShell.Sidebar` mantiene su `<ActionIcon variant="glass" glass="strong">`.** Bajarlo a
  `control` lo empeoraría: cambiaría un valor estable por uno que depende del fondo.
- **Las capturas del gate visual se mueven** y hay que rebasarlas a mano: con `DIFF_RATIO` en 0.001 el
  gate detecta el cambio pero no lo aprueba por sí solo.
- Los `.md` de `GlassSurface`, `AppShell`, `Footer`, `Section` y `Nav` describían el filo y el velo
  anteriores, y se corrigen en este mismo PR junto con `docs/02-theming.md` §2.
