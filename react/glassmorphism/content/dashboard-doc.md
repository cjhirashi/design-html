# Guía del panel Glass

Esta vista reutiliza el **mismo** componente Markdown que el blog (RF-004): el resaltado
de sintaxis y el resto del render ocurren en build/servidor, sin cargar nada por red.

## Capas del sistema

El panel se compone de tres capas atmosféricas:

1. **Aurora** — fondo con rayos animados.
2. **Vidrio** — superficies translúcidas con *blur*.
3. **Contenido** — tablas, métricas y formularios.

> La misma fuente `.md` alimenta ambas pistas (vanilla y react): cero divergencia de
> contenido entre ellas.

## Token de ejemplo

Un bloque de código con lenguaje declarado se resalta de verdad:

```css
.panel {
  background-color: var(--bg-card);
  border: 1px solid var(--border-glass);
}
```

## Referencia rápida

| Vista       | Para qué sirve                        |
| ----------- | ------------------------------------- |
| Tabla       | Listado, detalle y edición            |
| Métricas    | Catálogo de gráficos                  |
| Formulario  | Catálogo de tipos de campo            |

Más detalle en la [documentación del catálogo](https://design-html.local/docs).
