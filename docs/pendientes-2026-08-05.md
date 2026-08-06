# Pendientes — 5 de agosto de 2026

Sustituye a `pendientes-2026-08-04.md`, que se quedó desfasado en un día. Árbol limpio y **todos los
gates en verde** al escribir esto: contraste 116/116 en 5 temas, 1188 tests, a11y 87 suites y 596
tests, `size` sin excesos, typecheck y lint en los cuatro paquetes.

## Cerrado desde el día 4

| Qué                                            | Cómo quedó                                                                 |
| ---------------------------------------------- | -------------------------------------------------------------------------- |
| Los tres presupuestos en rojo                  | **0 en rojo**. `Hero` y `Form` se resolvieron por el camino con WN          |
| El gate ciego al alfa (deuda de ADR-102)       | `CheckTheme` aplana los dos lados antes de medir. 16.65 → 1.30 en el caso peor |
| `N4` de WN — repartir `hoverActive`            | **Cerrado**, y la regla resultó más estrecha de lo escrito. Ver abajo       |
| `CLAUDE.md` decía WR y «ADR-001…061»           | Dice WN y 102                                                              |
| Las tres pantallas del banco                   | Company, warehouse y el primer intento de Rosette, las tres montadas        |

### La regla de `hoverActive`, corregida

El prompt de WN listaba veintitantos candidatos. Los reales son **tres** —`DataGrid`, `Table` y
`TransferList`— y son los correctos:

> `surface.hoverActive` es para selección sobre superficie **neutra**. Si el estado seleccionado
> lleva **relleno de marca**, el cruce lo resuelve la escala de esa marca.

Un `NavLink` activo está teñido de `accent`; al pasar el ratón tiene que ahondar *ese* tinte, no
saltar a un gris del sistema. `Calendar`, `GridPicker`, `NavLink` y `Pagination` ya lo resuelven con
su propia var, y hacen bien.

## Lo que queda

### 1. WN, lo que falta

Hechos `N0` (nombres en hojas), `N1` (vars como espacio de nombres), `N2` (un idioma de compound) y
`N4`. Queda **el resto de `N3`** —props de ranura, que iba por la segunda tanda— y `N5` como cuaderno.

### 2. RP — la maqueta de Rosette

[`prompts/2.4-rosette-product`](../prompts/2.4-rosette-product/README.md), con las ocho preguntas
abiertas ordenadas por dependencia. La sesión que la tome debe empezar por la cuarta —si la vista del
avatar **es** la de generar—, porque decide la forma de las otras siete.

`Rosette.stories.tsx` está commiteado como punto de partida, **no como versión buena**.

### 3. Del encargo del panel

- **`CardComplex`**: los ajustes viven en la story y deberían subir al componente. Es el mismo
  hallazgo que produjo ADR-086 y ADR-101, así que lleva ADR.
- **`ColorInput` y el resto de pickers**: abrir el diálogo al pulsar el propio input, y cambiar la
  muestra de color por un icono de pincel.

### 4. Dos cosas que dejó la calibración de bordes

- **`border.subtle` y `border.default` valen lo mismo** en `dark`, `sober-light` y `playful`. El rol
  `subtle` perdió contenido propio ahí. O se recupera moviendo su `base`, o se documenta por qué
  existen dos roles idénticos.
- **Volver a bordes con alfa vuelve a ser una opción** ahora que el gate sabe medirlos. ADR-102 los
  descartó precisamente porque no sabía.

### 5. Deudas viejas

- La story `Phone` se eliminó y con ella la cobertura de viewport estrecho (`docs/06` §7), justo
  ahora que existe una capa responsive que nadie prueba en estrecho.
- Los cuatro componentes con píxeles inventados —`Charts` 720, `Form` 640, `TransferList` 640— siguen
  sin migrar al helper `SmallerThan`.
- `Segment` tenía `"10px"` cableado y apareció por casualidad. Merece un barrido de literales `px` en
  los `.css.ts`: si uno lo tenía, es probable que haya más.
