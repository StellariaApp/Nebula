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

## El reparto no paga por nodo cuando no hay nada que repartir

La mayoría de los nodos internos del catálogo —un `<div>` estructural con su clase fija— no llevan
ninguna style prop. Para ellos la función **sale antes de asignar nada** y devuelve `props` tal cual
como `rest`, sin copiarlo. Es la diferencia entre ~850 ns y ~48 ns por nodo.

Dos consecuencias del atajo, que conviene tener presentes:

- **`rest` puede ser el mismo objeto que entró.** Nadie debe mutarlo. Todos los consumidores lo
  esparcen en JSX, que es de solo lectura, pero la regla es del contrato, no de la casualidad.
- El atajo solo aplica si no hay **ninguna** clave de estilo y tampoco `style` propio. Basta una
  para volver al camino completo, porque `style` no puede viajar en `rest` —quien haga spread lo
  pisaría— y una prop de estilo con valor inválido tampoco debe colarse en el DOM.

## La clase de sprinkles se cachea, y por qué la clave se escribe así

`sprinkles()` recorre **los 44 nombres de atajo en cada llamada**, pases las props que pases, y hace
hasta tres copias de objeto antes de devolver la cadena de clases. Como la función es pura
—mismas props, misma clase—, el resultado se guarda en un `Map` de módulo.

La clave se construye en la **misma pasada** que clasifica las props, y el objeto que come
`sprinkles()` solo se arma cuando la caché falla. Armarlo siempre costaba casi el doble.

El formato de cada token es `` `${key}:${text.length}:${text};` ``. El prefijo de longitud no es
adorno: hace la codificación **inyectiva**. Sin él, dos juegos de props distintos podrían concatenar
la misma cadena en cuanto un valor contenga el separador. Hoy los valores son claves de token y no
puede pasar; en cuanto se admitan valores arbitrarios, sí.

`JSON.stringify` se reserva para los valores responsive, que son objetos. Usarlo para todos costaba
el 40 % del tiempo de construir la clave —1.315 ns contra 775 ns por nodo de tres props— sin comprar
nada que el prefijo de longitud no dé.

**Es una caché de proceso, así que en SSR se comparte entre peticiones.** Es seguro porque la clave
son nombres de prop y de token, nunca datos de usuario, y el valor es una cadena de clases. Tiene
tope de 4096 entradas: pasado ese punto se sigue resolviendo, solo que sin guardar.

## El tipo público sale del registro, no de sprinkles (ADR-103)

`StyleProps` se deriva de `style-registry.ts` con un tipo mapeado. Por eso **hay un solo nombre por
prop**: los 40 alias largos que exponía la derivación anterior —`paddingInlineStart` junto a `ps`,
`background` junto a `bg`— no se borraron, simplemente dejaron de derivarse.

El runtime sigue aceptándolos: `PROP_KIND` los conoce, así que un consumidor en JavaScript que
escriba `paddingInline` no se rompe. Lo que cambia es que el tipo ya no los ofrece.

Dos nombres que conviene explicar porque se leen raro:

- **`rtl` `rtr` `rbl` `rbr`** son las cuatro esquinas sueltas del radio. `rtl` parece
  _right-to-left_ y no lo es; hacían falta porque `rt`/`rb`/`rl`/`rr` van **por pares** y sin ellas
  no se podía redondear una sola esquina.
- **El borde lógico usa el nombre CSS completo** (`borderInlineStart`, `borderBlockStartStyle`)
  mientras el físico se queda con los atajos. No es incoherencia: `bds` no puede ser a la vez
  `border-style` y `border-inline-start`, ni `bdbs` ser `border-bottom-style` y
  `border-block-start-style`. Paga la verbosidad el que menos se usa.

Los checks de `src/__checks__/style-props.test-d.ts` fijan lo que no se ve al leer: que el registro
conserva los literales —si los widenea a `string`, el tipo entero deja de servir— y que los alias
largos siguen fuera. Llevan control negativo, porque una aserción de tipo que no puede fallar no
comprueba nada.
