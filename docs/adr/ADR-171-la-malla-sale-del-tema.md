# ADR-171 — La malla sale del tema

- **Estado**: **aceptada** · 2026-08-17 — decidida por el propietario
- **Cambia API pública**: no. Sólo cambia de dónde salen los colores de `MeshGradientBg`.
- **Cierra**: el caso que [ADR-170](ADR-170-el-tema-publica-sus-degradados.md) §3 dejó abierto.

## Contexto

ADR-170 publicó los degradados del tema y cableó cuatro de los cinco componentes que los usan.
`MeshGradientBg` se quedó fuera, y era el único que aún tardaba en mostrar su color real:

```
radial-gradient(circle at 86% 10%, color-mix(in srgb, #150a5c 52%, transparent) 0%, …)
```

Hex del tema resueltos en JavaScript. El servidor los horneaba con el tema por defecto y el cliente
los recalculaba al adoptar el suyo.

El motivo de dejarlo fuera fue que `MeshCss` compone **cinco radiales en anclas fijas**, y publicar
esa forma sería que el tema aprendiera la composición de un componente concreto — la frontera que
ADR-155 §2 fija.

## Decisión

**La composición sigue siendo del componente; del tema vienen sólo sus dos colores.**

`MeshCss` cicla por las paradas del token (`stops[index % stops.length]`). Medido sobre los 60
degradados del paquete —10 temas × 2 esquemas × 3 roles— **todos tienen exactamente dos paradas**,
así que ciclar es alternar entre la primera y la última: justo lo que ADR-170 publica como `edge` y
`tip`.

Con eso la malla se construye con `color-mix(in srgb, var(--gradient-brand-edge) 52%, transparent)`
y la resuelve el navegador contra la clase activa.

**Un token con otro número de paradas cae a JavaScript**, como todas las demás escotillas. Que hoy
sean dos es un hecho medido, no una garantía del contrato: el schema admite las que quieras.

Esto no contradice el §3 de ADR-170. Allí se descartaba publicar los cinco radiales como si fueran
del tema; aquí las anclas, los alfas y los alcances siguen siendo del componente.

## Alternativas

**Dejarlo en JavaScript.** Es un fondo, y su retraso se nota menos que el de un botón. Se descarta
porque el arreglo cuesta dos funciones y deja el catálogo sin ningún caso pendiente.

**Publicar la malla entera como var del tema.** Cierra el caso sin tocar el componente y cruza la
frontera. Descartado ya en ADR-170 §3.

**Publicar las paradas como lista indexada** (`gradient.brand.stops.0`, `.1`, …). Cubriría cualquier
número. Se descarta por ahora: sería contrato para un caso que no existe en ninguno de los 60. Si
aparece, ésta es la vía.

## Consecuencias

- `MeshGradientBg` deja de ser el único con retraso. **No queda ninguno.**
- Su test afirmaba que el `style` cambia con los tokens del tema. Ahora es el mismo en todos y decide
  la clase: el invariante nuevo es más fuerte y el test lo dice.
- El gate visual es el juez, y pasa 75 de 75 sin recapturar: la malla sale idéntica.
