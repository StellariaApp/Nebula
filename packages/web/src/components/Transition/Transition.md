# Transition

Monta/desmonta `children` con una animación de entrada/salida (`AnimatePresence` + `m.div`). Solo anima `transform`/`opacity` (docs/03 §2): los presets `slide-*` usan `x`/`y` (translate), `scale`/`pop` usan `scale`, `fade` solo opacidad.

Se apaga (`duration: 0`, sin tween) con `useReducedMotion()` **y** con `motion.tier: "minimal"` del tema (misma regla que Button, ADR-018). La duración por defecto sale de `motion.duration.base` del tema; `duration` (ms) la puede sobrescribir. `domAnimation` se importa estático (cargarlo perezoso empeora el bundle — medido en ADR-018).
