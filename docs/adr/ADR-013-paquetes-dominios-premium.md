# ADR-013 — Naming de paquetes (scope npm `@stellaria`) y dominios premium comercializables

- **Estado**: aceptada · 2026-07-14 (C1-Q1/C1-Q2 + ajuste de scope del propietario)
- **Contexto**: el borrador inicial usaba `@nebula/ui-web`/`@nebula/ui-native`; el propietario definió primero núcleos `web`/`native` con dominios premium vendibles, y después fijó el scope real: la **organización npm existente es `stellaria`** (ya publica `@stellaria/nebula` v0.0.2 "UI Components by Stellaria" y `@stellaria/nova`). No se posee la org `nebula`.
- **Decisión**:
  - Patrón **`@stellaria/nebula-*`**: conserva la marca Nebula dentro de la org, no colisiona con otros productos del scope (`nova`), y el paquete ya existente `@stellaria/nebula` puede retomarse como paquete paraguas/meta que re-exporta el core (decidir su rol exacto en F0).
  - Núcleos: `@stellaria/nebula-tokens`, `@stellaria/nebula-hooks`, `@stellaria/nebula-themes`, `@stellaria/nebula-icons`, `@stellaria/nebula-web`, `@stellaria/nebula-native`.
  - Premium: `@stellaria/nebula-commerce` (ProductCard, PriceTag, Stock, Cart*), `@stellaria/nebula-sales` (Order, Invoice, Receipt, NumPad, Scanner, Shipment), `@stellaria/nebula-payments` (suscripciones, checkout, payment status), confirmados (2026-07-14) `@stellaria/nebula-people` y `@stellaria/nebula-maps`; `@stellaria/nebula-native-camera` (captura básica, C1-Q2).
  - Regla de frontera: entra a un dominio lo que tiene semántica de negocio pero recibe entidades por props/duck-typing (sin acoplarse a un backend); lo acoplado a una app concreta queda en esa app.
  - Un paquete premium se crea al implementar su primer módulo, no antes; distribución vía registry privado con licencia (mecánica exacta se define al montar CI de publicación).
- **Alternativas**: todo en core (regala el valor comercial); todo en apps (duplica verticales entre productos).
- **Consecuencias**: el core queda 100% libre de dominio (vendible como base); los premium dependen solo de core+hooks+icons; los playgrounds separan galería core vs premium.
