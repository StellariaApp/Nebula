# ADR-049 — El Modal gana una región `footer`

- **Estado**: **aceptada** · 2026-07-29 (G1.6 del tramo de geometría, aprobado en el plan)
- **Análisis de origen**: `docs/reviews/geometria-figma-vs-nebula-2026-07-28.md` §2.7 y §6 (G1.6).

## Contexto

`Modal` tiene tres regiones en el archivo de referencia (`#152:1528`) y **dos** en Nebula:

| Región | Figma | Nebula |
| ------ | ----- | ------ |
| header | padding 20/24, borde inferior 1 px | padding 16/24, borde inferior 1 px |
| body   | padding 24, gap 16 | padding 24 (`lg`) |
| footer | padding 16/24, gap 12, **borde superior 1 px**, alineado al final | **no existe** |

Sin región propia, las acciones de un modal se escriben dentro de `children`, es decir **dentro del
body**. El body pinta `surface.sunken`, de modo que los botones de confirmar y cancelar quedan sobre la
superficie hundida y sin el borde que los separa del contenido. El resultado es que el modal termina en
un bloque de contenido y no en una barra de acciones, que es lo que un diálogo necesita.

`ModalProps` ya expresa el header con props (`title`, `subtitle`, `withCloseButton`) en vez de con
subcomponentes: no es un compound. El footer sigue el mismo patrón.

## Decisión

1. **`ModalProps` gana `footer?: ReactNode`**, opcional y sin valor por defecto. Ausente, el modal
   renderiza exactamente lo que hoy.

2. **La región es hermana del body, no hija**: se renderiza fuera de `styles.body`, de modo que hereda
   la superficie del contenedor (`surface.overlay`) y no la hundida del cuerpo.

3. **Geometría del archivo, con la escala de ADR-045**: `paddingInline` `lg` (24), `paddingBlock` `md`
   (16), `gap` `u3` (12), `justifyContent: flex-end` y borde superior de 1 px con `border.subtle`.

4. **El header sube su `paddingBlock` de `md` (16) a `u5` (20)**, que es el valor del archivo y que
   hasta ADR-045 no existía en la escala. Deja el header ligeramente más alto que el footer —20 contra
   16—, que es la proporción del diseño: la cabecera pesa más que la barra de acciones.

## Alternativas

- **Convertir `Modal` en compound** con `Modal.Header`, `Modal.Body` y `Modal.Footer`: más flexible y
  más parecido a `Card`, pero rompe la API de `title`/`subtitle` que ya usan las láminas y las apps
  piloto, y convierte una adición en una migración. Rechazada por desproporcionada frente al problema.
- **Dejar que el consumidor componga el footer dentro de `children`**, que es lo que ocurre hoy: coste
  cero, y es exactamente el estado que produce el defecto —acciones sobre `surface.sunken`, sin borde
  de separación y con el padding del body—. Rechazada.
- **Un prop `actions` con array de botones** en vez de `ReactNode`: más dirigido, pero fija la forma del
  contenido y deja fuera los footers con texto legal, checkbox de «no volver a mostrar» o un botón
  destructivo a la izquierda. Rechazada.

## Consecuencias

- **Ampliación aditiva de API pública** en un componente. Nada de lo existente cambia de forma y los
  paquetes siguen `private: true`.
- **Cambio visual en el header de todo modal y drawer**: 4 px más de `paddingBlock`. `Drawer` lo hereda
  porque se implementa sobre `Modal`.
- **El baseline de ADR-037 debe capturarse después**, como el resto del tramo.
- **No resuelve la relación cabecera/cuerpo** discutida en `visual-calibration-2026-07-28.md` §3: esa
  quedó cerrada recalibrando `border.subtle`, y este ADR no la reabre.
