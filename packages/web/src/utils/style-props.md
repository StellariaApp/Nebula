# style-props

Reparte las props de un componente en tres destinos: clase atómica de sprinkles, `style` inline y
`rest`. El orden del bucle es el contrato: lo que se resuelve antes gana.

## La opacidad va por `style`, no por sprinkles (ADR-071)

`color`, `background` y `borderColor` son sprinkles con **mapa cerrado**: un valor que no está en el
mapa no degrada, rompe el typecheck. Por eso un valor con sufijo de opacidad —`border.subtle.40`— se
resuelve a `color-mix` y sale por `style` inline, y solo los valores sin sufijo pasan por sprinkles.

Dos consecuencias que conviene no deshacer sin querer:

**El mapa de roles se importa de `Box.css.ts`, no de `contract.css.js`.** Parece equivalente y no lo
es. `Box.css.ts` es un `.css.ts`: sus referencias a `vars` se resuelven en build y no sobreviven al
runtime. Este módulo, en cambio, es JavaScript normal, así que un `import { vars }` aquí arrastra
`contract.css.js` entero —10 kB— a **todo componente que use style props**. Medido con `size-limit`:
20 presupuestos rebasados por esa vía contra 4 por la actual.

**El coste que sí queda es exportar `ROLE_COLORS`.** Al exportarlo, el bundler ya no puede eliminarlo
tras evaluar los sprinkles: ~330 B brotli en 174 de los 192 módulos medidos. Es el precio del
mecanismo y está asumido en el ADR; por eso la opacidad cubre los 19 roles y **no** los 77 peldaños
de escala, que multiplicarían esa cifra por tres sin que nadie los use como style prop.

## Por qué el inline gana donde la clase perdía

Un recipe que declara sus variantes fuera de `baseLayer` —`Divider.css.ts` es el caso vivo— pisa a
las clases de sprinkles, porque una regla sin capa gana a una regla en capa. La declaración inline no
tiene ese problema. **No es un arreglo de ese defecto**, solo deja de depender de él: el patrón de
variantes fuera de capa se corrige por su cuenta.
