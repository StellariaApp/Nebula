# ADR-093 — El catálogo tiene su propia capa responsive

- **Estado**: **aceptada** · 2026-08-04 — a petición del propietario, al ver que `Hero` y `Nav` no se
  adaptaban
- **Añade**: `SmallerThan`/`LargerThan` en `packages/web/src/theme/media.ts`, la prop `collapse` de
  `Nav.Links` y el modo cajón de `AppShell.Sidebar`.

## Contexto

El propietario señaló que `Hero` y `Nav` no responden al ancho. Al medirlo, el hueco resultó mayor:
**solo 4 de 158 componentes tenían media queries de viewport**, y tres de esos cuatro usaban píxeles
inventados —`Charts` 720, `Form` 640, `TransferList` 640— que no están en la escala de breakpoints
(576/768/1024/1280/1536).

La causa es que **no existía el helper**. `Box` expone condiciones responsive por sprinkles, así que
un consumidor puede adaptar lo que compone él; pero un componente del catálogo que quiera adaptarse
por dentro no tenía nada, y quien lo necesitó se inventó un número.

Las dos referencias que pidió el propietario:

- **Rosette** (`globals.css`): `.hero` es una rejilla `0.9fr 1.1fr` que pasa a `1fr` a ≤980 px y a
  `display: block` a ≤680; el `h1` baja de escalón; `.site-header nav` desaparece a ≤680.
- **The Film Vault** (`packages/components/Sidebar`): la barra es `position: fixed` con
  `translateX(100%)`, **solo existe** por debajo de `tablet` (`display: none` arriba) y ocupa el ancho
  completo por debajo de `phone`. El disparador aparece en el mismo punto.

## Decisión

### 1. Un helper, construido sobre los tokens

```ts
SmallerThan("tablet"); // screen and (max-width: 767px)
LargerThan("tablet"); //  screen and (min-width: 768px)
```

`SmallerThan` resta 1 px para no solapar con `LargerThan` del mismo nombre. Los cuatro componentes con
píxeles inventados se migran en WN, no aquí: cambiarles el punto de quiebre es un cambio visible que
merece revisarse con la lámina delante.

### 2. `Hero` apila antes de que el cuerpo se estrangule

Es una fila flex `[izquierda] [cuerpo] [derecha]` con `gap: xxxl`. Por debajo de `laptop` pasa a
columna y los huecos dejan de ser rígidos (`flexShrink: 1`), que es el equivalente del `1fr` de
Rosette.

El título `xl` usa `clamp(3.25rem, 5.2vw, 4.25rem)`, que **parece** fluido pero no lo es donde
importa: a 375 px el `5.2vw` da 19,5 px, así que manda el suelo de 52 px. Por debajo de `tablet` baja
a `h2` y por debajo de `phone` a `h3` — peldaños de la escala, no números nuevos.

### 3. `Nav.Links` se pliega, y es una prop

`collapse: "none" | "phone" | "tablet" | "laptop"`, por defecto **`tablet`**, que es lo que hace
Rosette. Es una prop y no una regla fija porque esconder la navegación sin sustituto es una decisión
de producto: un `Nav` de tres enlaces cortos puede querer `none`.

El defecto cambia el comportamiento de quien ya lo usa —los enlaces desaparecen en móvil—, que es
justamente el arreglo pedido.

### 4. El sidebar del panel es un cajón por debajo de `tablet`

Copiando a The Film Vault: la rejilla del carril pasa de `"rail chrome" / "rail main"` a una sola
columna, y el sidebar se vuelve `position: fixed` con `translateX(-100%)`. `AppShell.Sidebar` gana
`opened`, `onClose` y `scrimLabel`; con `opened` entra deslizando y aparece un velo que cierra al
pulsarlo.

Se aparta de la referencia en una cosa: TFV **desmonta** la barra por encima de `tablet`
(`display: none`) y la vuelve a montar debajo. Aquí es el mismo elemento en los dos modos, para que el
estado de la navegación —qué está activo, qué grupo está abierto— no se pierda al cruzar el punto de
quiebre.

El velo es un `<button>` con `aria-label`, no un `<div>` con `onClick`: cerrar por el velo tiene que
funcionar con teclado.

## Consecuencias

- **Cuarta recalibración del suelo compartido**: `hoverActive` y `onGradient` añadieron dos vars al
  contrato, que cada módulo cuenta, y empujaron doce presupuestos entre 19 y 281 B. Suben 0,5 kB. La
  firma es inequívoca —primitivos pequeños, `Paper` 127 B, `Badge` 173, `Indicator` 134— así que es
  suelo y no regresión. `docs/03` §4 queda actualizado.
- `Hero` es el único con causa propia: de sus 281 B, ~90 son las media queries y el resto venía de la
  calibración de WB sin medir.
- Gates en verde: build, typecheck, lint, 1187 tests, contraste 116/116 en 5 temas, a11y 86 suites y
  593 tests, y el gate de tamaño con las bandas nuevas.
- **Queda pendiente el disparador**: `AppShell.Sidebar` acepta `opened`, pero ningún componente pone
  todavía el botón de hamburguesa en la cabecera. Lo monta la story del panel, y el patrón se decide
  en WN junto con el reparto de `hoverActive`.
