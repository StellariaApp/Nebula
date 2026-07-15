# ADR-007 — Playgrounds: Storybook 10 unificado (web + React Native)

- **Estado**: aceptada · 2026-07-14 (C2-Q1)
- **Contexto**: se requieren dos playgrounds (web y native) que cubran variantes × temas × dark/light × reduced-motion, con validación a11y automatizable en CI. Verificado: storybook 10.5 y @storybook/react-native 10.5 (misma major, stories CSF compartibles), addon-a11y 10.5. Ladle 5.1 es más rápido pero sin ecosistema (a11y/docs/interaction tests habría que montarlos a mano).
- **Decisión**: `apps/playground-web` = Storybook 10.5 (addon-a11y + interaction tests + theming toolbar + viewport). `apps/playground-native` = Expo SDK 57 + @storybook/react-native 10.5. Las stories CSF se escriben una vez por componente y se comparten donde la API es unificada (fixtures separados solo para props de plataforma).
- **Alternativas**: Ladle (velocidad, sin addons); app Expo catálogo artesanal (control total, duplica autoría y pierde paridad).
- **Consecuencias**: las stories son también los fixtures de interaction tests y del pipeline axe (03 §4); la matriz de stories obligatorias por componente (Default/Variants/Sizes/States/Dark/RTL/ReducedMotion) se hereda del spec de phase-3.
