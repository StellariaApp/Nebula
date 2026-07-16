# Prompts N3 — Native Tier 3

> 3 prompts secuenciales. Requiere N2 cerrado. Bloque común de N1 aplicable (con "N2 cerrado").

---

## Prompt N3.1 — LiquidGlass + `useDeviceTier`

```
[BLOQUE COMÚN de N1, con N2 cerrado]
LEE ADEMÁS (vinculante): el plan v2 completo:
C:\Users\Skr13\Documents\GitHub\Stellaria-Frontend\docs\liquid-glass-v2-plan.md
y el código fuente real (la carpeta más compleja de Stellaria):
C:\Users\Skr13\Documents\GitHub\Stellaria-Frontend\src\ui\native\src\components\Effects\LiquidGlass\
(shaders SKSL, 8 hooks, store Jotai, Provider/Target/Backdrop, presets, quality tiers, gyro).

MISIÓN:
1. Migrar LiquidGlass COMPLETO a @stellaria/nebula-native (subpath /effects, lazy-load — el bundle
   base no debe crecer).
2. Generalizar useGlassQuality → **useDeviceTier** en packages/hooks (ultra/high/medium/low por
   heurística de dispositivo; API pública documentada — lo consumirán todos los efectos).
3. Continuar el plan v2 según sus fases: estrategia de captura A (canvas unificado/BackdropFilter),
   blur gaussiano real (reemplaza 5-tap), border gleam en shader. Dispersión prismática/caustics
   quedan como backlog documentado si el tiempo de la fase no da — pregunta prioridades si hay que
   recortar.
4. Presets (ios/bold/frosted/dark) + integración con effects.glass del theme (sober lo apaga).

ACEPTACIÓN: demo en playground native con los 4 quality tiers forzables; reduced-motion y
glass.enabled=false verificados; bundle base intacto (size-limit).
REPORTE: estado real contra el plan v2 (qué fase quedó implementada) + perf medida en emulador/dispositivo.
```

## Prompt N3.2 — Shaders + Animated Text + Micro-interactions + Carousels

```
[BLOQUE COMÚN de N1, con N3.1 cerrado]

MISIÓN (00-inventory §1.15/§1.16, subpaths lazy):
1. Shaders (/effects): Aurora, MeshGradient, GrainyGradient, ChromaRing, EnergyOrb, SiriOrb,
   SkiaRipple, WaveScrawler, NoiseTexture, GlassSurface, GradientBackground/Text con tokens
   gradients, BlurView (base: Blur factory de Stellaria Layout).
2. Animated Text (8): AnimatedText, FadeText, StaggeredText, DynamicText, GooeyText (Skia),
   AnimatedMaskedText, CurvedMarquee, CountUpText.
3. Micro-interactions: GooeySwitch, ElasticSlider, SpinButton, FlexiButton, StackedChips,
   **AnimatedThemeToggle** (migrar ThemeSwitch de Stellaria — Skia+store), stagger estandarizado
   en listas (patrón animatedIndex/Delay de FC/TFV → motion tokens).
4. Carousels: Carousel base, BlurCarousel, CinematicCarousel, CircularCarousel, ImageGallery.
Todos: useDeviceTier para degradación + ReduceMotion.System.

REPORTE: tabla componente→estado + perf de los shaders por tier.
```

## Prompt N3.3 — Charts native + cierre Tier 3

```
[BLOQUE COMÚN de N1, con N3.2 cerrado]
LEE ADEMÁS: docs\adr\ADR-011-charts.md y la implementación web de /charts (W3.4) — el contrato
unificado YA existe: tu trabajo es implementarlo sobre victory-native.

MISIÓN:
1. /charts native: BarChart, LineChart, AreaChart, PieChart/Donut, SparkLine, TrendIndicator sobre
   victory-native XL (41.x), con EXACTAMENTE el mismo contrato de props que los charts web (paridad
   verificada por el lint de N1.4). Theming por tokens; a11y con accessibilityLabel descriptivo.
2. CIERRE DE N3: gate de docs\05-roadmap.md N3 → docs\n3-closure.md: Skia lazy-load verificado,
   degradación low-end demostrada, reduced-motion total, cobertura del catálogo native (177 P2 +
   adiciones) al 100% o excepciones aprobadas por el propietario.

REPORTE: cierre de N3 + lista definitiva de exports native para la publicación N4.
```
