# Prompts W5 — Publicación web v1 🚀

> 2 prompts secuenciales. Requiere W4 cerrado. **Antes de W5.2 el propietario debe confirmar el supuesto #11 del roadmap** (publicación pública vs privada del core).

---

## Prompt W5.1 — Preparación de release

```
Actúa como release engineer en C:\Users\Skr13\Documents\GitHub\Nebula. F0–W4 cerrados: el catálogo
web está completo y en verde.

LEE ANTES: docs\adr\ADR-013 (naming @stellaria/nebula-*, rol del paquete paraguas @stellaria/nebula),
docs\adr\ADR-014 (subpaths/peers), docs\05-roadmap.md W5 (gate), docs\03 §3 (budgets).

MISIÓN:
1. Changesets: instala y configura (mini-ADR en docs\adr\ registrando la decisión — supuesto #5);
   versionado independiente por paquete; changelog generado.
2. Auditoría de publicación por paquete (tokens, hooks, themes, icons, web): exports map + subpaths
   definitivos, sideEffects correcto (los .css.ts de VE compilados SÍ son side-effectful — verifica
   tree-shaking real con un bundle de prueba), files whitelist, types en build dual (ESM al menos;
   evalúa CJS y pregunta si hay razón para dual), peerDependencies correctos (react, form-atoms
   opcional, pintura opcional), engines, license (⚠️ PREGUNTA al propietario qué licencia lleva el
   core: MIT/BSL/propietaria — afecta el modelo premium), repository/homepage.
3. README de consumo por paquete: instalación, quickstart (Provider+tema+Button), tabla de subpaths
   con size-limit real, matriz de compatibilidad (React 19, Next 16).
4. **Paquete paraguas** `@stellaria/nebula` (existe v0.0.2 de hace 3 años): propón al propietario su
   rol (meta re-export vs deprecarlo vs docs-only) con recomendación — decisión de ADR-013 pendiente.
5. `npm publish --dry-run` de todos y revisión del contenido del tarball.

RESTRICCIONES: NO publiques nada real en este prompt. Política de preguntas del propietario.

ACEPTACIÓN: dry-run limpio de los 5 paquetes; checklist de release en docs\release-checklist.md.
REPORTE: preguntas abiertas (licencia, paraguas, público/privado) que BLOQUEAN W5.2 hasta respuesta.
```

## Prompt W5.2 — Publicación y verificación externa

```
Actúa como release engineer en C:\Users\Skr13\Documents\GitHub\Nebula. W5.1 cerrado y el propietario
respondió: licencia, rol del paquete paraguas y visibilidad (público/privado). Verifica que esas
respuestas estén registradas (docs\release-checklist.md / ADRs actualizados) — si no, DETENTE y pídelas.

MISIÓN:
1. Publicar en npm bajo la org stellaria (2FA/provenance activos; acceso según la visibilidad
   decidida): nebula-tokens, nebula-hooks, nebula-themes, nebula-icons, nebula-web v1.0.0 (o el
   esquema de versión que fije changesets) + el paraguas según lo decidido.
2. Verificación externa OBLIGATORIA: crea un proyecto Next 16 VIRGEN fuera del monorepo
   (scratchpad), instala SOLO desde npm (sin workspace links), y monta: NebulaProvider + tema
   nebula-dark + Button/TextInput/Modal + un subpath (charts). Todo debe funcionar sin tocar config
   más allá del plugin VE documentado en el README.
3. Smoke de tema dinámico: loadTheme con un JSON exportado a mano.
4. Registrar versiones publicadas en docs\w5-closure.md + tag git del release.

ACEPTACIÓN (gate W5): install limpio en proyecto virgen → componentes+tema funcionando; budgets
publicados en READMEs; tarballs sin archivos de más.
REPORTE: versiones publicadas, tamaño real de cada paquete, y cualquier fricción del consumidor
externo (se arregla ANTES de anunciar).
```
