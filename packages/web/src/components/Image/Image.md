# Image

## La imagen que carga antes de hidratar

La imagen arranca en `opacity: 0` y aparece con `data-loaded`, que pone el `onLoad`. Con render de servidor el navegador puede terminar de cargar el `<img>` antes de que React hidrate y conecte el `onLoad`: el evento ya pasó y la imagen se quedaba invisible.

Por eso, al montar, se mira el `<img>`: si ya está `complete` con `naturalWidth > 0`, queda cargada. Si está `complete` sin ancho, `decode()` decide: rechaza cuando la imagen está rota (degrada al fallback, igual que `onError`) y resuelve cuando es válida pero sin tamaño propio, como un SVG sin dimensiones. Si aún no está `complete`, el `onLoad` llega como siempre.
