# ADR-024 — Lenguaje visual y calibración transversal de W2

- **Estado**: aceptada · 2026-07-21 (solicitud del propietario)
- **Contexto**: W1 cerró correctamente la infraestructura de temas y W2 ya entrega Layout,
  Typography y parte de Actions/Forms. Sin embargo, el contrato técnico no define por sí solo una
  dirección de arte consistente. Las escalas actuales permiten construir componentes válidos, pero
  no fijan jerarquía, ritmo, densidad, elevación ni presupuesto de efectos. El resultado puede pasar
  typecheck, axe y contraste y aun así verse pequeño, plano o inconexo.

## Decisión

1. `docs/06-visual-language.md` pasa a ser la especificación visual vinculante para Web y Native.
   La plantilla de componente y los prompts de ejecución deben enlazarla.
2. Nebula adopta una dirección **premium enterprise vibrante**: jerarquía clara y superficies
   sobrias; indigo/violet, glow, glass y gradientes se reservan para énfasis, nunca para decorar cada
   contenedor.
3. La escala tipográfica existente se recalibra, sin cambiar la forma de `NebulaTheme`, al baseline
   `48/40/32/28/24/20 · 16/14/13 · button 14 · caption 12`. Ningún texto informativo o interactivo
   baja de 12 px. `Text` representa cuerpo legible; `Title` representa jerarquía semántica. Labels de
   controles usan peso semibold y line-height normal; Blockquote fija cuerpo y atribución en lugar de
   depender de la herencia.
4. La escala espacial existente se conserva y recibe significado compositivo: `2/4` microajuste,
   `8` relación interna, `16` componente, `24` grupo, `32` sección y `48/64` regiones de página.
   Aumentar padding local para “arreglar” una composición queda prohibido si el problema pertenece al
   ritmo de la región. FormField separa label+ayuda de control+error para expresar las relaciones
   `2/8/4`, en vez de aplicar un gap uniforme.
5. Superficie y sombra expresan una única escalera de elevación. En dark, una sombra debe combinar
   oclusión y borde/rim sutil; reutilizar sombras negras de light sin calibración no cuenta como
   elevación visible.
6. Cada región puede tener un solo efecto dominante. Glass degrada según el theme, blur común se
   limita a `md`, glow se reserva para una acción/selección principal y gradientes nunca sostienen
   texto largo. Animaciones ambientales se derivan de múltiplos de tokens de motion; no se permiten
   duraciones o easings libres.
7. Las stories de matriz de props continúan, pero dejan de ser evidencia visual suficiente. Cada
   componente visual entrega al menos una story `Composition` en contexto real y una comparación de
   los cuatro temas. W2 incorpora una lámina transversal de Typography, Spacing, Surfaces, Actions y
   Forms. Las galerías de Icon tratan el nombre como contenido principal legible, no como caption
   diminuto; ActionIcon deriva el glifo de `sizes.control` con una ocupación cercana al 50 %.
8. La calibración se ejecuta como checkpoint `W2.V` antes de continuar expandiendo W2.3. No se
   reescriben de forma oportunista los componentes W2 ya en curso; se corrigen por lotes después de
   fijar tokens y láminas de referencia.

## Alternativas

- **Mantener solo tokens primitivos**: rechazada; deja decisiones de jerarquía y composición en cada
  autor y no evita la deriva visual.
- **Hacer Nebula predominantemente glass/gradient**: rechazada; reduce legibilidad, escala mal en
  interfaces densas y debilita el preset sober.
- **Reducir tamaños para una estética enterprise compacta**: rechazada como default; la densidad ya
  se expresa con `sober` y tamaños de control. El tema principal debe priorizar lectura y presencia.
- **Añadir de inmediato nuevas claves semánticas a `NebulaTheme`**: pospuesta. La primera calibración
  reutiliza las claves actuales; solo se ampliará el contrato si el checkpoint demuestra que no basta,
  mediante un ADR posterior.

## Consecuencias

- Cambiarán valores de tokens y estilos base existentes; no cambia todavía ninguna API pública.
- Las capturas visuales anteriores a W2.V dejan de ser referencia.
- `Paper`, `Text`, `Title`, `Button`, fields y las stories de fundamentos son el lote inicial de
  recalibración.
- Un componente no se considera visualmente cerrado por mostrar todas sus variantes: debe demostrar
  jerarquía, ritmo, estados, cuatro temas y reduced motion dentro de una composición representativa.
