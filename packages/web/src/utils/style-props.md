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

Un recipe que declaraba sus variantes fuera de capa —`Divider.css.ts` era el caso vivo— pisaba a las
clases de sprinkles, porque una regla sin capa gana a una regla en capa. La declaración inline no
tiene ese problema. **No era un arreglo de ese defecto**, solo dejaba de depender de él. ADR-142
cerró el patrón por su cuenta: hoy toda regla de componente está en capa y las sprinkles en
`util_layer`, la última.

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

La clave **y el objeto que come `sprinkles()`** se construyen en la misma pasada que clasifica las
props. `sprinkles()` sigue detrás de la caché; lo que ya no se difiere es armar el objeto.

Antes se difería: la clave salía de la pasada y el objeto se rearmaba en el fallo de caché
recorriendo las props otra vez. Eso era un **defecto**, no una optimización. El segundo recorrido se
guiaba solo por `PROP_KIND` y no veía la decisión de carril, así que un valor abierto sobre una prop
que además es sprinkle —`mx="auto"`, `p="12px"`, `bg="#ff0000"`, `fz="13px"`— acababa en
`sprinkles()`, que lanza `SprinklesError` porque el valor no está en su tabla. Bastaba con que otra
prop de sprinkles acompañara en el mismo nodo.

Recuperar la pereza exigiría anotar **qué claves** ganaron el carril de sprinkles, y esa lista es una
asignación por nodo igual que el objeto. No se gana nada, así que el objeto se arma una vez, en el
sitio donde ya se sabe la respuesta.

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

### El carril abierto no entra en la clave, y por eso `lh` sí

Una prop que se va por el carril abierto no toca `cache_key`: escribe su var y sale. Es correcto
mientras el carril abierto **no cambie la salida de sprinkles**, que es el caso de las 40 props.

`lh` es la excepción, y viene del acoplamiento `fz → lh` de ADR-077: la presencia de un `lh` decide
si `fz` arrastra o no su clase de interlineado. Con `lh` por token no hay problema —viaja por
sprinkles y entra en la clave sola—, pero con un valor abierto (`inherit`, `1.3`, `revert-layer`)
`{fz:"body1"}` y `{fz:"body1", lh:"inherit"}` producían **la misma clave** y clases que debían ser
distintas. Ganaba el primero en renderizarse, para el resto del proceso: si el del `lh` abierto iba
primero, todos los `fz="body1"` posteriores perdían su interlineado acoplado y ADR-077 dejaba de
cumplirse en silencio; si iba después, arrastraba una clase muerta. Y como el orden de render no es
el mismo en servidor que en cliente, la divergencia era observable en hidratación.

La supresión se marca ahora en la clave con un token vacío (`lh:0:;`), que no colisiona con ningún
`lh` de token porque el prefijo de longitud lo hace inyectivo. **La regla general**: si un carril
distinto del de sprinkles puede cambiar lo que sale de `sprinkles()`, tiene que dejar rastro en la
clave. Hoy `lh` es el único.

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

### Una familia viaja entera por el mismo carril

Las dos hojas —la de tokens y la del carril abierto— viven en `nebula.util` con la misma
especificidad, así que entre ellas decide el orden del archivo, y la del carril abierto va después.
Con cada prop eligiendo carril por su cuenta, `p={20} px="md"` pintaba 20 px por los cuatro lados: el
`padding` abierto llegaba más tarde que el `padding-inline` de tokens y lo pisaba. Lo mismo con
`bd="1px solid" bdc="border.default"`.

`FAMILIES` agrupa las props que se solapan como atajo y largo —relleno, margen, hueco, radio,
desborde y borde—. `OpenFamilies` hace una pasada previa y, si un miembro necesita el carril abierto,
manda por él a toda la familia: dentro de esa hoja el orden es el de `STYLE_PROPS`, que declara el
atajo antes que sus largos. Es una máscara de bits y no un `Set` para no reservar nada por render.

### El encadenado por breakpoint se resuelve aquí, no en la hoja

Hasta el 2026-11-16 cada tramo de la hoja abierta encadenaba hacia abajo
—`var(--nb-p-laptop, var(--nb-p-tablet, var(--nb-p)))`— y el elemento escribía solo los tramos que
declaraba. Tenía dos defectos, medidos en Chromium:

- Las custom properties se heredan. Un `Box` con `p={{ base: 10, tablet: 30 }}` dejaba su
  `--nb-p-tablet` a un descendiente con `p={12}`, que en tablet pintaba 30.
- `p={{ tablet: 20 }}` no declara base, y `padding: var(--nb-p)` con la variable vacía es inválida en
  tiempo de cómputo: caía al valor inicial, `0`, y pisaba el relleno del componente por debajo de
  tablet.

Ahora hay dos clases por prop (`Box.open.css.ts`):

- **Valor suelto** (`p={20}`): el elemento escribe `--nb-p` y la clase lee solo esa. Como la escribe
  siempre, no hay nada que heredar.
- **Valor por breakpoint**: `OpenSteps` escribe **los seis tramos ya encadenados** —`{ tablet: 240,
desktop: 320 }` deja `tablet` y `laptop` en 240 y `desktop` y `wide` en 320— y cada regla lee solo
  la variable de su tramo. Los tramos anteriores al primer valor van como `initial`, la regla cae a
  su fallback `revert-layer`, se retira, y manda la capa de abajo.

La hoja pasó de 98,4 a 75,6 kB porque desaparecen las cadenas anidadas. A cambio, un valor responsive
escribe seis variables en el `style` en vez de las que declara.

`revert-layer` como fallback de `var()` está comprobado en Chromium. En Firefox y Safari no se pudo
probar en la máquina donde se hizo el cambio.
