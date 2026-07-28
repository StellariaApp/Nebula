# ADR-029 — Escala de padding de `Card` alineada con el lenguaje visual

- **Estado**: aceptada · 2026-07-27 (decisión del propietario en el checkpoint de convergencia visual)
- **Contexto**: `docs/06-visual-language.md` §3 asigna a las cards `md` compacto, `lg` default y `xl`
  prominente, y prohíbe mezclar los tres dentro de una misma colección. `Card` se implementó en W2.5
  con `none | sm | md | lg` y default `md`, es decir, una escala desplazada un peldaño: su default era
  lo que el lenguaje visual llama «compacto» y no existía el peldaño prominente. `sm` (8 px) quedaba
  por debajo del rango que `docs/06` asigna a una card.

  La auditoría de convergencia encontró además un defecto asociado: `sectionInset` restaba
  `-space.md` **fijo**, de modo que el sangrado de `Card.Section` solo era correcto con `padding="md"`.
  Con `padding="lg"` una imagen de sección dejaba 8 px de aire a cada lado.

## Decisión

1. `CardProps["padding"]` pasa a `"none" | "md" | "lg" | "xl"` y su default a **`lg`**.
2. Se retira `sm`. Para agrupaciones más densas que `md`, `docs/06` §5 pide resolver con espacio o
   divisor antes que con una card.
3. El valor del padding se publica en una var local (`Card.vars.css.ts`, `pad`) y `sectionInset`
   consume `calc(pad * -1)`. El sangrado pasa a derivarse del padding real en lugar de asumir `md`.
4. `Card` interactiva refuerza el hover con `border.strong` además del lift de 2 px por spring, ambos
   anulables por `prefers-reduced-motion` y por `motion.tier: "minimal"`.

## Alternativas

- **Solo corregir el defecto de `sectionInset`**: rechazada. Deja `docs/06` §3 como intención no
  implementada justo en el componente que más la ejercita.
- **Añadir `xl` sin mover el default**: rechazada. Aditivo y menos disruptivo, pero conserva como
  default el peldaño que el lenguaje visual llama compacto.
- **Conservar `sm` como alias de `md`**: rechazada. Un peldaño que miente sobre su valor es peor que su
  ausencia en una librería aún sin publicar.

## Consecuencias

- **Cambio incompatible de API**: `padding="sm"` deja de compilar. Los paquetes están `private: true` y
  no hay consumidores externos; no había usos de `padding="sm"` en el repositorio.
- Las cards con default cambian de 16 a 24 px de padding: las composiciones existentes ganan aire.
- Queda documentado en `Card.md` junto al módulo, según ADR-019.
