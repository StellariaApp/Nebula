import type { GradientToken } from "@stellaria/nebula-tokens";

interface MeshLayer {
  x: number;
  y: number;
  alpha: number;
  reach: number;
}

const MESH_LAYERS: readonly MeshLayer[] = [
  { x: 14, y: 16, alpha: 72, reach: 56 },
  { x: 86, y: 10, alpha: 60, reach: 52 },
  { x: 20, y: 84, alpha: 52, reach: 58 },
  { x: 82, y: 78, alpha: 46, reach: 50 },
  { x: 50, y: 46, alpha: 38, reach: 62 },
];

export function WithAlpha(color: string, percent: number): string {
  return `color-mix(in srgb, ${color} ${String(percent)}%, transparent)`;
}

export function MeshCss(token: GradientToken): string {
  const stops = token.stops;
  if (stops.length === 0) return "none";

  return MESH_LAYERS.map((layer, index) => {
    const stop = stops[index % stops.length];
    if (stop === undefined) return "";
    const tint = WithAlpha(stop.color, layer.alpha);
    return `radial-gradient(circle at ${String(layer.x)}% ${String(layer.y)}%, ${tint} 0%, transparent ${String(layer.reach)}%)`;
  })
    .filter((layer) => layer !== "")
    .join(", ");
}

export function MeshBase(token: GradientToken): string {
  const last = token.stops.at(-1);
  return last === undefined ? "transparent" : WithAlpha(last.color, 24);
}

/**
 * La misma malla, pero con los dos colores que el tema publica en vez de los hex del token
 * (ADR-171).
 *
 * `MeshCss` cicla por las paradas, y los 60 degradados del paquete tienen exactamente dos, asi que
 * ciclar es alternar entre la primera y la ultima — `edge` y `tip` de ADR-170. Con eso la malla la
 * resuelve el navegador contra la clase activa y deja de repintarse al adoptar el tema.
 *
 * La composicion sigue siendo del componente: del tema solo vienen sus dos colores.
 */
export function MeshCssFromRefs(edge: string, tip: string): string {
  return MESH_LAYERS.map((layer, index) => {
    const tint = WithAlpha(index % 2 === 0 ? edge : tip, layer.alpha);
    return `radial-gradient(circle at ${String(layer.x)}% ${String(layer.y)}%, ${tint} 0%, transparent ${String(layer.reach)}%)`;
  }).join(", ");
}

export function MeshBaseFromRef(tip: string): string {
  return WithAlpha(tip, 24);
}
