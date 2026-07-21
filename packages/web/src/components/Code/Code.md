# Code

Primitivo de código: `<code>` inline por defecto y `<pre>` con `block` (fuente mono, superficie `sunken`, radio, scroll horizontal). **Sin syntax highlighting** — decisión de W2.2 (checkpoint): el resaltado supera el budget de un primitivo (ADR-014 exige aislar deps pesadas) y llega en el componente dedicado `CodeHighlight` (§1.14) como subpath o librería aparte. Así el primitivo Tier 1 queda sin dependencias nuevas.
