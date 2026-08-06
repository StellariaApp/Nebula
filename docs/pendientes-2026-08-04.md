# Pendientes — 4 de agosto de 2026

Estado al cierre de la sesión de calibración de WB. Nada de lo de abajo está commiteado salvo donde
se diga.

## 1. Bloqueantes — el árbol no está limpio

| Qué                                            | Dónde                                             | Detalle                                                                                                                                           |
| ---------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PRODUCTS` no monta los cinco productos nuevos | `apps/playground-web/src/fixtures/themes.tsx:173` | `ProductName` declara `polaris`, `aurora`, `nova`, `eclipse` y `cosmos`, pero el `Record` solo tiene tres entradas. El playground no typechequea. |
| `palettes.gray` es `undefined`                 | mismo archivo, semilla `eclipse`                  | `gray` no vive en `palettes`: es campo propio del contrato. Hay que importarlo suelto. Y como `primary` no sirve —croma 0.016—: usar `slate`.     |
| `palettes.purple` no existe                    | mismo archivo, semilla `cosmos`                   | La familia se llama `violet` o `grape`.                                                                                                           |

### Dos semillas con marca y acento indistinguibles

`nova` es `cyan` + `teal`: 40° de separación, el salto más pequeño de la rueda. `cosmos` es
`indigo` + `purple`, con el mismo riesgo. Conviene separarlos antes de dar los productos por buenos.

## 2. Tres presupuestos de tamaño en rojo

| Componente   | Exceso | Presupuesto |
| ------------ | ------ | ----------- |
| `Hero`       | +189 B | 16 kB       |
| `Form`       | +39 B  | 34 kB       |
| `Pagination` | +21 B  | 23 kB       |

**Verificado que no los causa nada de esta sesión**: medidos con `hoverActive` fuera del contrato y
con los tres archivos de tokens en stash, dan los mismos bytes exactos. Vienen de la calibración de
WB y se colaron porque el gate de tamaño no se volvió a correr desde entonces. `Hero` es el único que
merece investigación; los otros dos son ruido de decimales.

## 3. Sin commitear — seis bloques separables

1. **Arreglo de `Portal`** — iba a `document.body`, fuera del div con el tema, así que `Dialog`,
   `Affix`, `NProgress` y `ToastProvider` perdían todas las vars. Ahora consume el contenedor que
   publica el proveedor. **Es un fallo real y aislado: subir este primero.**
2. **Escalera de superficies y bordes del tema claro** — orden nuevo con `overlay` por encima de todo
   y bordes más suaves. Necesita ADR.
3. **`surface.hoverActive`** — contrato ampliado, cuatro temas, gate y checks. ADR-088 escrito.
4. **Tinta de degradado** — `GradientToken.ink` y derivación por peor extremo. ADR-089 escrito.
5. **Sangrado de `GradientText`** — la última letra se cortaba con tracking negativo. Documentado en
   su `.md`.
6. **`sand`, `slate` y `brown`** — tres paletas nuevas. Regeneración puramente aditiva (48 líneas,
   ninguna borrada). Necesita ADR porque amplía `PaletteName`.

Falta además la **escala de espaciado** (razón 1.33 desde `md`), que toca 365 sitios y sigue sin el
visto bueno visual.

## 4. Gates que no se han podido correr

`turbo` no consigue lanzar procesos en este entorno (`spawn UNKNOWN`, errno −4094), así que todo se
corrió paquete a paquete. **Sin correr desde los últimos cambios**: `a11y` del playground y
`size` completo. El resto —build, typecheck, contraste 116/116 en 5 temas, 1187 tests— en verde.

## 5. Del encargo original del panel, sin empezar

- **`CardComplex`**: los ajustes que hoy vivien en la story del panel deberían subir al componente y
  que la story lo consuma. Es el mismo hallazgo que produjo ADR-086 —si la story reconstruye el
  componente, falta el componente—, así que lleva ADR.
- **`ColorInput` y el resto de pickers**: abrir el diálogo al pulsar el propio input, y cambiar la
  muestra de color por un icono de pincel.
- **Company**, **el servicio de warehouse** y **el playground de Rosette**, que eran las tres
  pantallas que faltaban del banco de pruebas.

## 6. Fase siguiente

[`prompts/2.3-web-normalize`](../prompts/2.3-web-normalize/README.md) queda escrito con cinco tramos.
Los tres huecos medidos:

- `.vars.css.ts` en 58 componentes, pero **75** declaran `createVar()` suelto en la hoja.
- **9 compounds de 158**, y en dos idiomas distintos.
- Props de ranura en **un solo archivo** del catálogo. Es el hueco grande.

Más el reparto de `hoverActive`, que hoy no usa ningún componente.

## 7. Deudas viejas que siguen ahí

- `CLAUDE.md` dice que estamos en WR y habla de «ADR-001…061». Vamos por 089 y WB está cerrada.
- La story `Phone` se eliminó y con ella la cobertura de viewport estrecho (`docs/06` §7).
- `caption` sigue con el suelo de 12 px. El propietario pidió bajarlo; hace falta decidir entre un ADR
  que baje el suelo o reducir presencia por peso y color.
- `tools/contrast-check/src/pairs.ts` muestrea `stops[0]` para evaluar un fondo de degradado, así que
  valida el extremo fácil. Anotado en ADR-089.
