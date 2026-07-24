# Registro de overlays

Capa mínima de Jotai que cubre **solo** lo que React Aria no hace: abrir o cerrar un overlay por id desde cualquier punto del árbol, sin prop-drilling (la consecuencia declarada en ADR-010 y acotada en ADR-025).

## Lo que aquí NO se implementa

- **Apilado y `Esc`**: `useOverlay` de React Aria mantiene su propia lista `visibleOverlays` y entrega `Esc` y el click-outside únicamente al overlay del tope. Duplicarlo en un atom crearía una segunda fuente de verdad.
- **Scroll-lock**: lo resuelve `usePreventScroll` (incluidas las particularidades de iOS), que `useModalOverlay` ya invoca.

## Uso

```tsx
const drawer = useOverlayState("filters");
<Button onPress={drawer.open}>Filtros</Button>
<Drawer opened={drawer.isOpen} onClose={drawer.close}>…</Drawer>;

nebulaOverlays.open("filters");
```

El store es el default de Jotai (global de la app, que es la semántica correcta para un registro por id). Los componentes no dependen de él: `opened`/`onClose` siguen siendo props normales, y el registro es opcional.
