# ADR-179 — La rampa reparte el cristal, y el lift se declara por rol

- **Estado**: **aceptada** · 2026-08-23 — decidida por el propietario
- **Cambia API pública**: sí. `ThemeSeed` gana `ramp` y **`lift` pasa de `number` a `Lift`**
  —`number | Partial<Record<SurfaceRole, number>>`—, que es aditivo en la práctica: un número sigue
  significando lo mismo. `@stellaria/nebula-themes` exporta `Ramp`, `RampAt`, `ShiftRamp`, `GlassOf`,
  `VeilOf`, `BASE_RAMP`, `Lift` y `LiftOf`.
- **Enmienda**: [ADR-178](ADR-178-el-velo-vuelve-a-ser-cristal-y-la-intensidad-es-un-eje.md) §3 — el
  eje `glass` deja de ser una tabla absoluta y pasa a ser un par de deltas sobre la rampa del tema.
- **Toca**: `packages/themes`, `packages/demos`.

## Contexto

Dos problemas distintos que resultaron ser el mismo.

**El cristal.** El eje de intensidad era una tabla de cinco alfas por opción, escritas a mano, y
`strong` valía `0.90` en las tres. Así que el tope no seguía a la opción: `sheer` subía `.32 · .35 ·
.45 · .63` y luego saltaba a `.90` de un escalón. Peor: la tabla era **absoluta**, no relativa al
tema, así que un producto que declarara otro cristal seguía teniendo exactamente el `sheer` de todos
los demás.

**Las superficies.** `lift` desplaza todos los roles de `colors.surface` por igual. No hay forma de
pedir que los de arriba —`raised`, `overlay`— se separen más del fondo que los de abajo, que es lo
que hace falta para tintear una pila sin mover el fondo, que sale del degradado radial y no de ahí.

La primera idea fue una prop por sitio: `liftTop` para la pila y otra rampa para el cristal. Son la
misma curva contada dos veces.

## Decisión

**Dos declaraciones, una por eje, y cada una en las unidades de su eje.**

```ts
ramp: [10, 30, 80]                          // el cristal, en alfas
lift: { base: 12, raised: 0, overlay: -5 }  // las superficies, en canales
```

**`ramp` es el cristal.** Tres puntos en enteros 0-100 —velo, suelo y techo— y los cinco niveles
tintados se reparten entre los dos últimos. Los números **son las alfas**, así que 0-100 es el rango
de verdad y fuera de él se sujeta: un `rgba()` con alfa negativa es una declaración inválida y ese
nivel deja de pintar.

**`lift` son las superficies.** Un número mueve las ocho por igual, que es lo de siempre; un objeto
las mueve una a una, y es lo que deja tintar la pila —`overlay` más claro sin tocar `base`—. Un rol
que el objeto no nombra sigue a `base`, no a cero: son una pila, y dejar `hover` quieto mientras
`base` se mueve descoloca el estado respecto de su superficie. Para fijar uno se escribe su cero.

**Y los filos van con su superficie.** `colors.border` pasa por el mismo lavado y el mismo
desplazamiento que la superficie que bordea —`subtle`, `default` y `strong` con `raised`; `disabled`
con la suya—, porque quieto se **invierte**: en la base el filo es un escalón más claro que `base` en
dark, y con `lift: 12` acaba más oscuro que ella, o sea leído como sombra. En light pasa lo simétrico
y desaparece. `focus` no entra: sale de `primary`, no de la pila. Y `lift: { border: 0 }` los clava
sin tocar las superficies.

**El signo ya se ocupa del esquema.** Positivo es «sepárate del fondo» —más claro en dark, más oscuro
en light— y negativo lo contrario, así que un `overlay: -5` sale más oscuro en dark y más claro en
light sin declarar nada por esquema.

Tres cosas que sostienen la parte del cristal:

1. **La curva no es nueva.** Ajustando los cinco velos que el tema tenía escritos a mano —`.46 .48
   .56 .69 .90`— sale `t^2.2` en los tres puntos interiores. La fórmula reproduce esa tabla clavada,
   así que la rampa no inventa un material: escribe el que ya había.
2. **`ramp` es opcional.** Sin declararla, el cristal es el de la base.
3. **El velo va aparte, y el esquema solo lo toca a él.** Es blanco sobre el fondo, y blanco sobre
   oscuro se lee al 5 % mientras que sobre claro necesita más: `dark = velo − 5`, `light = velo + 5`.
   Los otros dos extremos son idénticos en los dos esquemas, que es lo que ya pasaba.

Y el eje de la demo pasa a ser **dos deltas** —`sheer −10/−20`, `frosted 0/0`, `milky +10/+10`— sobre
la rampa de cada tema, en vez de una tabla absoluta. `strong` deja de ser `0.90` en las tres y pasa a
ser el techo de cada una.

## Alternativas

**Una sola rampa para los dos ejes**, con las superficies leyéndola como proporción del `lift`. Fue la
primera versión y se cayó al usarla: reparte bien, pero para decir «este rol concreto un poco más
oscuro» hay que resolver una regla de tres mentalmente, y el número que escribes no es el que ves. Con
el `lift` por rol, `overlay: -5` son cinco canales y se acabó.

**`rampSurface`, una rampa aparte para la pila.** Duró una iteración. Es la misma indirección con otro
nombre: sigue sin poder nombrar un rol.

**Meter el velo en la rampa como sexto escalón** —`[8, 80]` sobre seis niveles—. Se probó con números:
el escalón `veil → band` pasa de 41 puntos a 2 y la banda se desploma. El velo no es un escalón de la
misma serie, es otro material: va en blanco y los otros cinco con la tinta.

**Declarar el velo por esquema.** Funciona y cuesta dos números por tema en vez de uno. Se descarta
porque la relación entre los dos esquemas es fija —la impone el material, no el producto—, así que
vale una constante.

## Consecuencias

- **La rampa de fábrica baja el cristal**: `[10, 30, 80]` deja la banda en `.30` donde antes estaba
  en `.46`. El velo de dark cae en `.05`, exactamente donde ya estaba; el de light pasa de `.30` a
  `.15`.
- **Los filos de los quince productos se mueven.** Es el arreglo, no un efecto colateral: hasta ahora
  se quedaban en el gris neutro de la base mientras sus superficies se teñían y se separaban.
- **`lift` deja de ser `number` en el tipo.** Un número sigue valiendo y significando lo mismo, así
  que ninguna semilla existente cambia de comportamiento; lo que cambia es que ahora puede ser objeto.
- El eje de la demo pierde diez números y gana cuatro, y el inverso (`GlassFromTheme`) deja de
  comparar contra una tabla para comparar contra lo que la propia función produciría.
