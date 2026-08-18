# ADR-170 — El tema publica sus degradados, no solo sus variantes

- **Estado**: **aceptada** · 2026-08-17 — decidida por el propietario
- **Cambia API pública**: sí, y **solo ensancha**. El contrato CSS gana `vars.gradient`.
- **Continúa**: [ADR-150](ADR-150-las-variantes-se-resuelven-una-vez-por-tema.md), cuyo cableado
  dejó fuera este caso.

## Contexto

Cableada la matriz de variantes en los 26 componentes, quedó un síntoma a la vista: en la landing,
con el tema `sun` activo, el botón salía amarillo al instante mientras **«Zero forks.» seguía
violeta** y el borde del bloque de código también. Los dos son degradados de la marca de `nebula`.

La causa es que el contrato publica muchas cosas y **los degradados no**:

```
vars → variant, color, font, radius, space, size, motion, blur, shadow, glass, zIndex
```

Así que `ResolveGradient(role, theme)` construye la cadena CSS en JavaScript desde
`theme.effects.gradients[role]`, y no hay ninguna `var()` a la que apuntar. Cinco componentes
dependen de eso: `GradientText`, `GradientBorder`, `AnimatedGradient`, `GradientBackground` y
`MeshGradientBg`.

La matriz sí publica `--variant-gradient-primary-background`, que **es** el degradado de marca — pero
sólo por la puerta de la variante. Quien pide el rol directamente se queda fuera.

## Decisión

### 1. Cada rol publica tres valores

```
vars.gradient.brand.image   → linear-gradient(135deg, #5e63f8 0%, #9e4fdf 100%)
vars.gradient.brand.edge    → el color del primer stop
vars.gradient.brand.tip     → el color del último
```

Por los tres roles del contrato —`brand`, `accent`, `surface`— son **nueve variables**. Son
exactamente las tres formas que los resolvedores producen hoy: `ResolveGradient` da la imagen,
`ResolveGradientEdge` el primer stop y `ResolveGradientTip` el último.

### 2. Los componentes referencian cuando el degradado es un rol

Un degradado escrito en la prop —`gradient={{ from, to }}`— sigue resolviéndose en JavaScript: es el
caso infinito que ADR-150 §3 ya declara y que la matriz tampoco cubre.

### 3. `MeshGradientBg` se queda fuera, a propósito

Compone **cinco radiales en anclas fijas** a partir del token. Publicar esa forma sería que el tema
aprendiera la composición de un componente concreto, que es justo la frontera que ADR-155 §2 fija.
Sigue resolviendo en JavaScript y sigue teniendo el retraso; queda escrito aquí en vez de callado.

## Alternativas

**Que los componentes lean la matriz de variantes.** `--variant-gradient-primary-background` ya
contiene el degradado de marca. Se descarta porque ata `GradientText` a la variante `gradient` de la
escala `primary`, que es una coincidencia y no una relación: pedir `gradient="accent"` no tendría
dónde ir.

**Publicar el token entero como JSON en una var.** Una sola variable por rol en vez de tres. Se
descarta porque CSS no sabe leerlo: haría falta JavaScript para partirlo, que es lo que se está
quitando.

## Consecuencias

- Nueve variables más por tema, sobre 627. El CSS por tema no cambia de forma apreciable.
- **`MeshGradientBg` sigue con el retraso.** Es el único que queda.
- Los degradados por prop siguen costando hidratación, como ADR-150 §3 documenta.
