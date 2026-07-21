# FocusTrap

Atrapa el foco dentro de su subárbol usando `FocusScope` de React Aria (ADR-003) — la misma pieza que gobiernan los overlays de docs/03 §1 (Modal/Drawer/Sheet). `active` conmuta `contain`; `restoreFocus` devuelve el foco al desmontar; `autoFocus` enfoca el primer elemento al montar. Es un wrapper sin nodo DOM propio; `"use client"` porque React Aria gestiona el foco con efectos.
