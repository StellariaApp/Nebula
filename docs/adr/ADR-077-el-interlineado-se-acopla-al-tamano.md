# ADR-077 — El interlineado se acopla al tamaño

- **Estado**: **aceptada** · 2026-08-02 — checkpoint del propietario, tramo D7 del plan de marca
- **Resuelve**: las tres landings de referencia usan interlineados **distintos para el mismo texto**, y
  Nebula tiene tres valores planos que no dependen del tamaño.
- **Amplía**: `ThemeFont` con `leading`, un interlineado por peldaño de `font.size`.
- **Enmienda**: `docs/06` §2.1, cuya regla «`Title` usa `tight`» aplicaba 1.2 a los seis niveles.

## Contexto

Censadas las tres landings, el patrón es unánime y ninguna lo declara como regla:

| Tamaño   | Interlineado en las landings |
| -------- | ---------------------------- |
| 12 px    | 1.4 – 1.6                    |
| 14 px    | 1.7 – 1.75                   |
| 16–17 px | 1.65 – 1.7                   |
| 20 px    | 1.2                          |
| 30–37 px | 1.0 – 1.06                   |
| 52–68 px | 0.94 – 0.98                  |

**Cuanto más grande el texto, menor el interlineado.** Es tipografía clásica, y las tres lo cumplen
por caminos distintos: Rosette lo escribe a mano en CSS, y Lagrange y Stellaria **no declaran
`leading-*` en ninguna parte** — heredan el de Tailwind, que ya viene acoplado al tamaño.

Nebula tenía tres valores nombrados —`tight` 1.2, `normal` 1.45, `relaxed` 1.65— **desacoplados del
tamaño**, y `Title` usaba `tight` para los seis niveles. Un `h1` de 48 px y un `h6` de 20 px
compartían 1.2 cuando la evidencia dice 1.0 y 1.25.

## Decisión

1. **`font.leading` da un interlineado por peldaño**, decreciente:

   ```
   h1 1.00   h2 1.05   h3 1.10   h4 1.15   h5 1.20   h6 1.25
   body1 1.60   body2 1.55   body3 1.50   button 1.20   caption 1.45
   ```

   `button` no sigue la curva de lectura: es el label de un control y su interlineado infla la altura
   del control, así que se queda compacto.

2. **`lineHeight` —`tight`/`normal`/`relaxed`— sigue existiendo**, para overrides deliberados. Lo que
   cambia es el **valor por defecto**: antes lo elegía cada componente, ahora lo trae el tamaño.

3. **`fz` arrastra su interlineado.** Es la parte que hace que la decisión sirva: sin ella, un
   `<Text fz="h2">` se quedaba con el 1.6 de `body1` — medido en la landing, un párrafo de 40 px con
   interlineado 1.60.

   El acoplamiento se hace al repartir las props, no con un _shorthand_ de sprinkles. La alternativa
   —`fz: ["fontSize", "lineHeight"]`— exigía mover `lineHeight` al bloque responsive, y eso multiplica
   sus clases por las seis condiciones: **medido, 23 presupuestos rebasados y +790 B en el runtime
   compartido**, contra 11 y +370 B por esta vía. Un `lh` explícito sigue ganando.

## Alternativas

- **Añadir peldaños a `lineHeight` y reasignarlos** (`flat` 1.0, `loose` 1.75). Menos invasivo, pero
  deja la decisión en cada componente, que es exactamente de donde viene la inconsistencia.
- **Corregir solo `h1`/`h2`.** Arregla el defecto visible y no normaliza nada: el cuerpo seguiría en
  1.45 cuando las tres landings usan 1.5–1.75.
- **Añadir los tamaños que faltan** (18, 30, 36). Descartada en el mismo checkpoint: los tres tamaños
  dominantes de las landings —12, 14, 16— ya existen, y los huecos son de un peldaño. El problema
  medido era el interlineado, no la escala.

## Consecuencias

- **Verificado sobre el render de la landing**, antes y después:

  | Elemento | Antes | Después |
  | -------- | ----: | ------: |
  | 68 px    |  0.95 |    0.95 |
  | 40 px    |  1.60 |    1.05 |
  | 14 px    |  1.60 |    1.55 |
  | 12 px    |  1.60 |    1.45 |

- **Once presupuestos suben 0.5 kB**, más el runtime de sprinkles y el barrel: las once claves nuevas
  de `lineHeight` son clases atómicas que el mapa no tenía.

- **Ningún gate lo cubre.** `check:contrast` no mira interlineado y `size-limit` solo ve el coste. Lo
  verifica la medición del render.
