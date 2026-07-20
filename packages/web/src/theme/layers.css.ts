import { layer } from "@vanilla-extract/css";

/**
 * Capa de estilos BASE de los componentes (ADR-018).
 *
 * Las reglas dentro de una `@layer` pierden siempre frente a las que están fuera
 * de capas, sin importar especificidad ni orden. Poniendo aquí los estilos base
 * de cada componente garantizamos que las style props del consumidor
 * (`c="text.onPrimary"`, `p="md"`…), que sprinkles emite SIN capa, siempre ganen.
 *
 * Sin esto, la clase base de un componente pisa silenciosamente sus propias style
 * props — un bug que el gate axe detectó en Text (texto ilegible sobre superficie
 * de color porque el `color` base machacaba el rol pedido por el consumidor).
 */
export const baseLayer = layer("nebula.base");
