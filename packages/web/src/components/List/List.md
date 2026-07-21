# List / List.Item

Lista tipográfica (`<ul>`/`<ol>` + `<li>`). El icono de viñeta se comparte de `List` a cada `List.Item` **clonando los hijos** (`Children.map` + `cloneElement`) e inyectando `icon` solo en los items que no traen el suyo. Es API de React sin hooks, así que la lista queda **server-safe** (RSC), sin store ni contexto (coherente con la decisión de W2: reservar Jotai para estado dinámico).

El espaciado entre items se publica como var local (`--list-spacing`) y se aplica con `globalStyle` sobre `> li` (los selectores de hijos no caben en `style()` de VE). Con `icon` la lista quita las viñetas nativas y cada item pasa a `flex` [icono · contenido].
