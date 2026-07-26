`NavLink` renderiza uno de tres elementos DOM excluyentes según las props: botón de disclosure
(`children` presente), ancla (`href` sin `children`) o botón simple (ni una ni otra). El
`forwardRef` es único con tipo unión `HTMLAnchorElement | HTMLButtonElement`; cada rama castea el
`ref` al tipo concreto del elemento que renderiza porque React no puede inferir por sí solo cuál de
las tres ramas se ejecuta en tiempo de compilación.

`aria-current="page"` solo aplica a las ramas sin hijos (son las que representan una página
concreta). La rama con hijos es un disclosure APG (`aria-expanded` + `aria-controls`) y su estado
`active` solo tiñe el fondo, sin semántica de "página actual".
