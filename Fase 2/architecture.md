# Fase 2 — Arquitectura del Proyecto: Portfolio Ninin

> Basado en el análisis de diseño de la Fase 1.  
> **Stack**: Astro 7 · HTML5 · CSS3 · JavaScript vanilla  
> **Restricción estricta**: Sin React, Vue, Svelte, Tailwind, ni ningún framework o librería CSS.

---

## 1. Árbol Completo del Proyecto

```
portfolio-ninin/
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   └── fonts/
│       └── IBMPlexMono/                  # Fuente local (woff2)
│           ├── IBMPlexMono-Regular.woff2
│           ├── IBMPlexMono-SemiBold.woff2
│           └── IBMPlexMono-Bold.woff2
│
├── src/
│   ├── components/
│   │   ├── primitives/                   # Átomos — componentes de un solo elemento
│   │   │   ├── Btn.astro
│   │   │   ├── ProgressBar.astro
│   │   │   ├── Prompt.astro
│   │   │   ├── Output.astro
│   │   │   ├── Separator.astro
│   │   │   ├── InputLine.astro
│   │   │   └── Cursor.astro
│   │   │
│   │   ├── ui/                           # Compuestos — combinan primitivos
│   │   │   ├── NavOption.astro
│   │   │   ├── PanelNav.astro
│   │   │   ├── PreviewCard.astro
│   │   │   ├── PreviewCardMobile.astro
│   │   │   ├── WindowDetail.astro
│   │   │   ├── PanelMain.astro
│   │   │   └── Panel.astro
│   │   │
│   │   └── sections/                     # Secciones — agrupan ui/ para construir vistas
│   │       ├── SectionBienvenida.astro
│   │       ├── SectionNinin.astro
│   │       ├── SectionProyectos.astro
│   │       ├── SectionAbout.astro
│   │       ├── SectionContacto.astro
│   │       └── SectionHelp.astro
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro              # Layout raíz — única plantilla de página
│   │
│   ├── pages/
│   │   └── index.astro                   # Única ruta — SPA de scroll horizontal
│   │
│   ├── styles/
│   │   ├── global.css                    # Reset, @font-face, variables CSS, body
│   │   ├── tokens.css                    # Design tokens (colores, tipografía, espacios)
│   │   ├── typography.css                # Clases de escala tipográfica
│   │   ├── layout.css                    # Grid de la app (sidebar + main)
│   │   ├── animations.css                # Transiciones y animaciones del sistema
│   │   └── components/                   # Un archivo por componente
│   │       ├── btn.css
│   │       ├── progress-bar.css
│   │       ├── prompt.css
│   │       ├── output.css
│   │       ├── separator.css
│   │       ├── input-line.css
│   │       ├── cursor.css
│   │       ├── nav-option.css
│   │       ├── panel-nav.css
│   │       ├── preview-card.css
│   │       ├── window-detail.css
│   │       ├── panel-main.css
│   │       ├── panel.css
│   │       ├── section-bienvenida.css
│   │       ├── section-ninin.css
│   │       ├── section-proyectos.css
│   │       ├── section-about.css
│   │       ├── section-contacto.css
│   │       └── section-help.css
│   │
│   └── data/
│       ├── navigation.js                 # Links del NAV.EXE y su orden
│       └── projects.js                   # Datos de los proyectos
│
├── Fase 1/
│   └── design_analysis.md
│
├── Maquetacion/
│   ├── Desktop.svg
│   ├── Tablet.svg
│   ├── Phone.svg
│   ├── Componentes_Simples.svg
│   ├── Componentes_Compuestos.svg
│   └── Guia_de_estilo.svg
│
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── AGENTS.md
└── README.md
```

---

## 2. Descripción de Cada Carpeta

### `public/`
Archivos servidos de forma estática, sin procesamiento por Astro.

| Subcarpeta / archivo | Responsabilidad |
|---|---|
| `favicon.ico` / `favicon.svg` | Íconos del sitio (ya existentes) |
| `fonts/IBMPlexMono/` | Fuentes locales en formato `woff2` para el `@font-face`. Evitar dependencia de CDN externo y garantizar carga offline / velocidad óptima. Solo los 3 pesos usados: Regular (400), SemiBold (600), Bold (700). |

---

### `src/components/`
Todos los componentes de la interfaz. Se dividen en **tres capas** de abstracción.

#### `src/components/primitives/`
Átomos del design system. Cada archivo corresponde exactamente a un componente simple del inventario de la Fase 1 (`Componentes_Simples.svg`). No dependen de ningún otro componente. Reciben `props` y renderizan un único elemento semántico.

| Archivo | Componente Figma | Responsabilidad |
|---|---|---|
| `Btn.astro` | `ui/btn` | Botón ASCII `[ texto ]` con sus 3 estados |
| `ProgressBar.astro` | `ui/progress-bar` | Barra `[████░░] %` |
| `Prompt.astro` | `cmd/prompt` | Línea `$ comando` |
| `Output.astro` | `cmd/output` | Línea `> respuesta` |
| `Separator.astro` | `ui/separator` | Divisor horizontal (variante default / active) |
| `InputLine.astro` | `ui/input-line` | Campo de entrada estilo terminal |
| `Cursor.astro` | `fx/cursor` | Bloque rojo parpadeante |

#### `src/components/ui/`
Compuestos. Combinan primitivos para formar los bloques funcionales del diseño (`Componentes_Compuestos.svg`). Pueden recibir slots y props con datos.

| Archivo | Componente Figma | Responsabilidad |
|---|---|---|
| `NavOption.astro` | `ui/nav-option` | Ítem de nav `[n] texto` con estado active |
| `PanelNav.astro` | `ui/panel-nav` | Ventana NAV.EXE con lista de `NavOption` |
| `PreviewCard.astro` | `ui/preview-card` | Tarjeta de proyecto — layout desktop horizontal |
| `PreviewCardMobile.astro` | `ui/preview-card-mobile` | Tarjeta de proyecto — layout mobile vertical |
| `WindowDetail.astro` | `ui/window/detail` | Ventana `PROYECTO.EXE` con frame de OS |
| `PanelMain.astro` | `ui/panel-main` | Contenedor principal de contenido por sección |
| `Panel.astro` | `ui/panel` | Wrapper de alto nivel para una vista completa |

#### `src/components/sections/`
Secciones completas del portfolio. Cada archivo monta toda la vista de una sección usando componentes `ui/`. Son los "bloques de página" que `index.astro` ensambla. Corresponden a las 6 secciones confirmadas del diseño.

| Archivo | Sección del diseño |
|---|---|
| `SectionBienvenida.astro` | Vista inicial — no está en el NAV.EXE |
| `SectionNinin.astro` | `[1] ninin` |
| `SectionProyectos.astro` | `[2] la proyectos` |
| `SectionAbout.astro` | `[3] sobre_mi` |
| `SectionContacto.astro` | `[4] mail contacto` |
| `SectionHelp.astro` | `[5] man ayuda` |

---

### `src/layouts/`

#### `BaseLayout.astro`
Única plantilla de la aplicación. Sus responsabilidades son:
- Renderizar el `<html>`, `<head>` y `<body>`
- Inyectar los meta tags SEO
- Cargar `global.css` y `tokens.css`
- Cargar la fuente `IBM Plex Mono` vía `@font-face`
- Establecer la estructura raíz: `PanelNav` (sidebar) + área de contenido principal
- Exponer un `<slot />` donde `index.astro` inyecta las secciones

No existe un segundo layout. La diferencia entre Desktop y Mobile se gestiona íntegramente con media queries dentro del CSS.

---

### `src/pages/`

#### `index.astro`
La única página del sitio. El portfolio es una **SPA de scroll horizontal** (o navegación directa por JavaScript), por lo que todas las secciones conviven en el mismo documento. Sus responsabilidades son:
- Importar `BaseLayout.astro`
- Importar e instanciar los 6 componentes `Section*`
- Contener el `<script>` de navegación (lógica de sección activa y animación)

No se crearán más páginas de primer nivel (`/proyecto/[slug]`, etc.) a menos que el diseño lo requiera explícitamente.

---

### `src/styles/`

Organización de estilos en archivos de responsabilidad única. **No hay estilos inline**. **No hay Tailwind**.

| Archivo | Responsabilidad |
|---|---|
| `global.css` | `@font-face`, CSS reset (`box-sizing`, `margin`, `padding`), estilos del `body`, importación de los demás archivos CSS del sistema |
| `tokens.css` | Todas las custom properties CSS (design tokens). Es la **única fuente de verdad** de los valores del design system |
| `typography.css` | Clases utilitarias de la escala tipográfica (`terminal-h1`, `terminal-body`, etc.) que aplican los tokens tipográficos |
| `layout.css` | Estructura macroestructural: sidebar + área principal, breakpoints de grid |
| `animations.css` | Keyframes y transiciones del sistema (cursor parpadeante, transición de sección activa) |
| `components/*.css` | Un archivo por componente. Se importa dentro del propio `.astro` con `<style>` o desde `global.css` |

---

### `src/data/`
Datos estáticos del sitio expresados como módulos JavaScript. Permiten que los componentes sean agnósticos del contenido y facilitan actualizaciones sin tocar el HTML.

| Archivo | Estructura de datos |
|---|---|
| `navigation.js` | Array de objetos `{ index, label, sectionId }` — los 5 ítems del NAV.EXE |
| `projects.js` | Array de objetos `{ id, title, description, year, category, urls }` — datos de cada proyecto |

---

## 3. Convenciones de Nombres

### Componentes Astro
- **PascalCase** obligatorio: `Btn.astro`, `PanelNav.astro`, `SectionNinin.astro`
- Prefijo de carpeta implícito en el nombre: `Section*` → siempre en `sections/`
- Nombres alineados con los del design system Figma (sin traducir, sin abreviar)

### Archivos CSS
- **kebab-case** obligatorio: `btn.css`, `panel-nav.css`, `section-ninin.css`
- Nombre idéntico al componente `.astro` que describe, en kebab-case

### Variables CSS (Design Tokens)
- Prefijo semántico de grupo: `--bg-*`, `--fg-*`, `--border-*`
- Sin valores hardcodeados fuera de `tokens.css`: todo componente usa `var(--token)`
- Tokens de espaciado: `--space-1` … `--space-5`
- Tokens tipográficos: `--font-size-h1`, `--line-height-h1`, `--font-weight-h1` (uno por atributo, por escala)

### Variables JavaScript
- **camelCase**: `sectionId`, `navItems`, `projectList`

### IDs de sección HTML
Siguiendo los nombres del diseño, en kebab-case:
- `#bienvenida`, `#ninin`, `#la-proyectos`, `#sobre-mi`, `#mail-contacto`, `#man-ayuda`

---

## 4. Estrategia de Organización

### Atomic Design adaptado al proyecto

```
primitives/  →  ui/  →  sections/  →  index.astro
  (átomos)    (moléculas)  (organismos)   (página)
```

La regla es estricta: **las capas solo consumen la capa inmediatamente inferior**. Una sección no importa directamente un primitivo — lo hace a través de un compuesto `ui/`. Una excepción permitida: `Prompt.astro` y `Output.astro` pueden usarse directamente en secciones cuando se usan sueltos (sin contexto de `PanelMain`).

### Flujo de composición

```
BaseLayout.astro
└── index.astro
    ├── SectionBienvenida.astro
    │   └── Panel.astro
    │       └── PanelMain.astro
    │           ├── Prompt.astro
    │           └── Output.astro
    ├── SectionNinin.astro
    │   └── Panel.astro
    │       └── PanelMain.astro
    │           └── ProgressBar.astro (× n skills)
    ├── SectionProyectos.astro
    │   └── Panel.astro
    │       └── PanelMain.astro
    │           ├── PreviewCard.astro (× n proyectos)
    │           ├── PreviewCardMobile.astro (× n proyectos)
    │           └── WindowDetail.astro
    ├── SectionAbout.astro
    ├── SectionContacto.astro
    │   └── Panel.astro
    │       └── PanelMain.astro
    │           ├── InputLine.astro
    │           └── Btn.astro
    └── SectionHelp.astro
```

`PanelNav.astro` vive dentro de `BaseLayout.astro`, fuera del flujo de secciones, porque es un elemento persistente a lo largo de toda la experiencia.

---

## 5. Estrategia para Estilos

### Regla maestra
> Ningún valor numérico de color, tamaño, espaciado o tipografía se escribe directamente en un componente. Todo se referencia mediante `var(--token)`.

### Capas de CSS (orden de cascada)

1. **`tokens.css`** — Declara todas las `--custom-properties`. No genera ningún selector, solo el bloque `:root {}`.
2. **`global.css`** — Reset + `body` + `@font-face` + importa todos los demás archivos.
3. **`typography.css`** — Clases reutilizables de texto (`.terminal-h1`, `.terminal-body`, etc.).
4. **`layout.css`** — Grid principal del OS: sidebar fijo + área de scroll horizontal.
5. **`animations.css`** — Keyframes globales (`@keyframes blink`, `@keyframes slide-in`).
6. **`components/*.css`** — Estilos específicos de cada componente, nombrados con el mismo identificador que el `.astro`.

### Media queries
- Todos los breakpoints están definidos como tokens en `tokens.css`: `--bp-desktop`, `--bp-tablet`, `--bp-phone`.
- Las media queries se escriben **dentro del archivo CSS del componente que cambia de layout**, no en un archivo centralizado de responsividad. Esto mantiene la cohesión componente-estilo.
- Breakpoints de referencia del diseño: `1440px` (desktop), `768px` (tablet), `402px` (phone).

### Sin duplicación de HTML
El cambio entre `PreviewCard` y `PreviewCardMobile` se maneja con **CSS (`display: none` / `display: flex`)** según breakpoint, **no** instanciando dos componentes diferentes en el HTML. La decisión de cuál componente mostrar se centraliza en `SectionProyectos.astro` mediante un único selector de media query.

> **Excepción documentada**: Si las diferencias estructurales entre desktop y mobile son demasiado profundas para manejarse solo con CSS (por ejemplo, diferente orden de elementos semánticos), se permite renderizar ambas variantes y ocultar la que no corresponde con `display: none`. Esto se evalúa componente a componente.

---

## 6. Estrategia para Assets

### Fuentes
- `IBM Plex Mono` se aloja **localmente** en `public/fonts/IBMPlexMono/`.
- Solo los 3 pesos utilizados se incluyen: `400`, `600`, `700`.
- Formato único: `woff2` (soporte universal en navegadores modernos, mejor compresión).
- El `@font-face` se declara en `global.css` apuntando a `public/fonts/`.
- `font-display: swap` para evitar FOUT bloqueante.

### Imágenes de proyectos
- El diseño usa bloques de color `fg/primary` como placeholder para thumbnails.
- Si el portfolio incluye imágenes reales, se almacenarán en `public/images/projects/` con nombre descriptivo en kebab-case: `proyecto-01-thumbnail.webp`.
- Formato preferido: `webp` con fallback `jpg`.

### No hay íconos de librería
El design system confirma que **no se usa ninguna librería de íconos**. Todo el simbolismo visual (`$`, `>`, `[`, `]`, `≡`, `- □ ×`) se implementa con caracteres UTF-8 / ASCII directamente en el HTML.

### Favicon
Los archivos `favicon.ico` y `favicon.svg` ya existen en `public/`. No se modifican a menos que el diseño lo requiera.

---

## 7. Estrategia para Datos Reutilizables

### `src/data/navigation.js`
```js
// Estructura de ejemplo (no implementar todavía)
// [{ index: 1, label: 'ninin', sectionId: 'ninin' }, ...]
```
`PanelNav.astro` importa este array y genera los `NavOption` con un `.map()`. El componente no hardcodea los links.

### `src/data/projects.js`
```js
// Estructura de ejemplo (no implementar todavía)
// [{ id: 'proyecto-01', title: 'proyecto_01.tgz.gz', description: '...', year: 2024, category: 'Diseño Web' }]
```
`SectionProyectos.astro` importa este array para renderizar las `PreviewCard`.

### Principio general
Cualquier dato que aparezca repetido o que el autor deba actualizar frecuentemente (textos, links, skills, proyectos) **vive en `src/data/`**, nunca hardcodeado en el HTML del componente.

---

## 8. Flujo de Navegación

### Descripción
El portfolio es un **single-page application de scroll horizontal**. No existe enrutamiento tradicional de páginas.

```
[Carga inicial] → SectionBienvenida (activa por defecto)
    ↓
[Click en NAV.EXE → NavOption [1]] → SectionNinin (activa)
    ↓
[Click en NAV.EXE → NavOption [2]] → SectionProyectos (activa)
    ↓
[Click en NAV.EXE → NavOption [3]] → SectionAbout (activa)
    ↓
[Click en NAV.EXE → NavOption [4]] → SectionContacto (activa)
    ↓
[Click en NAV.EXE → NavOption [5]] → SectionHelp (activa)
```

### Mecanismo de navegación
- La lógica de navegación reside en un `<script>` en `index.astro`.
- Al hacer click en un `NavOption`, el script:
  1. Marca el `NavOption` como `active` (aplica estilos de estado activo).
  2. Anima/desplaza el área de contenido hacia la sección correspondiente.
  3. Actualiza el hash de la URL (`#ninin`, `#la-proyectos`, etc.) para navegación con historial.
- La animación de transición es **instantánea** (sin scroll animado lento), conforme a lo confirmado en el diseño.
- En Mobile (Phone), el `≡` hamburger abre el `PanelNav` como overlay.

### IDs de sección (anclas)
Cada `Section*.astro` expone un `id` en su elemento raíz:

| Componente | `id` |
|---|---|
| `SectionBienvenida` | `bienvenida` |
| `SectionNinin` | `ninin` |
| `SectionProyectos` | `la-proyectos` |
| `SectionAbout` | `sobre-mi` |
| `SectionContacto` | `mail-contacto` |
| `SectionHelp` | `man-ayuda` |

---

## 9. Estrategia para Reutilización de Componentes

### Reutilización via props
Los primitivos (`Btn`, `Prompt`, `Output`, `Separator`, `ProgressBar`) son puramente **data-driven**: aceptan todo su contenido por `props`. No tienen lógica de estado interna.

Ejemplo conceptual de `Prompt.astro`:
```
Props esperadas: { command: string }
Render: $ {command}
```

### Reutilización via slots
Los componentes contenedor (`Panel`, `PanelMain`, `WindowDetail`) exponen `<slot />` para que el componente padre inyecte contenido libre. Esto permite que el mismo contenedor sea usado en todas las secciones sin duplicar estructura.

### Variantes por prop
Cuando un componente tiene variantes del diseño (ej. `Separator` en Default vs. Active, o `Btn` en sus 3 estados), la variante se controla mediante una **prop de string** (`variant="active"`). El CSS de ese componente define los selectores correspondientes (atributo `data-variant` o clase CSS).

### No se crean componentes genéricos o "utility"
Cada componente tiene nombre y responsabilidad específicos del diseño. No existe un `Box.astro` ni un `Container.astro` genérico. Si algo no está en el inventario de componentes de la Fase 1, no se crea hasta que el diseño lo requiera.

---

## 10. Riesgos Detectados

| ID | Riesgo | Impacto | Mitigación |
|---|---|---|---|
| **R1** | `--border-dim: #3a3a3a` en `global.css` actual difiere del token oficial `#3d3d3d` del design system | Alto | Corregir en `tokens.css` antes de implementar cualquier componente |
| **R2** | `--fg-dim: #3a3a3a` y `--border-dim: #3d3d3d` son visualmente casi idénticos pero semánticamente distintos | Medio | Documentar explícitamente en `tokens.css` el rol de cada uno con comentarios |
| **R3** | Tokens `--fg-secondary` y `--fg-tertiary` sin uso confirmado en layouts | Bajo | Declarar en `tokens.css` pero no usar hasta que el SVG los evidencie en un componente real |
| **R4** | Gap de 40px entre sidebar (X=680) y primer frame (X=720) sin propósito documentado | Medio | Implementar como margen explícito `--layout-gap: 40px` y verificar con el autor antes de la sección Hero |
| **R5** | Transición de sección: "de una" (sin animación suave) puede resultar abrupta en experiencia real | Bajo | Implementar primero sin animación; evaluar con el autor si se agrega `transition` suave |
| **R6** | `index.astro` hoy tiene el `<html>` hardcodeado — debe migrar a `BaseLayout.astro` | Alto | Primera tarea de la Fase 3: crear `BaseLayout.astro` y refactorizar `index.astro` |
| **R7** | `global.css` actual mezcla tokens, reset y estilos de body en un solo archivo | Medio | Separar en `tokens.css`, `global.css` y `typography.css` antes del primer componente |
| **R8** | Navegación horizontal pura puede afectar SEO y accesibilidad de teclado | Medio | Actualizar hash de URL en cada sección, asegurar `aria-current="page"` en `NavOption` activo |

---

## 11. Recomendaciones para el Desarrollo

1. **Iniciar siempre por los tokens**. Antes de cualquier componente, `tokens.css` debe estar completo y verificado contra los valores del `design_analysis.md`. Es la base de toda la implementación.

2. **Corregir `global.css` existente** como primer paso. El valor actual `--border-dim: #3A3A3A` es incorrecto (debería ser `#3d3d3d`). Además, `global.css` debe importar `tokens.css` para no hardcodear valores.

3. **Crear `BaseLayout.astro` antes del primer componente de sección**. El layout raíz es el scaffolding que da sentido a todos los demás componentes.

4. **Seguir el orden del `AGENTS.md`**: Navbar → Hero → About → Experience → Projects → Contact → Footer. Un componente por turno.

5. **Verificar en SVG antes de implementar**. Ante cualquier duda de medida, color o comportamiento, el archivo SVG correspondiente es la fuente de verdad, no la memoria ni la inferencia.

6. **No inventar variantes no documentadas**. Si el diseño no muestra un estado de error para `InputLine`, no se implementa. La fidelidad al Figma es el constraint supremo.

7. **Accesibilidad mínima no negociable**: `alt` en imágenes, `aria-label` en botones sin texto visible, `aria-current="page"` en nav activo, navegación por teclado en `PanelNav`.

8. **Fuente local antes de primera ejecución**. Descargar los archivos `woff2` de IBM Plex Mono (Google Fonts permite descarga directa) y colocarlos en `public/fonts/` antes de cualquier render visual.

9. **Un componente = un CSS**. Nunca añadir estilos de un componente en el CSS de otro. La cohesión componente-estilo es la regla más importante para el mantenimiento a largo plazo.

10. **Datos en `src/data/` desde el primer componente que los necesite**. No hardcodear proyectos ni links de navegación en el HTML, incluso en la primera iteración.

---

## 12. Restricciones Recordatorio

> Estas restricciones provienen del `AGENTS.md` del proyecto y son de cumplimiento estricto:

- ❌ Sin React, Vue, Svelte ni ningún framework JS de componentes
- ❌ Sin Tailwind CSS, Bootstrap ni ningún framework CSS
- ❌ Sin estilos inline (atributo `style=""` en HTML)
- ❌ Sin duplicar HTML para distintos breakpoints
- ✅ Solo: Astro · HTML5 semántico · CSS3 con variables · JavaScript vanilla
- ✅ Un componente por turno de desarrollo
- ✅ Orden de desarrollo: Navbar → Hero → About → Experience → Projects → Contact → Footer
