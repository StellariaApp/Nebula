# ADR-014 — Política de dependencias externas

- **Estado**: aceptada · 2026-07-14
- **Contexto**: pilar de performance y de venta: el consumidor que importa `Button` no debe pagar por charts/dnd/editor; toda dependencia es deuda de mantenimiento y de licencia.
- **Decisión** (reglas):
  1. `@stellaria/nebula-tokens`: **cero dependencias**. `@stellaria/nebula-hooks`: solo React (+ Jotai si un hook lo exige — revisar caso a caso).
  2. Toda dependencia de runtime del core requiere fila en la tabla de 01 §8 (justificación + alternativa evaluada + coste de bundle).
  3. Las dependencias pesadas se aíslan en **subpath exports** (`@stellaria/nebula-web/charts`, `/dnd`, `/editor`, `/datagrid`, `/command`, `/carousel`) que no se cargan desde el entry principal.
  4. Integraciones con librerías del consumidor (form-atoms, Pintura, react-navigation) = **peers opcionales** + contratos duck-typed/adapters; nunca dependencias directas.
  5. Prohibido: dependencias con licencia no-OSS en core (Pintura solo como peer del consumidor, C1-Q6); dependencias sin tipos; kits visuales completos (Mantine, MUI…).
  6. Toda dependencia nueva post-scaffold requiere mini-ADR.
- **Consecuencias**: bundle budgets de 03 §3 verificables por entry; el árbol de deps es argumento de venta (auditable por clientes enterprise).
