# 07. Contenido, i18n y accesibilidad

## Voz Stellaria

- Clara, moderna, segura y humana.
- Beneficio primero; mecanismo después.
- Frases cortas y verbos concretos.
- Ambición sin claims no demostrables.
- Tecnología explicada en lenguaje de producto.

Evitar:

- “Revolucionario”.
- “Garantizado”.
- “Líder mundial”.
- “Solución integral”.
- “Ilimitado” cuando existe consumo o fair use.

Preferir:

- “Inteligencia aplicada”.
- “Una operación que escala”.
- “Control y trazabilidad”.
- “Diseñado para…”.
- “Estimación” cuando aún no es precio contractual.

## Arquitectura de copy

- Eyebrow: categoría, no promesa.
- Título: resultado o tensión principal.
- Lead: usuario, alcance y contexto.
- Label: sustantivo breve.
- CTA: acción y siguiente paso real.
- Nota: condición, alcance, fuente o excepción.

## Internacionalización

- Español de México como base editorial actual.
- Inglés equivalente, no traducción literal.
- Los diccionarios viven fuera de componentes.
- No construir frases concatenando fragmentos traducidos.
- Permitir que el inglés ocupe entre 15% y 30% más ancho.
- Formatear divisa, números, fechas y pluralización con APIs de internacionalización.
- No codificar saltos de línea que dependan de un idioma.

## Preferencias globales

Idioma, divisa y tema son preferencias del usuario. Pueden persistirse por cookie funcional cuando la URL no deba variar. Si el SEO público necesita páginas indexables por idioma, usar rutas localizadas y `hreflang`; no mezclar ambas estrategias sin una decisión explícita.

## Precios y métricas

Cada cifra debe incluir:

- Divisa o unidad.
- Periodo.
- Alcance.
- Condiciones del descuento.
- Fuente o fecha cuando exista conversión.

Los precios estimados se presentan como hipótesis, no compromisos. El ahorro debe compararse contra una base claramente nombrada.

## Contraste

- Texto normal: mínimo WCAG AA `4.5:1`.
- Texto grande: mínimo `3:1`.
- Controles y focus: mínimo `3:1` contra colores adyacentes.
- El texto muted sigue siendo legible; “sutil” no significa invisible.
- Verificar contraste sobre blur, gradientes y previews.

## Focus y teclado

- Todo elemento interactivo recibe focus visible.
- Focus recomendado: `2px` de cyan del sistema con offset `2px`.
- Orden de tabulación coincide con el orden visual.
- Escape cierra modal/drawer.
- Enter y Space activan controles apropiados.
- Sliders funcionan con flechas, Page Up/Down, Home y End según plataforma.

## Targets

- Recomendado: `44×44px`.
- Mínimo absoluto: `40×40px` en interfaces compactas.
- Controles visualmente pequeños pueden ampliar su área interactiva.

## Semántica

- Un `button` ejecuta una acción; un enlace navega.
- Mantener jerarquía de headings sin saltos arbitrarios.
- Usar listas para colecciones reales.
- `aria-current` para navegación activa.
- `aria-live="polite"` solo en resultados que cambian y necesitan anunciarse.
- Iconos decorativos usan `aria-hidden="true"`.

## Color y estado

- Estado nunca depende únicamente del color.
- Combinar color con texto, icono o patrón.
- Success, warning, danger e info pertenecen al sistema, no al tema del producto.

## Cookies y privacidad

- Explicar qué cookies se usan y para qué.
- Separar cookies funcionales de analítica o marketing.
- No afirmar que existe únicamente almacenamiento necesario si se añaden trackers.
- Ofrecer una decisión clara y persistirla.
- Los textos legales y de privacidad requieren revisión jurídica antes de producción.

## Contenido sensible

Cuando el producto involucre identidad, adultos, finanzas u otros dominios sensibles:

- No esconder condiciones críticas en tooltips.
- Mostrar consentimiento, procedencia y estado de verificación.
- Evitar visuales que sugieran autorización cuando no existe.
- Diseñar rutas claras de retirada, reporte y soporte.

## Checklist de accesibilidad de componente

- Nombre accesible.
- Estado anunciado.
- Navegación por teclado.
- Focus visible.
- Contraste AA.
- Touch target suficiente.
- Zoom al 200% sin pérdida.
- Layout a 320px sin scroll horizontal accidental.
- Reduced motion.
- Lectura correcta sin color ni iconos decorativos.
