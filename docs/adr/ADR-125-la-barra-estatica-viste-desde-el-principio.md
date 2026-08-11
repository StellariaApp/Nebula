# ADR-125 — La barra que no sigue al scroll viste desde el principio

- **Estado**: aceptada · 2026-08-10 (defecto reportado por el propietario montando el cromo de docs) · **WN**
- **Cambia API pública**: sí. **Aditivo** en tipos —`level` nueva—, pero **cambia un defecto**: el glass
  de la barra pasa de `subtle` a `strong`, por decisión del propietario.

## Contexto

`Nav` no pinta su superficie desde la hoja: la publica en tres variables —`surfaceBg`,
`surfaceBorder`, `surfaceBackdrop`— y **solo las asigna cuando `floating || sticky`**. La hoja, a su
vez, solo las consume bajo `&[data-scrolled='true']`.

Eso es correcto para el caso que lo motivó —una barra transparente sobre un hero que se condensa al
bajar— y **deja sin superficie el caso contrario**: una barra estática, que es lo que pide el cromo de
docs. Sin fondo, sin filo y sin `position`, la barra no se ve. Se diagnosticó primero como un problema
de `z-index`, y no lo es: no hay nada que apilar porque no hay superficie.

## Decisión

**Una barra que no sigue al scroll no tiene un después en el que ganarse la superficie, así que la
lleva desde el principio.** Las tres variables se asignan siempre; lo que cambia es quién las consume:

| barra                 | superficie                          |
| --------------------- | ----------------------------------- |
| `floating` o `sticky` | al condensar, como hasta ahora      |
| estática              | **siempre**, y con `z-index` propio |

El `z-index` va con ella y no antes: una barra transparente que no se apila no tapa nada, y una que
viste sí tiene que quedar por encima de lo que scrollea debajo.

### `level` y por qué el defecto sube a `strong`

`level?: GlassLevel`, con **`strong` por defecto**. Antes el nivel estaba cableado a `subtle` en los
tres sitios, así que no había forma de pedir otro desde fuera.

`subtle` no separa por desenfoque sino por transparencia (`docs/06` §6, ADR-082), y una barra es
exactamente donde hace falta lo contrario: es lo único que se mantiene fijo mientras el contenido pasa
por debajo, así que necesita el peldaño que **sí** desenfoca. Con `subtle` el texto de la barra compite
con el que pasa por detrás.

No rompe el presupuesto de efectos: sigue siendo **un** efecto dominante por región, y la región es la
barra.

## Alternativas descartadas

**Que la app se pinte su propio fondo.** Es lo que estaba haciendo el cromo de docs con un `Box`
alrededor, y produce dos fuentes para la misma superficie: la del componente al condensarse y la de la
app siempre. Divergen en cuanto un tema cambia el glass.

**Dejar el defecto en `subtle` y que docs pida `strong`.** Traslada el problema al consumidor: cada
barra del catálogo tendría que acordarse de pedirlo, y la que no lo pida se lee mal.

## Consecuencias

- **La barra de la landing también sube a `strong`** al condensarse. Es el cambio visible de este ADR
  y es intencionado; se comprueba en el gate visual.
- `Nav` deja de depender de `data-scrolled` para tener superficie, así que una barra estática ya no
  necesita `sticky` solo para verse.
- El cromo de docs deja de envolver la barra en nada: la usa tal cual.
