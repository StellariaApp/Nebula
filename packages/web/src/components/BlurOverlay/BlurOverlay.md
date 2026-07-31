# BlurOverlay

## Por qué existe si `Overlay` ya tiene `blur`

Son dos intenciones distintas y la diferencia está en qué pasa cuando el efecto no se puede aplicar:

- **`Overlay`** es tinte primero. El `blur` es un adorno del velo; si el navegador no soporta
  `backdrop-filter`, el velo teñido sigue haciendo su trabajo y no hay nada que degradar.
- **`BlurOverlay`** es desenfoque primero. Su trabajo es **hacer ilegible** lo de detrás —contenido
  bajo licencia, un dato pendiente de desbloquear, una preview de pago— con un velo mínimo (0.35) que
  deja intuir la forma. Si el desenfoque no se aplica, el velo translúcido no oculta nada y el
  componente incumple su contrato **en silencio**.

Por eso su degradación no es "quitar el blur", sino **cerrar el velo**: cuando `effects.glass.enabled`
es `false` (sober), cuando `blur="none"` o cuando `@supports` detecta que no hay `backdrop-filter`, la
opacidad del velo sube a 0.94 y la capa pasa a ser un scrim casi opaco. `data-blur="off"` deja la rama
observable.

## Lo que no puede hacer por ti

Desenfocar no es ocultar para un lector de pantalla. El texto de detrás sigue en el árbol de
accesibilidad y sigue siendo seleccionable y tabulable. Si el objetivo es un gate real, el consumidor
marca la región de detrás con `inert`:

```tsx
<div style={{ position: "relative" }}>
  <section inert={locked ? "" : undefined}>{preview}</section>
  {locked ? <BlurOverlay center>{unlockCta}</BlurOverlay> : null}
</div>
```

El componente no lo hace por su cuenta porque no es dueño de esa región: se monta como hermano, no
como padre.

## El velo siempre se renderiza

`Overlay` solo pinta su `veil` cuando hay contenido (sin contenido, la propia raíz es el velo). Aquí la
raíz lleva el `backdrop-filter`, que actúa sobre lo de detrás y **no** puede llevar además el fondo del
velo: un fondo opaco sobre el mismo elemento taparía el resultado del filtro. Velo y filtro tienen que
ser dos capas, con o sin contenido.
