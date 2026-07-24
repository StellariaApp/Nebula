# 10. Checklist de calidad y consistencia

## Antes de diseñar

- [ ] La necesidad no está cubierta por un componente o patrón existente.
- [ ] Está claro qué parte pertenece al sistema y cuál al producto.
- [ ] Se definió la acción principal y el estado más importante.
- [ ] El contenido real está disponible; no se diseña solo con lorem ipsum.

## Tokens

- [ ] No hay hexadecimales de producto dentro del componente.
- [ ] Los roles semánticos se usan correctamente.
- [ ] Success, warning, danger e info no dependen del tema.
- [ ] Espaciado, radio, sombra y z-index vienen del sistema.
- [ ] El tema declara derivados de marca de forma consistente.

## Tipografía

- [ ] Existe una jerarquía clara con una cifra o idea dominante.
- [ ] Controles: mínimo `10px`.
- [ ] Body necesario: mínimo `12px`.
- [ ] Legal: mínimo `10px` y contraste suficiente.
- [ ] Inglés y español no producen overflow.
- [ ] El zoom al 200% conserva contenido y acciones.

## Layout

- [ ] No hay más de dos cajas anidadas.
- [ ] Los grupos simples usan espacio o divisores antes que cards.
- [ ] Funciona a 320px, 680px, 980px, 1120px y desktop amplio.
- [ ] No existe scroll horizontal accidental.
- [ ] Safe areas consideradas.
- [ ] Los targets mantienen tamaño suficiente en densidad compacta.

## Componentes

- [ ] Anatomía y slots documentados.
- [ ] Default, hover, pressed, focus, loading y disabled.
- [ ] Error y validación cuando aplica.
- [ ] Controlled/uncontrolled documentado.
- [ ] Texto largo, vacío y contenido extremo probados.
- [ ] No existe una variante que solo duplique otro componente.

## Accesibilidad

- [ ] Semántica HTML o nativa correcta.
- [ ] Nombre accesible.
- [ ] Operable por teclado.
- [ ] Focus visible.
- [ ] Contraste WCAG AA.
- [ ] Estado no depende solo del color.
- [ ] Reduced motion.
- [ ] Lectura correcta con screen reader.

## Motion

- [ ] La animación explica estado, jerarquía o profundidad.
- [ ] Usa tokens de duración y easing.
- [ ] No hay más de tres loops visibles.
- [ ] No anima blur grande durante scroll.
- [ ] La interfaz sigue completa sin animación.

## Tema de producto

- [ ] Se reconoce la identidad del producto.
- [ ] Se reconoce la familia Stellaria sin ver el logo.
- [ ] Solo existe un acento dominante.
- [ ] El motivo distintivo se usa con moderación.
- [ ] Se probó junto a otro tema para detectar hardcodes.

## Contenido

- [ ] Beneficio antes que mecanismo.
- [ ] Claims verificables.
- [ ] CTA describe el siguiente paso real.
- [ ] Datos tienen unidad, periodo y contexto.
- [ ] Riesgos y condiciones están visibles.
- [ ] Cookies, privacidad y contenido sensible están descritos con precisión.

## Validación técnica

- [ ] Typecheck.
- [ ] Build de producción.
- [ ] Tests unitarios e interacción.
- [ ] Auditoría automática de accesibilidad.
- [ ] Visual regression.
- [ ] Sin warnings relevantes.
- [ ] Sin cambios accidentales en API pública.

## Criterio de aprobación

Una contribución está aprobada cuando mejora el sistema completo, no solo una captura. Debe ser reusable, tematizable, accesible, documentada y verificable.

