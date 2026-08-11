# ADR-128 — El carril lee su nivel de cristal

- **Estado**: aceptada · 2026-08-11 (decisión del propietario) · **WN** · implementada
- **Cambia API pública**: no añade ni quita nada. `level` ya estaba en `AppShellSidebarProps`;
  **cambia lo que se ve**, porque hasta hoy no hacía nada.
- **Depende de**: [ADR-118](ADR-118-el-cristal-recupera-su-filo-y-el-velo-se-vuelve-opaco.md) (velo y
  filo cambian juntos) · [ADR-101](ADR-101-la-barra-del-carril-compone.md) (las tres franjas son
  partes).

## Contexto

`AppShellSidebarProps` declara `level?: GlassLevel` desde que la barra se volvió parte, y
`AppShell.md` describe el reparto: «las partes usan cristal por capas —`strong` en la cabecera,
`default` en la subbarra y en el pie, **`subtle` en la barra y en el aside**— y un cristal sobre un
plano opaco no se lee».

La implementación nunca lo leyó. `AppShellSidebar` no desestructuraba `level`, así que caía en el
resto de props y **salía al DOM como atributo**: `<aside level="subtle">`. Medido en el sitio de docs
antes del cambio: el `aside` y su contenedor sin fondo ni `backdrop-filter`, y la única superficie del
carril era `sidebar_body` pintando `surface.overlay` **opaco**. Los otros cinco parts —`Nav`, `Aside`,
`Header`, `Footer`, `Subbar`— sí lo leen, cada uno con su defecto.

La consecuencia visible: el `backdrop` del shell —que existe, dice el propio `AppShell.md`, «porque el
cristal necesita fondo»— quedaba tapado justo debajo del carril.

## Decisión

**El contenedor del carril es un `GlassSurface` con el `level` que recibe, y su defecto es `subtle`**,
que es el que el doc ya prometía.

```tsx
<aside className={sidebar}>
  <GlassSurface level={level} r={0} className={sidebar_container}>
    {children}
  </GlassSurface>
</aside>
```

Con eso, dos ajustes que van en el mismo cambio o el material no se ve:

1. **`sidebar_body` deja de pintar `surface.overlay`.** Era el fondo opaco del carril; ahora el fondo
   lo pone el material, y el cuerpo solo aporta maqueta y scroll.
2. **El filo de la barra lee la var de `GlassSurface`** (`GLASS_EDGE`) en vez de `border.default`, que
   es lo que ADR-118 exige para que velo y filo cambien juntos. Es el mismo `fallbackVar` que ya
   usaban `sidebar_header` y `sidebar_footer`.

Las tres franjas **siguen con su propio cristal**. No es cristal anidado del que prohíbe `docs/06` §6:
es el reparto por capas que ADR-101 y `AppShell.md` ya fijaron, y es lo que mantiene legibles las
franjas pegajosas cuando el cuerpo scrollea por debajo.

## Consecuencias

- **Cambia el aspecto de todo carril del catálogo**, no solo el del sitio: playground y la maqueta de
  Rosette pasan de una barra opaca a una traslúcida sobre su `backdrop`. Es lo que el doc describía;
  lo que cambia es que ahora es verdad.
- **La barra inferior de móvil también es cristal**: por debajo de `tablet` el contenedor es la barra
  flotante, así que hereda el material en vez de depender del fondo opaco del cuerpo.
- **Sin coste de tamaño**: `Sidebar.tsx` ya importaba `GlassSurface` para sus dos franjas.
- **Deja de filtrarse `level` al DOM**, que era un atributo desconocido en un `<aside>`.
- Con `effects.glass.enabled=false` el carril degrada a `surface.overlay` sólido por el
  `fallbackSurface` de `GlassSurface` — el mismo camino que el resto de regiones.

## Alternativas descartadas

**Dejar `level` muerto y poner el material desde el consumidor** (`Sidebar.Body bg="transparent"` en
el sitio de docs). Tapa el síntoma en una app y deja la prop mintiendo para las demás, que es peor que
no tenerla.

**Quitar `level` de los tipos.** Es la otra forma de cerrar la contradicción, pero rompe la simetría
de las seis regiones y contradice el reparto por capas que `AppShell.md` documenta.

**Poner el cristal en el `<aside>` y no en el contenedor.** El `aside` es la columna del grid —a veces
de altura cero, en móvil— y el que scrollea y flota es el contenedor. El material tiene que ir donde
está la superficie.
