# ADR-081 — El anillo de gradiente puede orbitar

- **Estado**: **aceptada** · 2026-08-02 — a petición del propietario durante WB
- **Amplía**: el API público de `GradientBorder` (`docs/00-inventory` §1.12). No cambia su
  comportamiento por defecto.
- **No toca**: el catálogo. No entra componente nuevo.

## Contexto

La landing de Rosette monta su maqueta de producto con un marco cuyo borde recorre un arco de luz
(`.product-preview::before`: `conic-gradient(from var(--preview-angle), …)` girando 360° en 5.5 s,
recortado a anillo con `mask-composite`). El propietario pide traerlo a Nebula, y además poder elegir
**qué lados** se encienden y en qué orden.

`GradientBorder` ya tiene toda la maquinaria: el anillo por `mask-composite`, el radio heredado, el
grosor en px y las dos degradaciones (sin `mask-composite` y en `forced-colors`). Un componente nuevo
habría duplicado las cuatro cosas para acabar pintando el mismo anillo.

## Decisión

`GradientBorder` gana tres props, todas apagadas por defecto:

| Prop       | Tipo                            | Por defecto    |
| ---------- | ------------------------------- | -------------- |
| `beam`     | `boolean`                       | `false`        |
| `edges`    | `readonly (1 \| 2 \| 3 \| 4)[]` | los cuatro     |
| `sequence` | `"continuous" \| "spaced"`      | `"continuous"` |

Los lados van en sentido horario desde arriba. El orden de `edges` es irrelevante: la secuencia la
marca el recorrido del marco.

**Con `beam`, el anillo estático pasa de ser el gradiente a ser `border.default`.** Es la decisión de
fondo y no es cosmética: con el anillo entero teñido, el arco deja de leerse como luz que viaja y pasa
a leerse como un neón con halo. El rol `gradient` sigue mandando, pero solo sobre el arco, que va de
transparente a `primary`, a `accent`, a transparente.

**El tiempo de un lado es constante**, `duration.expressive × 3.25` (≈1.37 s), y el ciclo es ese valor
por el número de turnos: `N` en `continuous`, siempre 4 en `spaced`. La alternativa —ciclo fijo
repartido entre los lados— hacía que con dos lados la luz fuera al doble de lento, que se lee como
otro efecto. Con los cuatro lados el ciclo son 5.46 s, que es la órbita de la referencia.

**No se usa `@property`.** vanilla-extract no lo emite y registrarlo desde JS dejaría el primer
pintado sin animar. En su lugar cada lado es una capa sobredimensionada que **gira**, que es
interpolable sin registrar nada, enmascarada al anillo por el contenedor.

## Consecuencias

- **Dos presupuestos de tamaño suben**: `GradientBorder` de 15.5 a 16 kB (medido 15.53) y `useTheme`
  de 28 a 28.5 kB (medido 28.16). El segundo no importa `GradientBorder`: mide desde el barrel, y los
  módulos de vanilla-extract tienen efecto, así que su CSS no se sacude. Se mitigó antes de subirlo
  llevando los dos ejes de la animación a vars en línea en vez de a 16 clases combinadas; eso solo ya
  devolvió `NebulaProvider` por debajo de su límite.
- El reparto en cuadrantes de 90° es exacto en un marco cuadrado; en uno muy apaisado la luz cambia de
  lado cerca del vértice, no en él. Queda documentado en `GradientBorder.md`, no se corrige: hacerlo
  exacto pediría medir la proporción en cliente.
- `prefers-reduced-motion`, `motion.tier: "minimal"` y `edges={[]}` dejan el marco estático con su
  anillo de siempre.
- La `Portada` de `Patterns/Landing` pasa a envolver su `Paper` de cristal con el marco, que es el
  caso que motivó la petición.
