# ADR-126 — El carril y el contenido comparten eje

- **Estado**: aceptada · 2026-08-10 (comparación del propietario contra los docs de Mantine) · **WN**
- **Cambia API pública**: sí, y es **aditivo**: `contentWidth` en `AppShellProps`, solo para el modo
  carril. Sin ella el shell ocupa el ancho completo, como hasta ahora.

## Contexto

En el modo carril, la barra lateral es una **columna del grid**, no un hermano del contenido. La
consecuencia es que un tope de ancho puesto en el contenido —lo que hacía el cromo de docs— alcanza
solo a una de las dos columnas: el contenido queda acotado y centrado, y el carril sigue pegado al
borde de la ventana.

Medido contra los docs de Mantine en una ventana de 1870 px:

| capa                  | Mantine | Nebula antes |
| --------------------- | ------: | -----------: |
| inicio de la barra    |     240 |           25 |
| inicio del carril     |     245 |           30 |
| filo carril/contenido |     465 |          300 |

Mantine no tiene tres topes: tiene **uno**, y gobierna las cuatro capas —contenido de la barra, fila
de pestañas, carril y contenido—, todas alineadas en el mismo eje. Lo único a sangre es la
**superficie** de la barra: el fondo cruza la pantalla, su contenido no.

## Decisión

**`contentWidth` acota el grid entero del carril y lo centra.** No el contenido: el grid, para que
carril y contenido caigan dentro de la misma caja y compartan margen.

Cuando está puesta, el grid además se vuelve **transparente**. Su `surface.overlay` pintaba de borde a
borde y, acotado, se leería como una tarjeta centrada con dos franjas muertas a los lados; sin él, lo
que asoma es el `backdrop`, que es lo que debe verse detrás.

**La barra tiene que compartir el mismo número.** `Nav` ya traía su propio `contentWidth` con defecto
1180, así que con el shell en 1440 quedaban en ejes distintos —345 contra 215— y el desajuste se veía
más que el problema original. Por eso el cromo de docs declara **una constante** y se la pasa a los
dos. Verificado: logo 215, carril 215, fin de acciones 1655 —215 + 1440— y superficie de barra a 1870.

## Alternativas descartadas

**Acotar el contenido y meter el carril dentro.** Es sacar la barra lateral del grid y volverla un
hermano del contenido, o sea rehacer el modo carril entero. El grid es lo que le da la altura completa
y el comportamiento de móvil.

**Un tope global en el `body`.** Acota también las superficies, y entonces la barra deja de cruzar la
pantalla — que es justo lo que sí debe hacer.

## Consecuencias

- Nadie más lo usa todavía: es aditivo y el resto del catálogo no pasa `contentWidth`.
- El tope vive en el consumidor, no en el componente. No hay un valor por defecto porque depende del
  producto: 1440 es lo que pide el sitio, no lo que pide un `AppShell`.
- Queda una asimetría anotada: `Nav` y `AppShell` tienen cada uno su `contentWidth` y hay que
  mantenerlos a mano en el mismo número. Unificarlos exigiría un contexto de layout que hoy no existe.
