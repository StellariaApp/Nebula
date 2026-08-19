# ADR-172 — Los temas se llaman por su color, y el repertorio cubre la rueda

- **Estado**: **aceptada** · 2026-08-17, ampliada el 2026-08-18 — decidida por el propietario
- **Cambia API pública**: sí, y **rompe**. Trece temas cambian de nombre y con ellos sus subpaths.
- **Toca**: `packages/themes`, `docs/02` §3.

## Contexto

Los diez temas del paquete tenían dos problemas, y los dos se ven midiendo.

**Tres eran nombres de producto.** `rosette` es Casa Rosette, `stellaria` es el código semilla y el
scope de npm, y `polaris` es el constructor de sitios. Un tema del catálogo que se llama como un
producto concreto invierte el argumento de Nebula: los temas existen para que los productos no
tengan que forkar, no para nombrarse por ellos.

**Y el nombre no decía el color.** Un punto de Lagrange no tiene color; `cosmos` es genérico; una
nova es blanca-azul y ese tema era turquesa.

Además el repertorio estaba mal repartido. Medidos los tonos en OKLCH de los diez primarios:

```
  6°  25°  49° 52°  80°                      180°   220° 252° 276°       345°
  └────── 5 de 10 en 80 grados ──────┘       └─ un hueco de 100 grados ─┘
```

Cinco de diez apiñados en el arco cálido, y **un hueco de 100°** donde viven todos los verdes. De las
19 paletas del contrato, siete no lideraban ningún tema.

## Decisión

### 1. El nombre dice el color, en registro estelar y comercial

Nombre corto, pronunciable en castellano y reconocible sin carta astronómica. Un catálogo de estrellas
—`rigel`, `arcturus`, `antares`— es preciso y no lo lee nadie.

| Tono | Paleta | Antes | Ahora | Por qué |
| ---- | ------ | ----- | ----- | ------- |
| 6°   | rose   | `rosette`  | **`roseta`**  | La Nebulosa Roseta es rosa-roja; la grafía castellana la separa del producto |
| 25°  | red    | `antares`  | **`marte`**   | El rojo más reconocible del cielo, y el único que no hay que explicar |
| 49°  | brown  | `cosmos`   | **`titan`**   | La luna de Saturno, bruma naranja-parda |
| 52°  | orange | `arcturus` | **`apolo`**   | Ámbar solar; el nombre lo lleva medio siglo de misiones |
| 128° | lime   | `halley`   | **`cometa`**  | Conserva el linaje del cometa sin chocar de oído con `helix` |
| 180° | teal   | `nova`     | **`helix`**   | La Nebulosa de la Hélice es turquesa |
| 220° | cyan   | `vega`     | **`halo`**    | Azul pálido y difuso, como el anillo que lo nombra |
| 80°  | gold   | `sun`      | **`sol`**     | El único que quedaba en inglés; el registro es castellano |
| 252° | blue   | `rigel`    | **`zenit`**   | El azul del cielo en su punto más alto |

`nebula`, `aurora`, `vela`, `grafito`, `nova`, `quasar` y `eclipse` se quedan: ya decían su color.

### 2. Seis temas nuevos, sin paletas nuevas

Las paletas libres cubrían los huecos, así que **no hizo falta generar ninguna**:

| Tono | Paleta | Tema | Qué aporta |
| ---- | ------ | ---- | ---------- |
| 128° | lime   | **`cometa`**  | Llena el hueco de 100°. Los cometas brillan verdes |
| 306° | violet | **`vela`**    | El resto de supernova de Vela, magenta-violeta |
| 152° | green  | **`quasar`**  | El verde que faltaba entre `cometa` y `helix` |
| 251° | slate  | **`grafito`** | El neutro frío |
| 98°  | yellow | **`nova`**    | El destello |
| 25°  | red    | **`eclipse`** | Rojo sobre negro |

Los cuatro últimos **no se distinguen por el tono sino por el carácter**, que es lo que quedaba por
demostrar del contrato: un tema puede cambiar el lienzo, el suelo de tinta, el motion y los
materiales, no sólo la marca.

- **`grafito`** apaga los materiales y baja el motion. `motion.tier` y `effects.glass.enabled` son
  interruptores de tema desde `docs/02` §2 y ningún tema del paquete los usaba, así que la afirmación
  no tenía quien la demostrara. Para eso `ThemeSeed` gana `motion` y `glass`; sin declararlos manda la
  base, así que los otros quince no cambian.
- **`nova`** lleva el suelo de tinta a 4.5 y el degradado de amarillo a blanco. Al ser claro de punta a
  punta, `WorstInk` pone tinta oscura encima: sale el único tema de alto contraste del catálogo.
- **`eclipse`** comparte el rojo con `marte` —el primario es el mismo— y se separa por dónde acaba: el
  degradado de `marte` sube al oro y el de `eclipse` cae al negro, con el lienzo hundido a 0,125 de
  luminancia contra 0,212. Es además el único con **acento neutro**: rojo y negro, sin tercer color.

### 3. El contraste sigue siendo asunto de `nebula`

Medido: los quince de producto fallan entre 7 y 16 pares, **todos por lo mismo** — texto blanco sobre
el degradado de marca. `WorstInk` elige el menos malo de los dos y no el que pasa, así que cuando
ninguno llega al suelo se queda el claro.

**Se deja así a sabiendas**, como ya decidió [ADR-168](ADR-168-el-contrato-css-se-muda-con-los-temas.md)
§5: los temas de producto son variantes a gusto del consumidor y `nebula` es el único que Nebula
certifica. Quien lleve uno a producción lo valida con `pnpm check:contrast --theme <suyo>.json`.

## Alternativas

**Generar paletas nuevas.** Se evaluó y no hizo falta: las libres caían justo en los huecos. Siguen
sin liderar ningún tema `green` —a 24° de `cometa`—, `sand`, `light` y `dark`.

**Mantener los nombres y añadir sólo los nuevos.** Cero rotura. Se descarta porque tres nombres de
producto en el catálogo son deuda que sólo encarece: cada consumidor nuevo los ve y los copia.

**Traducir los nombres al inglés** (`rosette` en vez de `roseta`). Se descarta a propósito: es
justamente la grafía lo que separa el tema del producto.

**Diferenciar los cuatro últimos por tono.** No quedaba sitio: el arco cálido ya tenía cinco. Se
diferencian por lienzo, suelo y materiales, que es lo que el contrato promete y nadie ejercía.

## Consecuencias

- **Rompe**: trece nombres y sus subpaths `/<tema>` y `/<tema>/web`. Quien tenga uno guardado en
  `localStorage` cae al de por defecto — la guarda de ADR-166 ya lo cubre, pero pierde su elección.
- Dieciséis temas. El CSS de `/all/web` crece de 262 a ~400 kB en crudo; comprimido apenas se mueve,
  porque ADR-169 manda a `:root` lo que comparten y sólo baja la diferencia de cada uno.
- **`quasar` es verde y no azul-blanco**, que es lo que un cuásar es de verdad. Se acepta la
  licencia: el hueco que quedaba en la rueda era el verde profundo y el nombre ya estaba puesto.
- El par más justo del catálogo pasa a ser `zenit` y `grafito` —0,121 en el primario, 0,105 en el
  degradado—, muy por encima del 0,050 por el que se borró `corona`. `quasar` en `grape` habría
  dejado el rincón magenta con cuatro temas y un par a 0,089; en `green` queda a 0,215 de `cometa` y
  0,146 de `helix`, más separado de sus vecinos de lo que estaba en su sitio anterior.
- **`sand` se evaluó y se descartó**: está a 0,050 de `titan`, exactamente la distancia por la que se
  borró `corona`. Queda como la única paleta cromática sin tema, junto a `light` y `dark`.
