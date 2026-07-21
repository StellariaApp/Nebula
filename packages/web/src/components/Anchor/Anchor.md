# Anchor

Enlace polimórfico. Por defecto `<a>`, pero admite un adapter de router por la prop `component` (`<Anchor component={NextLink} href="/x">`) — sin dependencia de Next en el core (ADR-018 §2, docs/01 §7).

## Color y subrayado

Por defecto el color es `inherit` (el del texto que lo rodea, siempre validado por contraste) y el subrayado es `always`: el enlace se distingue por el **subrayado**, no solo por el color, cumpliendo WCAG (no depender del color). El consumidor puede teñirlo con `c="primary.600"` y elegir `underline="hover"|"never"`. Foco visible con `border.focus`.

`external` añade `target="_blank"` + `rel="noopener noreferrer"`.
