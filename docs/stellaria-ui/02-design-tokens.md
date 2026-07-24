# 02. Tokens de diseño

## Modelo de tokens

La librería debe separar tres niveles:

1. **Primitivos:** valores físicos como colores, espacios y radios.
2. **Semánticos:** intención como `surface.default`, `text.muted` o `action.primary`.
3. **Componente:** decisiones locales como `button.primary.background`.

Los componentes solo consumen tokens semánticos o de componente. Los primitivos no deben aparecer directamente en componentes de producto.

## Color base oscuro

| Token | Valor | Uso |
| --- | --- | --- |
| `color.bg.canvas` | `#07080D` | Fondo principal |
| `color.bg.surface` | `#10121A` | Cards y paneles |
| `color.bg.surfaceStrong` | `#151823` | Inputs, paneles elevados |
| `color.bg.overlay` | `rgba(7,8,13,.84)` | Headers y overlays con blur |
| `color.text.primary` | `#F7F6FB` | Titulares y datos clave |
| `color.text.secondary` | `#B7BAC4` | Lead y copy relevante |
| `color.text.muted` | `#9B9FAC` | Texto auxiliar |
| `color.text.subtle` | `#727682` | Metadata no crítica |
| `color.border.default` | `rgba(255,255,255,.09)` | Bordes estándar |
| `color.border.strong` | `rgba(255,255,255,.12)` | Superficie activa o elevada |

## Color base claro

La librería debe contemplarlo aunque Rosette use principalmente dark mode.

| Token | Valor recomendado |
| --- | --- |
| `color.bg.canvas` | `#F7F9FC` |
| `color.bg.surface` | `#FFFFFF` |
| `color.bg.surfaceStrong` | `#F0F3F8` |
| `color.text.primary` | `#0B0D12` |
| `color.text.secondary` | `#343A46` |
| `color.text.muted` | `#5F6673` |
| `color.text.subtle` | `#7A8290` |
| `color.border.default` | `rgba(11,13,18,.10)` |
| `color.border.strong` | `rgba(11,13,18,.16)` |

## Acentos compartidos

| Token | Valor | Rol |
| --- | --- | --- |
| `color.system.blue` | `#5A8FFF` | Infraestructura e información |
| `color.system.cyan` | `#51DBE5` | Acción secundaria y conectividad |
| `color.state.success` | `#61D8AC` | Correcto, activo, ahorro |
| `color.state.warning` | `#F5B84B` | Atención no destructiva |
| `color.state.danger` | `#EF5D6F` | Error o riesgo |
| `color.state.info` | `#5A8FFF` | Información |

Los valores históricos `#4F8EDB` y `#42FFFF` pueden mantenerse como alias de migración, pero las nuevas implementaciones deben usar los tokens operativos anteriores.

## Tema de producto

Todo producto declara al menos:

```json
{
  "brand": {
    "primary": "#F43F5E",
    "bright": "#FB7185",
    "onPrimary": "#FFFFFF",
    "gradientAngle": "100deg",
    "glowOpacity": 0.16
  }
}
```

Derivados obligatorios:

- `brand.soft`: primario entre 7% y 12% de opacidad.
- `brand.border`: luminoso entre 16% y 24% de opacidad.
- `brand.glow`: primario entre 12% y 20% de opacidad.
- `brand.gradient`: `primary → bright`.
- `brand.focus`: luminoso con contraste suficiente sobre canvas.

No se debe elegir manualmente un rosa distinto para cada componente. Todos los estados de producto derivan del tema.

## Tema Rosette de referencia

```css
[data-product="rosette"] {
  --brand-primary: #F43F5E;
  --brand-bright: #FB7185;
  --brand-on-primary: #FFFFFF;
  --brand-soft: rgba(244, 63, 94, .10);
  --brand-border: rgba(251, 113, 133, .20);
  --brand-glow: rgba(244, 63, 94, .16);
  --brand-gradient: linear-gradient(100deg, #F43F5E, #FB7185);
}
```

## Espaciado

Escala canónica en píxeles: `2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 36, 48, 64, 80, 96, 120`.

Roles recomendados:

| Token | Valor |
| --- | --- |
| `space.inline.xs` | `6` |
| `space.inline.sm` | `8` |
| `space.inline.md` | `12` |
| `space.inline.lg` | `16` |
| `space.stack.xs` | `8` |
| `space.stack.sm` | `12` |
| `space.stack.md` | `20` |
| `space.stack.lg` | `28` |
| `space.section.compact` | `90` |
| `space.section.default` | `120` |

## Radios

| Token | Valor | Uso |
| --- | --- | --- |
| `radius.xs` | `6px` | Controles mini |
| `radius.sm` | `8px` | Botones compactos |
| `radius.md` | `12px` | Inputs y chips grandes |
| `radius.lg` | `18px` | Cards |
| `radius.xl` | `22px` | Preview y panel editorial |
| `radius.2xl` | `28px` | CTA y bloques protagonistas |
| `radius.full` | `999px` | Pills y navegación segmentada |

## Bordes y blur

- Borde normal: `1px solid color.border.default`.
- Borde elevado: `1px solid color.border.strong`.
- Borde de producto: `1px solid brand.border`.
- Blur compacto: `18px`.
- Blur premium: `22–24px` con saturación máxima de `145%`.
- Evitar blur en listas grandes o superficies que se desplazan continuamente.

## Sombras

```css
--shadow-card: 0 24px 60px rgba(0,0,0,.24);
--shadow-panel: 0 35px 100px rgba(0,0,0,.30);
--shadow-floating: 0 18px 55px rgba(0,0,0,.38);
--shadow-inset-highlight: inset 0 1px 0 rgba(255,255,255,.04);
```

Una superficie puede usar una sombra de profundidad y un highlight interno. No combinar múltiples sombras coloreadas salvo en el elemento protagonista.

## Z-index

| Token | Valor |
| --- | --- |
| `z.background` | `0` |
| `z.content` | `2` |
| `z.sticky` | `40` |
| `z.floatingControl` | `60` |
| `z.notice` | `70` |
| `z.header` | `100` |
| `z.modal` | `200` |
| `z.toast` | `300` |

## Tokens que nunca deben ser de producto

- Colores de éxito, advertencia, error e información.
- Espaciado base.
- Breakpoints.
- Focus ring.
- Tipografía funcional.
- Duraciones y easing.
- Orden de capas.

