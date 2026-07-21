# Portal

Renderiza `children` en otro nodo del DOM (`target`, o `document.body`) vía `createPortal`. SSR-safe: no portalea hasta montar en cliente (`useState`+`useEffect`), evitando el mismatch de hidratación de Next 16. `disabled` lo deja renderizar en su sitio original. `"use client"` obligatorio: toca `document` y usa efectos.
