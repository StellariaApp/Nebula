# path-match

La regla de «activo por ruta» del catálogo, en un solo sitio (ADR-190): la usan `Nav.Links` en
`activeMode="pathname"` y `AppShell.Sidebar` en el mismo modo.

`BestPathMatch` enciende el `href` **más largo** que prefija la ruta **por tramos**: `/avatars` no
enciende `/avatarsx`, y `/` no enciende todo. Gana el más largo para que la raíz de un panel no se
encienda en todas sus pantallas.

`usePathname` lee `window.location.pathname` con `useSyncExternalStore`. Se suscribe a `popstate` y
`hashchange` —lo que la ventana avisa— y, donde existe, a `currententrychange` de la Navigation API,
que es lo que avisa también de un `pushState` de un router de cliente. Sin ese evento, una barra que
no vuelve a renderizar en una navegación de cliente se queda con la ruta anterior: el consumidor
puede seguir pasando `active` a mano, que gana siempre.
