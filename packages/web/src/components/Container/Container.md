# Container

Centra contenido con un ancho máximo y padding horizontal. `size` acepta las claves `xs–xl` (anchos de contenido propios del componente, NO breakpoints ni tallas de control) o un valor libre; `fluid` lo lleva al 100%.

Los anchos `SIZE_WIDTH` son constantes de layout locales (no colores ni tokens de tema), por lo que viven en el módulo. El `max-width` se publica como var local (`--container-size`) y el estilo base va en `primitive_layer` para que cualquier style prop del consumidor (p. ej. `maw`) lo pueda pisar: las sprinkles viven en `util_layer`, la última (ADR-142).
