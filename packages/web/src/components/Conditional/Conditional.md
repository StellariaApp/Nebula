# Conditional

Renderiza `children` si `when`, si no `fallback`. API **unaria** cerrada en C1-Q7 (`when` + `fallback?: ReactNode`), que sustituye y cubre el patrón binario de dos hijos de FC/TFV (`<Conditional.True/>` / segundo hijo). Componente de lógica pura: sin DOM ni `"use client"`, server-safe.
