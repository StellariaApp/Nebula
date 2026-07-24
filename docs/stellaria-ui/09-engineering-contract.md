# 09. Contrato técnico de la librería UI

## Objetivo

La futura librería debe permitir construir interfaces Stellaria para web y, cuando aplique, React Native sin copiar estilos entre productos. Esta especificación describe arquitectura, no obliga a una herramienta de styling concreta.

## Capas recomendadas

```text
@stellaria/tokens          Primitivos, semánticos, temas y tipos
@stellaria/icons           Iconografía compartida
@stellaria/motion          Duraciones, easing y utilidades
@stellaria/react           Componentes web
@stellaria/react-native    Componentes nativos
@stellaria/themes          Temas Stellaria y productos
@stellaria/patterns        Composiciones opcionales de alto nivel
```

Si la librería vive en un solo paquete inicialmente, conservar estas fronteras internas.

## Source of truth

Definir tokens en una estructura agnóstica de plataforma. Generar o adaptar:

- CSS custom properties para web.
- Objetos TypeScript para React.
- Objetos serializables para React Native.
- Variables para herramientas de diseño si se integran después.

No mantener valores duplicados manualmente en CSS, TypeScript y archivos de tema.

## Esquema mínimo de tema

```ts
type ProductTheme = {
  id: string;
  name: string;
  colorScheme: "light" | "dark" | "both";
  brand: {
    primary: string;
    bright: string;
    onPrimary: string;
    gradientAngle: string;
    glowOpacity: number;
  };
  assets?: {
    logo?: string;
    mark?: string;
  };
  motion?: {
    signature?: "orbit" | "pulse" | "flow" | "none";
  };
};
```

El tema no puede redefinir spacing, breakpoints, focus, success, warning, danger o z-index.

## API de componentes

- Props semánticas: `variant="primary"`, no `pink`.
- Tamaños consistentes: `sm`, `md`, `lg`.
- Soportar `className`/`style` para layout externo, sin depender de ellos para estados esenciales.
- Slots explícitos para extensibilidad.
- `ref` expuesto cuando el elemento subyacente lo justifica.
- Controlled y uncontrolled solo cuando el patrón lo requiere.
- Eventos y nombres consistentes entre componentes.
- No filtrar props inválidas al DOM.

## Variantes antes que forks

Crear un componente nuevo solo si cambia al menos uno:

- Semántica.
- Interacción.
- Estructura accesible.
- Modelo de estado.

Si solo cambia color, padding o énfasis, crear token, variante o tema.

## Web y React Native

Compartir:

- Tokens.
- Nombres de variantes.
- Modelo de estados.
- Semántica de intención.
- Tests de lógica cuando sea posible.

Adaptar por plataforma:

- Focus y hover.
- Roles/accessibility props.
- Gestos.
- Blur y sombras.
- Portals, modals y safe areas.
- Tipografía y renderizado.

No forzar una implementación idéntica si perjudica la plataforma.

## Componentes fundacionales prioritarios

1. ThemeProvider.
2. Box / Stack / Inline.
3. Text / Heading / MonoLabel.
4. Button / IconButton.
5. Link.
6. Surface / Card.
7. Badge / Chip / Status.
8. Input / TextArea / Select.
9. Checkbox / Radio / Switch.
10. SegmentedControl.
11. Slider.
12. Modal / Drawer / Popover / Tooltip.
13. Toast / Alert / Notice.
14. Tabs / NavigationIndicator.
15. Skeleton / EmptyState / ErrorState.

Después: Header, ProductPreview, FeatureCard, PricingConfigurator y patrones de landing.

## Documentación de cada componente

Cada componente debe incluir:

- Descripción y casos de uso.
- Cuándo no usarlo.
- Anatomía.
- API.
- Variantes y tamaños.
- Estados.
- Ejemplos light/dark y de al menos dos productos.
- Teclado y accesibilidad.
- Responsive.
- Tokens usados.
- Casos límite.
- Cambios incompatibles conocidos.

## Storybook o catálogo equivalente

Matriz mínima:

- Default.
- Todas las variantes.
- Todos los tamaños.
- Loading/disabled/error.
- Texto corto y largo.
- Español e inglés.
- Light y dark.
- Stellaria y dos temas de producto.
- Mobile y desktop.
- Reduced motion.

## Testing

- Unit tests para estado y formateo.
- Interaction tests para teclado y focus.
- Accessibility tests automatizados.
- Visual regression de componentes estables.
- Tests de contraste para combinaciones del tema.
- SSR/hydration en componentes web aplicables.
- Safe area y font scaling en React Native.

## Versionado

- SemVer.
- Cambios visuales que alteran layout pueden ser breaking aunque la API compile.
- Publicar notas de migración con before/after.
- Deprecar antes de eliminar.
- Los temas se versionan junto con tokens compatibles.

## Rendimiento

- Tree-shaking.
- Evitar dependencias de motion en componentes que no animan.
- No cargar fuentes desde cada componente.
- Iconos importables individualmente.
- Reducir re-renders por contexto de tema.
- Evitar blur y filtros costosos en listas extensas.

## Criterio de finalización

Un componente no está terminado si solo “se ve bien”. Debe tener contrato, estados, accesibilidad, tema, responsive, documentación y pruebas.

