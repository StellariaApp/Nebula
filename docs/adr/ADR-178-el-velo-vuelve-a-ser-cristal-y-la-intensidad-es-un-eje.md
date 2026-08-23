# ADR-178 — El velo vuelve a ser cristal, y su intensidad es un eje

- **Estado**: aceptada · 2026-08-22 (decisión del propietario, calibrada contra la maqueta) · **P5**
- **Sustituye a [ADR-118](ADR-118-el-cristal-recupera-su-filo-y-el-velo-se-vuelve-opaco.md)** en sus
  §1, §2 y §3. El resto de ADR-118 —el filo como clave del contrato (§4), la familia del gate (§5),
  la entrada tolerante del esquema (§6), `AppShell` siguiendo al `level` (§7) y el borrado de
  `glassBorder` (§8)— sigue en pie.
- **Cambia API pública**: no. Cambian valores de token y el vocabulario de un eje de la capa de demo.
- **Rompe**: `ThemeChoice.glass` pasa de `boolean` a `Glass` en `@stellaria/nebula-demos`, que es
  privado.

## Contexto: ADR-118 se calibró con el desenfoque muerto

ADR-118 subió el velo a 0.78–0.90 el 2026-08-09, mirando la maqueta. Lo que no se sabía entonces es
que `GlassSurface` **no estaba desenfocando nada**: su hoja declaraba `backdropFilter` y
`WebkitBackdropFilter` en la misma regla, de las dos sobrevive una —la última— y el alias no lo
entienden ni Chrome ni Firefox. El defecto entró el 2026-07-31 (`9db40767`) y se arregló el
2026-08-22. Medido en Chromium 149 sobre la regla emitida, `getComputedStyle(...).backdropFilter`
devolvía `none`.

Es el mismo defecto que ADR-070 §19 documentó en `Nav`, con una diferencia: aquel ADR dio por a salvo
a `GlassSurface` y `BlurOverlay` «porque lo declaran al nivel raíz del estilo». No era cierto — la
colisión no depende de la anidación, y esos dos llevaban tres semanas rotos.

Así que el diagnóstico de ADR-118 —«el velo es demasiado fino y el filo se lee como línea muerta»—
salió de mirar paneles **translúcidos y nítidos**. `Section`, `Card` y `Nav` sí desenfocaban;
`GlassSurface` y todo lo que pasa por él, incluido `AppShell` entero, no. La premisa no se sostiene
entera, y por eso la decisión se reabre en vez de respetarse.

## Decisión

### 1. El velo baja, y el ascenso es exponencial

| nivel     | ADR-118 | ahora | desenfoque | quién lo usa                        |
| --------- | ------- | ----- | ---------- | ----------------------------------- |
| `veil`    | 0.05    | 0.05  | 1 px       | accionables (ADR-136)               |
| `band`    | 0.78    | 0.46  | 2 px       | la banda de `Section` (ADR-082)     |
| `control` | 0.81    | 0.48  | 4 px       | controles                           |
| `subtle`  | 0.84    | 0.56  | 8 px       | `Card` y el sidebar de `AppShell`   |
| `default` | 0.87    | 0.69  | 12 px      | `GlassSurface`, footer de `AppShell` |
| `strong`  | 0.90    | 0.90  | 16 px      | header de `AppShell`                |

**Los dos extremos no se mueven.** `veil` sigue siendo el 5 % de siempre y `strong` sigue siendo
material macizo; lo que aparece es recorrido entre uno y otro. El ascenso es exponencial y no lineal
a propósito: +0.02 entre `band` y `control`, +0.21 entre `default` y `strong`. Los tres de abajo se
agrupan como cristal de verdad y el techo se despega como material, en vez de los cinco tonos del
mismo gris que ADR-118 §3 aceptó como consecuencia.

**El desenfoque es un peldaño de `effects.blur` por nivel** —`xxs · xs · sm · md · lg · xl`—, sin
repetidos ni saltos. La rampa anterior gastaba 1 px dos veces y luego brincaba de 4 a 12, que es lo
que hacía indistinguibles a los cuatro de abajo. Todos los valores salen de la escala: no se inventa
ningún blur suelto, que es lo que `effects-guardrails` prohíbe.

### 2. Y **por eso** el filo vuelve a llevar alfa — y sube con el nivel

| nivel     | oscuro (blanco) | claro (negro) | ratio medido |
| --------- | --------------- | ------------- | ------------ |
| `veil`    | 0.05            | 0.07          | 1.17         |
| `band`    | 0.06            | 0.07          | 1.17         |
| `control` | 0.07            | 0.08          | 1.19–1.20    |
| `subtle`  | 0.08            | 0.08          | 1.19–1.25    |
| `default` | 0.10            | 0.09          | 1.23–1.31    |
| `strong`  | 0.12            | 0.10          | 1.25–1.38    |

Es la otra mitad de la misma decisión, y ADR-118 §2 la dejó escrita al revés: «el filo plano solo es
válido porque el velo es opaco. Subir la transparencia del velo sin volver al filo con alfa
reintroduce la línea muerta, y está medido». Se cumple el trato: baja el velo, vuelve el alfa.

**Y el alfa no es constante: acompaña al velo.** Un filo es el canto del material, así que a más
material más canto — `strong` puede permitirse un filo definido porque su relleno ya define el panel;
`veil` no, porque ahí el filo sería lo único opaco de una superficie que casi no existe. Un solo valor
para los seis dejaba el de arriba flojo y el de abajo pegado encima, que es la línea muerta otra vez
en pequeño.

Con alfa el filo **compone con lo que tiene detrás**, así que su ratio deja de oscilar con la
superficie: el plano medía 1.13–1.21 según el rol y con los velos de este ADR tres de sus pares caían
por debajo del suelo de 1.15. Un filo que compone no puede desincronizarse del relleno, que es
exactamente lo que ADR-118 §7 arregló a mano en `AppShell`.

**Los dos esquemas no son simétricos, y el suelo del gate manda en el claro.** Negro sobre un velo
claro contrasta mucho más por unidad de alfa que blanco sobre uno oscuro: en oscuro un 0.06 ya mide
1.20 y hay sitio de sobra por debajo, mientras que en claro un 0.06 mide 1.14 y **no pasa**. Por eso
la rampa clara arranca en 0.07 y sube menos: no es una elección estética, es dónde muerde el suelo de
ADR-118 §5.

### 3. La intensidad del velo es un eje, no una constante

`@stellaria/nebula-demos` gana `Glass = "off" | "sheer" | "frosted" | "milky"`, y con él el
interruptor booleano de cristal del panel pasa a ser un segmento de cuatro. Es la misma forma que
`Corner` y `Density` (ADR-155 §2): un preset que sustituye una tabla que ya existe en `NebulaTheme`,
no una extensión del contrato.

| valor     | suelo de `band` | qué es                                   |
| --------- | --------------- | ---------------------------------------- |
| `off`     | —               | `effects.glass.enabled: false`           |
| `sheer`   | 0.32            | el cristal más limpio                    |
| `frosted` | 0.46            | **el del tema** — la tabla de §1          |
| `milky`   | 0.60            | a medio camino de la rampa de ADR-118    |

`frosted` no tiene tabla propia a propósito: es el valor base, así que la elección por defecto cuenta
como **intacta** y el tema sigue viajando como clase en vez de como vars en línea (ADR-163). Un
default que solo viviera en el panel habría mandado a todo el mundo por la vía lenta desde el primer
render, que es justo lo que P5 existe para evitar.

## Consecuencias

- **`Section glass` vuelve a dejar ver lo que hay debajo.** ADR-118 la convirtió en una banda al 78 %
  que difuminaba el `StarField`; a 0.46 con 2 px vuelve a ser una franja intercalada de verdad. La
  portada debe revisar dónde alterna, otra vez.
- **Las láminas visuales se mueven, y no solo por esto.** El arreglo del alias ya las movía —el
  desenfoque ahora pinta— así que el rebase hay que hacerlo igual, y en linux: los baselines de CI son
  de esa plataforma y `win32` deriva por su cuenta hasta que se cumpla ADR-149.
- **La pregunta de rendimiento que ADR-118 dejó abierta se cierra a medias.** `default` y `strong`
  siguen pidiendo 12 y 16 px, pero ahora tienen algo que desenfocar: a 0.69 y 0.90 el filtro ya no se
  paga para nada. El que se abarataba —bajarlos de radio— se descartó porque el techo es lo único que
  este ADR no toca.
- **`check:contrast` sigue sin ver el caso que importa.** Mide el filo contra roles de superficie
  planos; la línea muerta aparece sobre degradados. El gate quedó verde con los velos bajados y el
  filo plano todavía puesto, así que su verde no es prueba de nada aquí. Lo que protege este ADR es la
  regla, no la medición.
- **Un tema de terceros con la rampa vieja sigue siendo válido.** El contrato no cambia; solo cambian
  los valores del tema base, y `GLASS_EDGE_FALLBACK` sigue cubriendo al que no traiga filo.
- Se corrigen `docs/02` §5 y los `.md` de `GlassSurface`, `Section` y `products`, que describían la
  rampa anterior.
