# ADR-169 — Los temas comparten su base y viven en una capa

- **Estado**: **aceptada** · 2026-08-17 — decidida por el propietario
- **Cambia API pública**: sí. Añade `CompileThemes` y una capa de cascada, `nebula.theme`.
- **Toca**: `docs/02` §4, `packages/web/src/theme/layers.md` (el orden vive junto al código, no en `docs/03`), `packages/web/styles.css`.
- **Continúa**: [ADR-164](ADR-164-compile-theme-materializa-en-caliente.md) y
  [ADR-168](ADR-168-el-contrato-css-se-muda-con-los-temas.md).

## Contexto

Compilar los diez temas emite **781 kB de CSS en crudo**. Comprimen a 8,1 kB, así que por el cable
no se nota; lo que sí se nota es que el navegador descomprime y parsea esos 781 kB antes de pintar.
En la landing eso dobló el HTML de 1.007 a 2.574 kB.

Medido sobre las 20 combinaciones de tema y esquema:

| | |
| --- | --- |
| Variables por combinación | 627 |
| **Idénticas en las 20** | **445** |
| Propias de cada una | 182 |
| Declaraciones hoy | 20 × 627 = **12.540** |
| Con una base compartida | 445 + 20 × 182 = **4.085** |

**El 67% del CSS es el mismo valor repetido.** Entre dos productos del mismo esquema sólo cambian
**52** variables: tipografía, radios, espaciado, tamaños, motion, sombras y z-index son idénticos
porque salen todos de la misma base (ADR-168 §4).

Y hay una segunda cosa. Las reglas de tema **no están en ninguna capa**, mientras `packages/web`
declara `nebula.reset`, `.primitive`, `.component`, `.composite` y `.util`. Lo no capado gana sobre
lo capado, así que cualquier declaración que un consumidor escriba sobre `:root` pisa el tema sin
pretenderlo, y no hay forma de expresar «el tema manda salvo que lo pidas».

## Decisión

### 1. `CompileThemes` emite una base y las diferencias

```ts
export function CompileThemes(themes: Record<string, ThemeSchemes>): CompiledSet;
```

Lo que comparten las combinaciones del conjunto va a una regla en `:root`; cada clase lleva sólo lo
suyo. `classList.add(clase)` sigue montando un tema con una sola clase — lo que cambia es que la
clase ya no repite lo que no cambia.

**La base se calcula sobre el conjunto que compiles**, y eso hay que saberlo: compilar dos temas da
una base mayor que compilar diez, porque coinciden en más cosas. Los CSS de `/all/web` y de
`/aurora/web` **no son intercambiables**; cada uno es coherente consigo mismo.

`CompileTheme` en singular no se toca: sigue emitiendo un tema completo y autónomo, que es lo que
un tenant o un preview necesitan.

### 2. Todo eso vive en `nebula.theme`, y es la capa más baja

```css
@layer nebula.theme, nebula.reset, nebula.primitive, nebula.component, nebula.composite, nebula.util;
```

Primera, o sea la que menos manda. Es lo correcto para un tema: define valores por defecto que
cualquier cosa más específica debe poder pisar, empezando por el propio catálogo.

Que el orden salga de `styles.css` es lo que el gate `check:layers` ya exige, así que la capa nueva
entra por la puerta que había.

### 3. `THEME_CLASSES` se queda fuera de la capa, a propósito

Las dos clases del par por defecto las genera Vanilla Extract con `createTheme` en build, y llevan
las 627 completas. Al no estar capadas ganan sobre la base compilada, que es **la dirección segura**:
quien mezcle las dos vías acaba con el tema por defecto entero, no con medio tema.

## Alternativas

**Dejar las 445 repetidas.** Comprimen a casi nada y no cuestan red. Se descarta por el parseo: 781
kB de texto antes del primer pintado es justo lo que la landing no puede permitirse, y el problema
crece con cada tema que se añada.

**Una clase base que haya que añadir junto a la del tema.** Evita tocar `:root` y es explícito. Se
descarta porque obliga a `classList.add` dos veces y a que el script de arranque sepa que hay dos
clases; el punto de todo esto era que montar un tema fuera añadir una clase.

**Meter el tema en `nebula.reset`** en vez de una capa propia. Se descarta porque el reset es del
catálogo y el tema es del consumidor: mezclarlos impide reordenar uno sin mover el otro.

## Consecuencias

- El CSS de `/all/web` baja de 12.540 declaraciones a 4.085. El HTML de la landing deja de doblarse.
- **Rompe la precedencia** para quien ya tenga CSS propio pisando variables de tema: al entrar el
  tema en una capa, ese CSS ahora gana **siempre**, incluso donde antes empataba por orden. Es la
  dirección deseable y en `0.x` es el momento barato de asumirla.
- `check:layers` pasa a vigilar seis capas en vez de cinco.
- **No cierra** el agujero de los `breakpoints`, que siguen sin llegar al CSS.
