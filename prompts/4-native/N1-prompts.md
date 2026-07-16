# Prompts N1 — Native: theming + migración Stellaria + Tier 1

> 4 prompts secuenciales. Requiere **W5 cerrado** (web publicada) — arranca la etapa native. El código semilla es `Stellaria-Frontend/src/ui/native` (39 componentes de calidad verificada).

**Bloque común — inclúyelo al inicio de CADA prompt de esta fase:**

```
Trabajas en C:\Users\Skr13\Documents\GitHub\Nebula (etapa native; la web ya está publicada).
LEE ANTES: docs\04-migration-map.md §2 (mapa archivo-por-archivo — tu guía principal),
docs\api\stellaria-native.md (estado/calidad del código fuente), docs\01-architecture.md §4 (anatomía
native: Collector + CreateAnimated + Unistyles + Jotai stores), docs\03 §1-§2 (contrato a11y native y
motion), docs\00-inventory.md §1 (alcance por componente).
CÓDIGO FUENTE: C:\Users\Skr13\Documents\GitHub\Stellaria-Frontend\src\ui\native\src\
REGLAS: los types compartidos ya existen (nebula-tokens) — los componentes WN native implementan el
MISMO contrato que su par web publicado (paridad de API es gate); testing contract por componente
(Jest+RNTL — valida el supuesto #7 del roadmap al montar el runner); props a11y obligatorias;
ReduceMotion.System en toda animación; stories CSF reutilizadas de web donde la API es unificada.
Política de preguntas del propietario. GATE por prompt: turbo build/typecheck/lint/test verdes.
```

---

## Prompt N1.1 — Runtime de theming native + playground native

```
[BLOQUE COMÚN]

MISIÓN:
1. packages/native: NebulaProvider sobre Unistyles 3 (StyleSheet.configure con los MISMOS temas JSON
   de @stellaria/nebula-themes; updateTheme para temas dinámicos vía loadTheme; adaptiveThemes;
   storage de persistencia INYECTABLE con MMKV solo como ejemplo documentado — supuesto #10).
2. packages/hooks: useTheme unificado (misma API que web — docs\02 §4); verifica que los hooks de W1.2
   (useDebounce/useDisclosure/useUncontrolled) funcionan en RN sin cambios.
3. Migrar infraestructura de Stellaria (04 §2): CreateAnimated (utils/animated.ts con sus 4 any de
   frontera documentados), utils/styles.ts, triggerHaptic.
4. apps/playground-native: Expo SDK 57 + @storybook/react-native 10.5, decorator NebulaProvider,
   selector de tema/scheme/reduced-motion on-device. Si SB-RN 10 falla en algo esencial, aplica el
   fallback del riesgo #7 (catálogo Expo propio con las mismas stories CSF) y documéntalo.
5. Piloto: Box/Text/Button native (migrados de Stellaria en el prompt siguiente NO — aquí solo un
   smoke con StyleSheet directo para validar el runtime de temas).

ACEPTACIÓN: cambiar tema en el playground native re-estiliza sin re-render masivo (Unistyles C++);
los 4 temas oficiales + un JSON dinámico cargan idénticos a web.
REPORTE: veredicto de SB-RN 10 (¿sirvió o fallback?) + veredicto Jest/Vitest para native (supuesto #7).
```

## Prompt N1.2 — Migración Stellaria lote 1: Layout + Typography (24 componentes)

```
[BLOQUE COMÚN]

MISIÓN — migrar "tal cual" (solo naming/tokens/tests — tabla 04 §2):
Layout (15): AspectRatio, Box, Center, Column, Container, Divider, Flex, Grid (+Col/Simple, store
Jotai), Group (store Jotai), Paper (shadowMap iOS/Android), Pressable, Row, SafeArea, Scroll, Space.
Typography (8): Anchor, Blockquote, Code (evalúa refractor como subpath por peso — pregunta si
excede budget), Highlight, List (store Jotai), Mark, Text (+TextGlass/TextGradient), Title.
+ Header (Layout) NO se migra aquí — va en N1.3 porque se divide (FormField/TopBar).
Cada componente: adaptar imports a nebula-tokens (roles semánticos — los colores cambiaron a 50-950),
auditar su Collector contra los Keys* nuevos, añadir testing contract + stories + props a11y donde
falten (docs\api\stellaria-native.md documenta qué tiene a11y y qué no).

ACEPTACIÓN: 23 componentes en verde con paridad de contrato contra su par web (donde exista).
REPORTE: tabla origen→destino→cambios; divergencias de API encontradas contra el par web.
```

## Prompt N1.3 — Migración Stellaria lote 2: Actions + Inputs + Feedback (refactors)

```
[BLOQUE COMÚN]
LEE ADEMÁS los bugs documentados: docs\04-migration-map.md §2 tabla de refactors.

MISIÓN — migrar con refactor obligatorio:
1. Actions: Button (+Group/useRipple/useButtonPressable/variants — alinear variantes al variantMap
   temable), Action→**ActionIcon** (rename), ButtonClose, ButtonCopy, ButtonFloating.
2. Inputs: TextInput y Textarea (**añadir contrato a11y completo** — gap crítico: accessibilityLabel
   vinculado a FormField, accessibilityValue, error live-region; y **fix dark mode de Textarea**),
   Checkbox, Switch, PasswordInput, SegmentedControl (alinear con FormField+NebulaField),
   Chip (+**fix ChipGroup sin selección**).
3. **Split del Header de Stellaria**: parte field → **FormField** native (paridad con el FormField web
   de W2.3, integración NebulaField); parte screen → **Header/TopBar** (BackButton/StatusError +
   animated-on-scroll).
4. Feedback: Loader (Circular/Dot/Dots).
5. ThemeSwitch se migra en N3 (micro-interactions) — NO aquí.

ACEPTACIÓN: los fixes verificados por tests específicos (dark mode, ChipGroup, a11y de inputs);
paridad de contratos con web.
REPORTE: evidencia de cada fix + formulario demo con form-atoms en el playground native.
```

## Prompt N1.4 — Tier 1 native restante + lint de paridad + cierre

```
[BLOQUE COMÚN]
LEE ADEMÁS: docs\api\fonicredito-components.md §6 (el Sheet de FC es la MEJOR base existente de
BottomSheet: sheetId, snap points, draggable — inspiración de API, reimplementación limpia).

MISIÓN:
1. Overlays: **BottomSheet** (patrón FC + overlay-por-id con atom-family interna y API imperativa —
   ADR-010), Modal, Drawer, Popover, Tooltip (referencia FC), Menu.
2. Inputs restantes T1: NumberInput, Radio (+Group), Select/MultiSelect **sobre BottomSheet**
   (patrón FC InputSelect), SearchInput.
3. Feedback: Alert, Toast+provider (visual/gestos de FC Toast: swipe-dismiss, stack), Skeleton
   (shimmer/pulse + integración isLoading en primitivos), Progress (+RingProgress, segmentos).
4. Data display: Card compound, Avatar (+Group), Badge, EmptyState, Image (expo-image).
5. Navegación: Tabs, NavLink, Pagination, Breadcrumbs. Utilities: Portal, Transition, Collapse,
   VisuallyHidden, Conditional/Valid/Omit, KeyboardAware, Main (referencia FC).
6. **Lint de paridad W/N**: script/regla que compara exports y contratos de componentes WN entre
   nebula-web y nebula-native — gate permanente (riesgo #4).
7. CIERRE DE N1: gate de docs\05-roadmap.md N1 → docs\n1-closure.md.

ACEPTACIÓN: lint de paridad en verde; los 4 temas + reduced-motion verificados en dispositivo/emulador.
REPORTE: cierre de N1 + cobertura native acumulada contra 00-inventory.
```
