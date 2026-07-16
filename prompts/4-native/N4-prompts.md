# Prompts N4 — Publicación native v1 🚀

> 1 prompt. Requiere N3 cerrado. Reutiliza la infraestructura de release de W5 (changesets, checklist).

---

## Prompt N4.1 — Release native + verificación externa

```
Actúa como release engineer en C:\Users\Skr13\Documents\GitHub\Nebula. N3 cerrado: catálogo native
completo. La infraestructura de release existe desde W5 (changesets, docs\release-checklist.md).

LEE ANTES: docs\release-checklist.md, docs\w5-closure.md (cómo se hizo el release web),
docs\adr\ADR-013 y ADR-014 (naming, peers, subpaths).

MISIÓN:
1. Auditoría de publicación de @stellaria/nebula-native y @stellaria/nebula-native-camera:
   exports/subpaths (/effects, /charts, /adapters/react-navigation), peerDependencies correctos
   (react-native, reanimated, gesture-handler, unistyles, skia, expo-* — TODOS peers, no deps:
   verifica contra ADR-014 y pregunta rangos si dudas), files whitelist, licencia (la decidida en W5).
2. Bumps coordinados de tokens/hooks/themes/icons con los añadidos native (changesets).
3. `npm publish --dry-run` → revisión de tarballs → publicación bajo la org stellaria (2FA/provenance).
4. Verificación externa OBLIGATORIA: app Expo SDK 57 VIRGEN fuera del monorepo, instalación solo
   desde npm, montar NebulaProvider + tema + Button/TextInput/BottomSheet + un subpath (/charts).
   Documentar TODO paso de config necesario (babel/metro/unistyles plugin) en el README.
5. Registrar versiones en docs\n4-closure.md + tag git.

ACEPTACIÓN (gate N4): install limpio en app virgen → componentes+tema+BottomSheet funcionando;
budgets publicados; misma versión de temas JSON funcionando en web y native (paridad demostrada).
REPORTE: versiones publicadas + fricción del consumidor externo corregida.
```
