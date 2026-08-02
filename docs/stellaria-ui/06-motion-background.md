# 06. Movimiento y fondo Stellaria

## Principio

El movimiento comunica profundidad, continuidad o cambio de estado. Debe sentirse calmado y preciso. Una interfaz Stellaria no permanece muerta, pero tampoco exige atención constante.

## Tokens de motion

| Token            | Duración    | Uso                          |
| ---------------- | ----------- | ---------------------------- |
| `motion.instant` | `100ms`     | Feedback inmediato           |
| `motion.fast`    | `160–220ms` | Hover, pressed, tooltip      |
| `motion.normal`  | `300–350ms` | Card y panel                 |
| `motion.slow`    | `480ms`     | Indicador y cambio de layout |
| `motion.reveal`  | `800ms`     | Entrada de sección           |

Easing:

```css
--ease-standard: cubic-bezier(0.2, 0, 0, 1);
--ease-expressive: cubic-bezier(0.22, 1, 0.36, 1);
```

## Reveal

- Estado inicial: `opacity: 0`, `translateY(24–34px)`.
- Estado visible: `opacity: 1`, `translateY(0)`.
- Duración: `800ms`.
- Threshold recomendado: `0.12`.
- Ejecutar una vez, salvo que el patrón represente estado recurrente.
- Stagger: `60–100ms`, máximo ocho elementos.

## Hover

- Card interactiva: lift máximo `7px`.
- Botón: lift máximo `2px`.
- Icono destacado: rotación máxima `5deg` y escala `1.06`.
- El borde y la sombra pueden intensificarse; evitar cambiar múltiples propiedades sin necesidad.

## Fondo de la casa

### Grid

- Celda desktop: `56×56px`.
- Celda mobile: `44×44px`.
- Línea: blanco al `5.2%` en dark.
- Máscara radial con mayor visibilidad cerca del primer tercio superior.
- Opacidad de referencia: `.88` en dark.
- Movimiento parallax máximo: `scrollY × .018`.

### Estrellas

- Tamaño: `1–2px`.
- Distribución irregular y escasa.
- Estrella neutral: azul-gris suave.
- Una de cada cinco puede usar el color luminoso del producto.
- Twinkle: `4.2s ease-in-out infinite` con delays variados.
- Parallax máximo: `scrollY × .045`.

### Ambient glows

- Tamaño: `430–500px` en landing.
- Blur: `100–120px`.
- Opacidad: `.10–.16`.
- Máximo dos glows ambientales principales por página.
- Uno puede usar el producto y otro el azul del sistema.

## Movimiento distintivo por producto

Cada producto puede declarar un gesto propio, por ejemplo:

- Rosette: borde orbital rosa.
- Lagrange: trazo o pulso direccional.
- Orion: flujo de nodos.

Solo un gesto distintivo puede estar activo como protagonista en el viewport.

## Preview flotante

- Desktop: perspectiva ligera, rotación Y de `2–4deg` y desplazamiento vertical máximo `9px`.
- Ciclo: `7s ease-in-out infinite`.
- Mobile: solo `translateY`, máximo `7px`.
- Nunca aplicar perspectiva a contenido que el usuario debe operar.

## Movimiento de estado

- Dot activo: pulso cada `2.4s`.
- Conversación activa: borde interno sutil cada `3.2s`.
- Cambio de precio: fade y `translateY(7px)` durante `250ms`.
- Indicador de navegación: posición `480ms`, ancho `380ms`.

## Rendimiento

- Animar preferentemente `transform`, `opacity` y filtros moderados.
- Parallax dentro de `requestAnimationFrame` y listeners pasivos.
- Desconectar observers después del reveal.
- No animar blur grande en scroll.
- Evitar más de tres loops infinitos claramente visibles.

## Reduced motion

Con `prefers-reduced-motion: reduce`:

- Revelar contenido inmediatamente.
- Desactivar estrellas, ambient drift, preview float, pulsos y bordes orbitales.
- Mantener cambios de estado instantáneos o casi instantáneos.
- Nunca ocultar información porque una animación fue desactivada.
