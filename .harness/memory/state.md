---
ultima_actualizacion: 2026-10-16
fase: Génesis completada
arquitectura_verificada: True
---

# State — design-html

## Correcciones & Contexto Actual

### Skill ui-ux-pro-max Integrado de Verdad (2026-10-16)

`.claude/settings.json` ya referenciaba `ui-ux-pro-max` desde génesis, pero era un stub: el paquete real nunca se instaló (verificado con `find`, sin resultados). AIRA instaló la integración real a solicitud directa de Carlos:

- Comando: `npx ui-ux-pro-max-cli@latest init --ai claude` (ejecutado una vez, sin instalación global — decisión de Carlos)
- Resultado: `.claude/skills/` con 7 skills del paquete (`ui-ux-pro-max`, `design-system`, `ui-styling`, `design`, `brand`, `banner-design`, `slides`) — Claude Code los auto-detecta, no requieren config
- `.claude/settings.json` corregido: el stub (`use_cases`/`output_path`/`format`, que no correspondía a ningún contrato real) reemplazado por el listado real de skills con alcance honesto por cada uno
- `AGENTS.md` documenta el skill y su uso para P3/P4
- Verificado funcional: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "dashboard"` devuelve resultados reales de la base de datos (styles.csv)
- Nota: `--ai openclaw` (documentado en `source.ui-ux-pro-max-skill` de la wiki de AIRA) no es un valor válido del CLI actual (v2.15.0) — los valores reales son `claude, cursor, windsurf, ...`. Se usó `claude` porque este repo usa `.claude/`. Pendiente corregir esa página de la wiki.

### Génesis Completada (2026-10-10)

✅ Harness instalado  
✅ Constitution redactada (especializada para componentes compartidos)  
✅ AGENTS.md con roles base + especialista-diseño  
✅ Gate configurado (validaciones de symlinks, variables, contraste AA)

### Decisión Arquitectónica: Symlinks

**Aplicada:** Todas las plantillas (21 estilos) usan symlinks a `index.html` y `dashboard.html` compartidos.

**Implicación:** Cambio en HTML = automáticamente en 21 estilos (vía symlinks)

**Verificación:** Gate valida que NO son copias (son symlinks reales)

### Reglas Vigentes (P1-P9)

- **P1:** Gate siempre primero
- **P2:** Sincronización via symlinks (NO copias manuales)
- **P3:** Familia de variables `:root` estándar (39 variables, no negociable)
- **P4:** Contraste AA obligatorio (light + dark)
- **P5:** Sin dependencias de red (tipografía del sistema)
- **P6:** HTML agnóstico de estilo (datos via CSS variables)
- **P7:** Copy en español, datos reales
- **P8:** Conventional Commits + (RF-NNN)
- **P9:** No auto-aprobarse (revisor + Carlos firman)

### Próximo Paso Inmediato

**Crear symlinks en los 21 estilos (si no existen):**

```bash
cd design-html/
for estilo in apple-pro-studio bento brutalismo canvas-workspace enterprise-grid \
              glass-aurum glass-borealis glass-ember glass-neon glass-steel \
              glassmorphism industrial linear minimalista nordic-functional \
              material-flow pulse-analytics ledger-dark storefront stripe-enterprise vercel; do
  cd $estilo
  [ -L index.html ] || ln -s ../index.html index.html
  [ -L dashboard.html ] || ln -s ../dashboard.html dashboard.html
  cd ..
done
```

Luego: `bash .harness/gate/check.sh` debe pasar ✅

### Hazards Conocidos

1. **Si alguien edita symlink manualmente:** Gate detecta y falla
2. **Si un estilo falta variable CSS:** Gate detecta y falla
3. **Si contraste AA en dark mode falla:** Gate detecta y falla

### Notas para Carlos

- Design-HTML NO se expone via cjhirashi-srv (es infraestructura local)
- Los 21 estilos son referenciales, proyectos los copian si quieren
- La gobernanza SDD asegura evolución coherente de componentes visuales

---

**Proyecto:** design-html  
**Fecha Génesis:** 2026-10-10  
**Estado:** Listo para Specify  
**Siguiente:** Crear primera feature (ej. agregar componente, cambiar estilo)
