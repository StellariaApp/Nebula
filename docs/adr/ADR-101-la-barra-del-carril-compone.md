# ADR-101 — La barra del carril compone, y sus enlaces son partes

- **Estado**: **aceptada** · 2026-08-05 — a petición del propietario, que trajo la forma ya escrita
  en la story
- **Enmienda**: [ADR-086](ADR-086-el-shell-de-panel-es-un-compound.md), que creó el modo carril con
  `AppShell.Sidebar` y sus ranuras `top` y `bottom`.
- **Rompe**: `top` y `bottom` de `AppShell.Sidebar`, y `AppShell.RailNav`.

## Contexto

ADR-086 dio a `Sidebar` dos ranuras por props —`top` y `bottom`— y dejó el resto en `children`.
Funcionaba mientras la barra fuera «marca arriba, usuario abajo».

Dejó de funcionar en cuanto el contenido creció: grupos de enlaces con rótulo y acción, un bloque de
rol enmarcado, secciones por permiso. Todo eso pasaba por `children` mientras las dos franjas de cromo
seguían siendo props, así que **media barra se componía y la otra media se rellenaba**. Un consumidor
que quisiera tres franjas, o el pie antes del cuerpo, no tenía forma de expresarlo.

El segundo hallazgo lo dio la story: **el rótulo de grupo se repetía tres veces** con el mismo `Text`
en `caption`/`uppercase`/`wide` y la misma regla de desaparecer al encoger. Un patrón copiado tres
veces es un componente que falta.

## Decisión

### Las tres franjas son partes

```tsx
<AppShell.Sidebar collapsed={mini} onCollapse={setMini}>
  <AppShell.Sidebar.Header>{marca}</AppShell.Sidebar.Header>
  <AppShell.Sidebar.Body>
    <AppShell.Links title="Administrador" action={<ActionIcon … />}>
      <AppShell.Link label={<AppShell.RailLabel>Actividad</AppShell.RailLabel>} href="#a" />
    </AppShell.Links>
  </AppShell.Sidebar.Body>
  <AppShell.Sidebar.Footer>{usuario}</AppShell.Sidebar.Footer>
</AppShell.Sidebar>
```

El botón de encoger lo pinta el root y no una ranura: su posicionamiento ya era absoluto respecto al
`aside`, así que meterlo dentro de una franja era arbitrario.

### `Links` y `Link` absorben `RailNav`

`Links` es el grupo —rótulo, ranura de acción y lista— y `Link` el enlace con el `py` del carril por
defecto. `RailNav` desaparece: era solo el contenedor de la lista, sin el rótulo que siempre lo
acompañaba.

El rótulo del grupo se declara `RailLabel`, así que **desaparece al encoger y en la barra móvil** por
la misma regla que el resto de rótulos, sin que el consumidor tenga que recordarlo.

### El precio: el orden deja de estar garantizado

Nada impide poner el pie primero. Es el mismo intercambio que ADR-086 aceptó al dejar de envolver las
ranuras del root, y por el mismo motivo: una barra que solo admite el montaje previsto no sirve para
el montaje siguiente.

## Consecuencias

- Rompe `top`/`bottom` y `RailNav`. Las dos stories del panel migran en el mismo commit.
- `AppShell.md` documenta la composición nueva.
- El sweep de WN pasó `RailLabel` a `label` y `RailNav` a `rail_nav` en la hoja; los símbolos públicos
  del compound conservan su nombre.
- Gates en verde: a11y 86 suites y 594 tests, 1188 tests, contraste 116/116 en 5 temas y `size` sin
  excesos.
