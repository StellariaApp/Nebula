# ADR-158 — La escalera de elevación vuelve a cumplir su escalón

- **Estado**: **rechazada** · 2026-08-17 — se construyó, se midió, **se aplicó y se miró
  renderizada**, y el propietario la descartó: el resultado visual no convenció. El código está
  revertido y el gate volvió a sus 165 pares. Se conserva por lo que mide: **el defecto que
  describe sigue ahí**, y quien lo redescubra encontrará aquí los números y por qué esta salida
  no se tomó.
- **Origen**: §2.2 de la [auditoría del sistema](../reviews/auditoria-sistema-2026-08-16.md), fase 1
  de VA1.
- **Completa**: [ADR-065](ADR-065-escalon-de-superficie-y-escalera-de-sombras.md) §1, cuyo escalón
  mínimo de 1.08 se implementó y **se revirtió sin que nadie lo notara**.
- **Enmienda**: [ADR-088](ADR-088-el-activo-tambien-recibe-hover.md), que redecidió la rampa clara, y
  la sección `colors.surface` de `nebula-dark` y `nebula-light`.
- **Conserva**: [ADR-100](ADR-100-el-esquema-oscuro-hunde-el-overlay.md) entero — su modelo y sus dos
  elecciones nombradas se quedan exactamente donde están.
- **Toca**: `docs/06` §5 y §5.1, que describen una asignación que el código no tiene.
- **No cambia la forma del contrato**: `SurfaceRole` conserva sus ocho miembros y ningún tema deja de
  validar.

## Contexto

### La regla existe, se implementó, y hoy no se cumple

ADR-065 §1 fijó el escalón mínimo entre dos niveles de elevación adyacentes en **1.08**, con una
justificación que el propio ADR destaca en una línea:

> **Un escalón de elevación nunca separa menos que un escalón de hover.**

`docs/06` §5 la recoge, la da por **«implementado en B3»** y publica una tabla que dice estar
**«verificada sobre el render»**. Medido hoy sobre los temas que se publican:

| tema    | overlay→base | base→raised | raised→sunken | cumplen |
| ------- | ------------ | ----------- | ------------- | ------- |
| `dark`  | 1.094 ✓      | **1.052** ✗ | **1.078** ✗   | 1 de 3  |
| `light` | **1.035** ✗  | **1.026** ✗ | **1.045** ✗   | 0 de 3  |

**En el tema claro no cumple ni un solo par.** Y el escalón de interacción que `docs/06` §5.1 fija en
la misma magnitud vale **1.052** en oscuro y **1.026** en claro, porque `surface.hover` es
literalmente el mismo valor que `surface.raised` en los dos temas.

La consecuencia se ve sin instrumentos: pasar el ratón por una fila dentro de una `Card` **no cambia
nada**, porque el color de hover y el de la superficie que hay debajo son el mismo hex. Alcanza a los
17 componentes que consumen `surface.hover`, `Table`, `DataGrid` y `Accordion` incluidos.

### No es que nunca se hiciera: se hizo y se deshizo

| commit    | qué le hizo a la rampa de `light`                                                            |
| --------- | -------------------------------------------------------------------------------------------- |
| `051aa65` | «la escalera de elevación, al segundo intento (ADR-065 / B3)» → `50` / `400` / `600` / `800` |
| `88ab398` | «el activo también recibe hover (ADR-088)» → `50` / `200` / `300` / `400`                    |

La rampa de `051aa65` es **exactamente la tabla que `docs/06` §5 sigue publicando**, y medida
**cumple**: 1.110 · 1.084 · 1.108. Un ADR sobre el estado `active` reescribió el bloque de superficies
entero y aplanó la elevación de paso, sin decirlo.

Hay además un desajuste dentro del propio ADR-088: su §«La escalera del tema claro, de paso» decide
`raised` = `light.400` y `sunken` = `light.600`, y **el código tiene `light.300` y `light.400`**.

### Por qué ningún gate lo vio

Porque hasta el 2026-08-16 **ninguno medía la distancia entre dos superficies**. Los diez gates de
`docs/03` §4 verifican propiedades absolutas —este par de texto contrasta, este módulo pesa— y el
gate 8 verifica que nada se ha movido de sitio. Ninguno verificaba que dos cosas estuvieran
**suficientemente separadas**, que es la clase entera a la que pertenece este defecto.

`tools/contrast-check` ya mide los escalones desde esa fecha, y por eso está en rojo.

### La paleta no era la limitación

Medido: `dark` recorre **1.588** de extremo a extremo y `light` **1.527**; tres escalones de 1.08
piden **1.260**. La rampa actual de `light` usa **1.11** de los 1.527 disponibles. Buscando de forma
exhaustiva sobre los 11 peldaños hay **42 asignaciones conformes en `dark` y 46 en `light`**. El sitio
estaba; no se estaba usando.

## Decisión

### 1. Los cuatro peldaños de superficie se reabren

Se conserva el **modelo de ADR-100** —el `overlay` en el extremo, `base` neutro y la elevación
hundiéndose desde ahí, idéntico en los dos esquemas— y se separan los peldaños hasta cumplir el 1.08:

| rol       | `dark` antes | `dark` ahora   | `light` antes | `light` ahora   |
| --------- | ------------ | -------------- | ------------- | --------------- |
| `overlay` | `dark.400`   | `dark.400`     | `light.50`    | `light.50`      |
| `base`    | `dark.600`   | `dark.600`     | `light.200`   | **`light.400`** |
| `raised`  | `dark.700`   | **`dark.800`** | `light.300`   | **`light.600`** |
| `sunken`  | `dark.800`   | **`dark.950`** | `light.400`   | **`light.800`** |

Escalones resultantes:

| tema    | overlay→base | base→raised | raised→sunken |
| ------- | ------------ | ----------- | ------------- |
| `dark`  | 1.094        | 1.134       | 1.165         |
| `light` | 1.110        | 1.084       | 1.108         |

**En `dark` no se toca ni `overlay` ni `base`.** Son las dos elecciones que ADR-100 nombró
explícitamente —hundir el overlay para que el cristal tenga de qué distinguirse, y sacar el lienzo
del casi-negro— y se quedan intactas. Solo se abren los dos peldaños internos, que era donde estaba
el defecto. De las 42 asignaciones conformes, ésta es la de **menor deriva: tres peldaños**.

**En `light` los cuatro peldaños son los de `051aa65`**, es decir los que `docs/06` §5 nunca dejó de
publicar. Lo único que cambia respecto a aquella tabla es que `base` y `raised` van intercambiados,
porque el modelo de ADR-088/ADR-100 hunde la elevación en vez de subirla. **El error de ADR-088 no
fue cambiar el modelo: fue comprimir los peldaños al hacerlo, cuando bastaba con intercambiarlos.**

### 2. `hover`, `active` y `hoverActive` pasan a ser un velo, no un color

Un valor absoluto **no puede** resolver el escalón de interacción. `docs/06` §5.1 lo pide «contra la
superficie sobre la que se apoya el elemento», y esa superficie es `base` en una página y `raised`
dentro de una card. Si `base` y `raised` distan 1.08, un único hex que despegue 1.08 de los dos tiene
que caer a 1.166 o más de `base` — es decir, **en el peldaño de `sunken`**. Se cambiaría una colisión
por otra: hoy `hover` ≡ `raised`, y mañana `hover` ≡ `sunken`.

Un velo translúcido no tiene ese problema, porque compone sobre lo que haya debajo:

```
dark    surface.hover = rgba(255, 255, 255, 0.035)
light   surface.hover = rgba(0, 0, 0, 0.045)
```

Medido, el escalón sale **constante sobre cualquier superficie**, que es justo lo que §5.1 pide:

| tema    | sobre `base` | sobre `raised` | sobre `sunken` |
| ------- | ------------ | -------------- | -------------- |
| `dark`  | 1.102        | 1.116          | 1.111          |
| `light` | 1.104        | 1.108          | 1.101          |

El signo se conserva: en claro oscurece, en oscuro aclara (`docs/06` §5.1).

### 3. `docs/06` §5 y §5.1 se actualizan en el mismo PR

La tabla de §5 pasa a ser la de arriba, y §5.1 registra que el escalón de interacción es un velo.
Ambas dejan de describir un estado que el código no tiene desde el 2026-08-04.

## Alternativas

- **Restaurar `051aa65` tal cual** en el tema claro (`sunken` 800, `base` 600, `raised` 400,
  `overlay` 50). Cumple el 1.08 y es lo que `docs/06` publica, pero **revierte el modelo de ADR-088 y
  ADR-100**: vuelve a poner `raised` más claro que `base` en un esquema claro, y rompe la simetría
  entre los dos esquemas que ADR-100 construyó a propósito. Descartada: el modelo no era el defecto.

- **Bajar el mínimo de 1.08 a lo que hoy se cumple** (~1.05). Es la opción de coste cero, y consiste
  en cambiar la regla porque el código no la cumple. Descartada: el 1.08 no es arbitrario, sale de
  medir el escalón de hover del diseño de referencia (1.075 y 1.078, `docs/06` §5.1), y bajarlo
  devuelve el sistema a que subir un nivel entero se note menos que pasar el ratón por encima —
  exactamente el estado que ADR-065 existió para arreglar.

- **Ampliar `SurfaceRole`** con un peldaño intermedio para que `hover` tenga sitio propio sin ser un
  velo. Descartada: es cambio de contrato, arrastra a native, y `shadows.md` ya razonó que ampliar el
  enum para separar niveles que colapsan no es el camino.

- **Dejar `hover` como hex y aceptar que solo funcione sobre `base`.** Es lo más barato de
  implementar y deja rota la mitad de los casos —toda fila dentro de una card—, que es de donde
  salió el hallazgo. Descartada.

- **Regenerar las paletas `light` y `dark` con más recorrido** en vez de reabrir los peldaños.
  Resuelve también §2.3 de la auditoría, pero mueve las 20 paletas y es una decisión mucho mayor.
  Queda para el ADR de `lift`, si se hace; no bloquea a éste.

## Consecuencias

- **Cierra los 19 fallos de escalón** del gate. Medido sobre los dos temas oficiales con la
  asignación de arriba y con el reparto de bordes del punto siguiente: **40 rojos → 15**, y
  **todos los pares de elevación y de interacción quedan en verde en los dos temas**.

- **Habilita el ADR del borde, y lo necesita.** Con la rampa abierta, `border.default = gray.500`
  pasa a cumplir el 3:1 de SC 1.4.11 en los dos temas (mín. 3.01 en oscuro, 3.41 en claro), que es
  el fallo crítico §2.1 de la auditoría. Queda pendiente ahí: `border.strong` tiene que salirse a
  `gray.300`/`gray.400` para no chocar con el nuevo `default`, y `border.subtle` necesita un valor
  que no colisione con `sunken`. **Es un ADR aparte y sale casi entero de éste.**

- **Arrastra la calibración del filo del cristal, y eso no es gratis.** Quedan **12 pares de
  `glass.<nivel> (filo)` en rojo** después del cambio. La causa es que ADR-102/ADR-118 dejaron el
  filo como **hex fijo por tema** (`#e9e9ea` / `#23252c`) en vez de derivarlo de un rol: calibrado
  contra las superficies viejas, deja de servir en cuanto las superficies se mueven. Es la tercera
  decisión de esta serie y **debe ir en el mismo PR o inmediatamente después**, o el gate no vuelve
  a verde. Es también la razón por la que los 9 temas de producto comparten filo neutro:
  `BuildProduct` no toca `effects.glass`.

- **`surface.hover` deja de ser un hex.** Sigue siendo un `string` del contrato, así que **ningún
  tema deja de validar y `SurfaceRole` no cambia**, pero el color renderizado ya no se puede saber
  leyendo el token: depende de lo que tenga debajo. `tools/contrast-check` ya lo aplana con
  `Composite` (ADR-102), y native lo admite igual. Quien dependiera del valor absoluto de
  `surface.hover` verá un `rgba`.

- **Y por eso rompe los 18 temas de producto, que asumían hex.** Descubierto al aplicarlo:
  `BuildProduct` de `packages/demos` tiñe el lienzo de cada producto pasando **cada** superficie por
  `Shade`, que hace `parseInt(hex.slice(...), 16)`. Con un `rgba` eso da `NaN` y la superficie sale
  como `#NaNb4NaN` en los nueve productos × dos esquemas. Se arregla con una guarda de una línea
  —`if (!hex.startsWith("#")) return hex;`—, y **no es un parche sino lo correcto**: un velo
  translúcido no necesita teñirse por producto, porque compone sobre la superficie que el producto ya
  tiene teñida. Regla derivada: **un rol de color del contrato puede dejar de ser opaco, así que
  quien lo manipule por canales tiene que declarar qué hace con lo que no lo es.**

- **El gate hereda el modelo, no solo los valores.** `ELEVATION_LADDER` de
  `tools/contrast-check/src/pairs.ts` codifica la cadena `overlay → base → raised → sunken`, que es la
  adyacencia del modelo de ADR-100. Si el modelo cambiara —§Punto abierto—, esa cadena dejaría de
  describir pares adyacentes y el gate mediría saltos de dos peldaños como si fueran de uno:
  **pasaría, y por el motivo equivocado**, que es la forma de fallo que ADR-132 §4 ya nombró. La
  cadena tiene que moverse con el modelo, en el mismo PR.

- **Cambio visual simultáneo en todo el catálogo**, como ADR-046 y ADR-072 antes. Es la consecuencia
  principal y no hay migración progresiva posible: una escalera a medio abrir es peor que cualquiera
  de las dos.

- **Invalida el baseline de regresión visual.** Las 75 láminas de `win32` hay que recapturarlas, y
  `linux` sigue sin existir (`docs/03` §4.1). Es un argumento a favor de hacerlo **ahora**: el
  baseline de ADR-037 guarda hoy un aspecto que nadie declaró estable y que contradice a ADR-065.

- **La fase 2 de VA1 se desbloquea al cerrar esta serie**, no antes. Auditar 158 componentes contra
  una escalera que va a moverse devuelve 158 síntomas de una causa.

- **Regla derivada, y es la lección del defecto**: un ADR que reescribe un bloque de tokens
  **verifica las reglas que ese bloque ya tenía**. ADR-088 tocó `colors.surface` para decidir sobre
  `active` y se llevó por delante el escalón de ADR-065 sin mencionarlo. Ahora eso lo caza el gate;
  hasta el 2026-08-16 no lo cazaba nadie.

## El punto que se abrió al mirarlo — y cómo se cerró

> **Resuelto el 2026-08-17: se conserva el hundimiento, el de la tabla de arriba.** El propietario lo
> aprobó con las dos variantes renderizadas delante. Queda escrito lo que se comparó, porque la
> alternativa era gratis y alguien volverá a proponerla.

### En el tema claro, la card queda más oscura que la página

Lo destapó **mirar el render**, no medirlo: los números salen conformes en las dos variantes.

Con los peldaños comprimidos, la dirección del modelo era indistinguible. Al separarlos se ve por
primera vez que en un esquema claro «la elevación se hunde» significa **tarjeta más gris que el
lienzo**, y eso lee como un rebaje, no como una tarjeta. En oscuro el mismo modelo acierta —la card
se aclara, que es la convención— y se comprobó lo contrario: subirla la convierte en un agujero.

La alternativa es **intercambiar `base` y `raised` solo en `light`**:

|                           | `overlay`  | `base`          | `raised`        | `sunken`    |
| ------------------------- | ---------- | --------------- | --------------- | ----------- |
| hundimiento (lo aplicado) | `light.50` | `light.400`     | `light.600`     | `light.800` |
| la card sube              | `light.50` | **`light.600`** | **`light.400`** | `light.800` |

**Mide exactamente igual** —1.110 · 1.084 · 1.108— porque son los mismos cuatro peldaños con otra
etiqueta, así que la elección es de lenguaje visual, no de accesibilidad. Lo que cuesta es que los
dos esquemas dejan de compartir forma, que es lo que ADR-100 unificó a propósito: el hundimiento
acierta en oscuro y falla en claro. A cambio, «la elevación añade luz» es una regla que sí vale para
los dos.

**Se eligió el hundimiento**, así que `ELEVATION_LADDER` del gate se queda como está: la cadena
`overlay → base → raised → sunken` sigue describiendo la adyacencia real en los dos esquemas.

El argumento que decidió: **la simetría entre esquemas vale más que la convención de un esquema**. Un
solo modelo para los dos es lo que permite razonar sobre elevación sin preguntar antes qué tema está
puesto, y es lo que ADR-100 construyó a propósito. Con el escalón en su sitio, la card **se despega**
de la página en los dos —que era el defecto real— y la dirección en la que se despega es una
convención, no una función.

## Nota aparte, medida y no decidida

El tema claro **se agrisa** en cualquiera de las dos variantes: `base` pasa de `#fbfbfb` a un gris
declarado. Es aritmética, no gusto — no existe una escalera de tres escalones de 1.08 que arranque en
casi-blanco y se quede en casi-blanco. Quien quiera el lienzo más luminoso tiene que bajar el escalón,
y bajar el escalón es reabrir ADR-065.
