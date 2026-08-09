import type { ComponentType } from "react";

export interface Demo {
  /** Estable y único dentro del componente: es la clave con la que el sitio traduce y enlaza. */
  id: string;
  /** El componente de la demo. Sin props, por contrato (ADR-115). */
  render: ComponentType;
  /**
   * Ruta del archivo relativa a `src/`. Es lo que el sitio lee como texto para enseñar el código
   * que de verdad ejecuta, así que tiene que apuntar al mismo archivo que `render`.
   */
  source: string;
  /** Texto de origen. El sitio lo traduce por `demo.<componente>.<id>.title` y cae aquí si no hay. */
  title: string;
  description: string;
}

export interface DemoFamily {
  /** El componente del catálogo al que pertenecen, tal y como lo exporta el barrel. */
  component: string;
  demos: readonly Demo[];
}
