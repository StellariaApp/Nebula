---
"@stellaria/nebula-web": minor
"@stellaria/nebula-hooks": minor
"@stellaria/nebula-themes": minor
"@stellaria/nebula-tokens": minor
"@stellaria/nebula-icons": minor
"@stellaria/nebula": minor
---

Detalle técnico, para quien mantenga: la auditoría de qué anima con CSS y qué con motion —y por qué
los seis que quedan no pueden salir— está en `docs/03-a11y-motion-performance.md` §2. El modelo del
scroll y el porqué de cada constante, en `packages/hooks/src/use-momentum-scroll.ts`.

Los seis paquetes suben juntos aunque sólo dos tengan cambios: el tag que dispara la publicación
nombra una sola versión, así que versiones distintas lo harían mentir.
