# Análisis de Diseño — Portfolio Ninin
> Generado a partir del análisis de los archivos SVG en `/Maquetacion/`  
> **Última actualización**: Información tipográfica, breakpoints, navegación y estados de hover confirmados por el autor.

---

## 1. Resumen del Design System

### Paleta de Colores

El sistema de color es **oscuro (dark mode)** como tema base. La paleta está **cerrada y definitivamente confirmada** por el autor: **11 swatches** en `Guia_de_estilo.svg`, organizados en **3 grupos** de variables de Figma: `bg`, `fg`, `border`.

**Paleta oficial — Variables de Figma** (nombres confirmados por el autor):

#### Grupo `bg` — Backgrounds

| Variable Figma | Token CSS | Valor HEX | Rol |
|---|---|---|---|
| `bg/terminal` | `--bg-terminal` | `#0a0a0a` | Background principal de la app (terminal/OS) |
| `bg/panel` | `--bg-panel` | `#111` | Background de paneles y secciones |
| `bg/hover` | `--bg-hover` | `#1a1a1a` | Estado **hover** de elementos interactivos |

#### Grupo `fg` — Foregrounds / Colores de texto y acento

| Variable Figma | Token CSS | Valor HEX | Rol |
|---|---|---|---|
| `fg/primary` | `--fg-primary` | `#8b2323` | **Acento principal** (rojo borgoña) — estado active, símbolo `$` en prompt |
| `fg/secondary` | `--fg-secondary` | `#6b7a5a` | **Color secundario** (verde oliva) — para resaltar aún más |
| `fg/tertiary` | `--fg-tertiary` | `#5a6b7a` | **Color terciario** (azul-gris) — negativo del acento, símbolo `>` en output |
| `fg/text` | `--fg-text` | `#c4c4c4` | Texto principal del sistema |
| `fg/text-muted` | `--fg-text-muted` | `#6b6b6b` | Texto atenuado — uso ocasional |
| `fg/dim` | `--fg-dim` | `#3a3a3a` | Elementos visuales atenuados, superficies secundarias |

#### Grupo `border` — Bordes

| Variable Figma | Token CSS | Valor HEX | Rol |
|---|---|---|---|
| `border/default` | `--border-default` | `#8b2323` | Borde de acento (mismo valor que `fg/primary`) |
| `border/dim` | `--border-dim` | `#3d3d3d` | Borde estético de ventana OS — emula bordes de sistemas operativos antiguos |

> **Nota**: `fg/primary` y `border/default` comparten el mismo valor `#8b2323`. Esto explica por qué el acento aparece dos veces en la guía de estilos: su rol como foreground de texto/acento y su rol como borde son semánticamente distintos aunque el valor sea idéntico.

> **Nota sobre `#fff`**: El blanco puro (`#fff`) **no es un token de la paleta**. En el SVG aparece solo como color de relleno de los textos vectorizados de la escala tipográfica (la forma en que Figma exporta el texto). No existe swatch blanco en la guía de estilos.

**Colores excluidos (no usar en implementación):**
- `#8a38f5` — Color de anotación de Figma. Solo en `Componentes_Simples.svg`.
- `#1e1e1e` — Fondo del canvas de Figma en `Desktop.svg`.

---

### Tipografías

**Familia tipográfica**: `IBM Plex Mono` — Grupo de variables en Figma: `terminal`  
Fuente monoespaciada, coherente con la metáfora visual de OS retro / terminal.

**Escala tipográfica** — Nombres de variables Figma confirmados por el autor:

| Variable Figma | `font-size` | `line-height` | `font-weight` |
|---|---|---|---|
| `terminal/h1` | 48px | 120% (57.6px) | **Bold (700)** |
| `terminal/h2` | 32px | 130% (41.6px) | **Bold (700)** |
| `terminal/h3` | 24px | 130% (31.2px) | **Semibold (600)** |
| `terminal/body-lg` | 18px | 160% (28.8px) | Regular (400) |
| `terminal/body` | 16px | 160% (25.6px) | Regular (400) |
| `terminal/prompt` | 16px | 160% (25.6px) | Regular (400) |
| `terminal/caption` | 14px | 140% (19.6px) | Regular (400) |
| `terminal/code` | 14px | 140% (19.6px) | Regular (400) |

> **Nota**: `prompt` y `output` son patrones visuales específicos de la metáfora terminal. Ver patrón detallado en Sección 7.

---

### Espaciados

No se declaran variables de espaciado explícitas en los SVG. Los espaciados se infieren de las coordenadas de los elementos dentro de los layouts.

**Patrones de espaciado observados:**
- Padding top/bottom de sección: `~40px`
- Gap entre elementos internos estimado: `8px`, `16px`, `24px`, `32px`

---

### Grid y Estructura de SVGs

Los archivos `Desktop.svg`, `Tablet.svg` y `Phone.svg` **no representan una sola pantalla** sino el **flujo completo del portfolio**: todas las vistas/pantallas del sitio dispuestas una al lado de la otra en el canvas de Figma, para representar el recorrido completo del usuario.

| Archivo SVG | Viewport de cada vista | N.º de vistas | Sidebar | NAV.EXE |
|---|---|---|---|---|
| `Desktop.svg` | `1440 × 1024px` | 6 | ✅ Sí | Panel lateral fijo (`ui/panel-nav`) |
| `Tablet.svg` | `768 × 1024px` | 6 | ❌ No | Sin sidebar — mismo layout y comportamiento que Phone (hamburger `≡`) |
| `Phone.svg` | `402 × 874px` | 6 | ❌ No | Hamburger menu (`≡`) |

**Las 6 vistas en cada SVG corresponden a las 6 secciones del portfolio:**
1. Bienvenida
2. Ninin
3. Proyectos
4. About
5. Contacto
6. Help

#### Arquitectura de layouts

**Desktop (1440px):**
- Tiene **sidebar** fijo con el `ui/panel-nav` (NAV.EXE)
- El contenido principal ocupa el resto del ancho

**Tablet (768px) y Phone (402px):**
- **Sin sidebar** — comparten la misma estructura de layout y el mismo comportamiento de navegación
- La única diferencia entre ambos es el ancho del viewport
- El `ui/panel-nav` se accede mediante el **hamburger menu (`≡`)** en ambos breakpoints — confirmado por el autor

---

### Border Radius

Valor único para toda la implementación: **`4.5px`**.

- El `rx="5"` presente en los swatches de `Guia_de_estilo.svg` corresponde únicamente a los rectángulos decorativos de la propia guía de estilos, no es un token del design system.
- En la implementación se usa exclusivamente `border-radius: 4.5px` para todos los componentes con bordes redondeados.

---

### Stroke / Borde de Ventana

El `border/dim` (`#3d3d3d`) presente en todos los layouts **emula los bordes que tenían los sistemas operativos antiguos** ✅. Decorativo e intencional. El grosor en los SVG es `stroke-width: 0.64`.

---

### Iconografía

**No se usa ninguna librería de íconos** ✅. La interfaz emula un OS antiguo utilizando **caracteres de teclado estándar** (ASCII art, símbolos tipográficos como `$`, `>`, `_`, `|`, `[`, `]`, etc.). Todo lo que simula íconos o gráficos es texto monoespaciado (IBM Plex Mono).

Ejemplos del sistema:
- `$` — símbolo de prompt de comando → color `#8b2323` (acento)
- `>` — símbolo de output/respuesta → color `#5a6b7a` (terciario)
- Caracteres ASCII → logo del portfolio y foto del autor

---

## 2. Lista de Design Tokens

### Colores

```css
/* === GRUPO bg === */
--bg-terminal:    #0a0a0a;   /* Background principal del OS/terminal */
--bg-panel:       #111;      /* Background de paneles */
--bg-hover:       #1a1a1a;   /* Estado hover de elementos interactivos */

/* === GRUPO fg === */
--fg-primary:     #8b2323;   /* Acento principal — active, símbolo $ en prompt */
--fg-secondary:   #6b7a5a;   /* Color secundario — resalte extra */
--fg-tertiary:    #5a6b7a;   /* Color terciario — negativo del acento, símbolo > en output */
--fg-text:        #c4c4c4;   /* Texto principal del sistema */
--fg-text-muted:  #6b6b6b;   /* Texto atenuado */
--fg-dim:         #3a3a3a;   /* Elementos visuales atenuados */

/* === GRUPO border === */
--border-default: #8b2323;   /* Borde de acento (igual que fg/primary) */
--border-dim:     #3d3d3d;   /* Borde estético de ventana OS */
```

### Tipografía

```css
/* Familia */
--font-family: 'IBM Plex Mono', monospace;  /* Grupo Figma: terminal */

/* Tokens tipográficos — nombres, tamaños y pesos confirmados */
/* terminal/h1       */ font-size: 48px; line-height: 1.2;  font-weight: 700;
/* terminal/h2       */ font-size: 32px; line-height: 1.3;  font-weight: 700;
/* terminal/h3       */ font-size: 24px; line-height: 1.3;  font-weight: 600;
/* terminal/body-lg  */ font-size: 18px; line-height: 1.6;  font-weight: 400;
/* terminal/body     */ font-size: 16px; line-height: 1.6;  font-weight: 400;
/* terminal/prompt   */ font-size: 16px; line-height: 1.6;  font-weight: 400;
/* terminal/caption  */ font-size: 14px; line-height: 1.4;  font-weight: 400;
/* terminal/code     */ font-size: 14px; line-height: 1.4;  font-weight: 400;
```

### Espaciados (inferidos)

```css
--space-1: ~8px;
--space-2: ~16px;
--space-3: ~24px;
--space-4: ~32px;
--space-5: ~40px;
```

### Tamaños / Grid

```css
/* Breakpoints — confirmados */
--breakpoint-desktop: 1440px;  /* Viewport: 1440 × 1024 */
--breakpoint-tablet:  768px;   /* Viewport: 768 × 1024 */
--breakpoint-phone:   402px;   /* Viewport: 402 × 874 */

/* Anchos del sidebar */
--layout-sidebar-desktop: ~680px;
--layout-sidebar-tablet:  ~342px;
/* Sin sidebar en phone */
```

### Radios

```css
--radius-component: 4.5px;   /* Componentes */
--radius-swatch:    5px;     /* Swatches guía estilos */
```

### Stroke / Border

```css
--stroke-divider: #3d3d3d;
--stroke-accent:  #8b2323;
--stroke-width:   0.64px;    /* Confirmado en todos los layouts */
```

## 3. Inventario de Componentes Simples

Componentes atómicos identificados desde `Componentes_Simples.svg`. **Nombres oficiales de Figma** confirmados por el autor:

| Nombre Figma | Descripción |
|---|---|
| `ui/btn` | Botón ASCII con corchetes |
| `ui/progress-bar` | Barra de progreso ASCII |
| `cmd/prompt` | Línea de comando con `$` |
| `cmd/output` | Línea de respuesta con `>` |
| `ui/separator` | Separador / divisor visual |
| `ui/input-line` | Campo de entrada de texto |
| `fx/cursor` | Cursor del mouse (bloque rojo) |

---

### `cmd/output`
- **Descripción**: Línea de respuesta del sistema tipo terminal
- **Patrón visual**: `> resultado`
- **Estructura**:
  - Símbolo `>` en `fg/tertiary` (`#5a6b7a`)
  - Texto a continuación en `fg/text` (`#c4c4c4`)
- **Tipografía**: `terminal/body` o `terminal/code`

---

### `cmd/prompt`
- **Descripción**: Línea de entrada de comando tipo terminal
- **Patrón visual**: `$ whoisninin`
- **Estructura**:
  - Símbolo `$` en `fg/primary` (`#8b2323`)
  - Texto a continuación en `fg/text` (`#c4c4c4`)
- **Tipografía**: `terminal/prompt`

---

### `fx/cursor`
- **Descripción**: Cursor del mouse, representado como un bloque sólido
- **Patrón visual**: Bloque rojo sólido rectangulado
- **Color**: `fg/primary` (`#8b2323`)
- **Prefijo `fx/`**: Indica que es un efecto visual / elemento de animación

---

### `ui/input-line`
- **Descripción**: Campo de entrada de texto tipo terminal
- **Patrón visual**: `Input: ` seguido de línea punteada
- **Estructura**:
  - Etiqueta `Input:` en `fg/text` (`#c4c4c4`)
  - Línea punteada/discontinua como área de entrada
- **Tipografía**: `terminal/prompt`

---

### `ui/separator`
- **Descripción**: Línea horizontal divisora que aparece **entre las `ui/preview-card`** en el listado de proyectos
- **Patrón visual**: Línea horizontal delgada a ancho completo del contenedor
- **Variantes confirmadas**:

| Variante | Color de línea |
|---|---|
| Default | `border/dim` (`#3d3d3d`) |
| Active | `fg/primary` (`#8b2323`) — color de acento |

- **Uso**: Separa visualmente cada tarjeta de proyecto en la sección `la proyectos`

---

### `ui/btn`
- **Descripción**: Botón de acción estilo ASCII con corchetes
- **Patrón visual**: `[ Contactar ]`
- **Estructura**: Texto envuelto en corchetes `[` `]`
- **Variantes confirmadas**:

| Variante | Fondo | Texto | Borde |
|---|---|---|---|
| Default | Transparente | `fg/text` (`#c4c4c4`) | `border/dim` (`#3d3d3d`) punteado |
| Hover | `bg/hover` (`#1a1a1a`) | `fg/text` | `border/dim` |
| Active | `fg/primary` (`#8b2323`) | `fg/text` o `bg/terminal` | `border/default` (`#8b2323`) |

- **Tipografía**: `terminal/body` o `terminal/caption`
- **`border-radius`**: `4.5px`

---

### `ui/progress-bar`
- **Descripción**: Barra de progreso estilo ASCII con porcentaje
- **Patrón visual**: `[████░░░░] 75%`
- **Estructura**:
  - Corchete de apertura `[` en `fg/text`
  - Bloques rellenos en `fg/primary` (`#8b2323`)
  - Bloques vacíos en `fg/dim` (`#3a3a3a`) o `bg/panel`
  - Corchete de cierre `]` en `fg/text`
  - Porcentaje a la derecha en `fg/text` o `fg/text-muted`
- **Estados confirmados**: 0% / 25% / 50% / 75% / 100%
- **Tipografía**: `terminal/code`

---

### Sombras

```css
/* Sin tokens de sombra — El diseño no usa sombras */
```

---

## 4. Inventario de Componentes Compuestos

Componentes compuestos identificados desde `Componentes_Compuestos.svg`. Todos tienen **variante Desktop y variante Mobile**. El canvas es largo precisamente por contener ambas variantes de cada componente.

**Nombres oficiales en Figma** (confirmados por el autor):

| Nombre Figma | Descripción |
|---|---|
| `ui/panel` | Panel general / contenedor de sección |
| `ui/nav-option` | Ítem individual de navegación |
| `ui/preview-card` | Tarjeta de proyecto (desktop) |
| `ui/preview-card-mobile` | Tarjeta de proyecto (mobile) |
| `ui/panel-main` | Panel principal de contenido |
| `ui/window/detail` | Ventana de detalle de proyecto |
| `ui/panel-nav` | Panel de navegación NAV.EXE |

---

### `ui/nav-option`
- **Descripción**: Ítem individual de navegación con número de índice
- **Patrón visual**: `[1] ninin`
- **Estructura**:
  - Número entre corchetes `[1]` en `fg/primary` (`#8b2323`)
  - Texto del link en `fg/text` (`#c4c4c4`)
- **Estados confirmados**:

| Estado | Fondo | Texto |
|---|---|---|
| Default | Transparente | `fg/text` |
| Active / Seleccionado | `fg/primary` (`#8b2323`) | `fg/text` o `bg/terminal` |

- **Links confirmados**: `ninin` / `la proyectos` / `sobre_mi` / `mail contacto` / `man ayuda`
- **Tipografía**: `terminal/body`

---

### `ui/panel-nav`
- **Descripción**: Panel de navegación principal (NAV.EXE), conceptualizado como ejecutable de SO antiguo
- **Corrección confirmada por el autor** ✅: `ui/panel-nav` **NO tiene controles de ventana** (`- □ ×`). Solo muestra el título `NAV.EXE` en su cabecera. Los controles `- □ ×` son exclusivos de `ui/window/detail`.
- **Variantes**:

**Desktop / Tablet:**
- Cabecera con título `NAV.EXE` (sin controles de ventana)
- Lista de 5 `ui/nav-option`
- Numeración: `[1]` a `[5]`
- Fondo: `bg/panel` (`#111`)
- Borde: `border/dim` (`#3d3d3d`)

**Mobile (Phone):**
- Mismo título `NAV.EXE`
- Mismo contenido de lista
- El trigger en el Phone SVG es el **hamburger menu (`≡`)** que al abrirse despliega este panel

---

### `ui/preview-card` y `ui/preview-card-mobile`
- **Descripción**: Tarjeta de proyecto en el listado de proyectos
- **Patrón visual**: Thumbnail + nombre + descripción + acciones
- **Estructura**:
  - Thumbnail/imagen del proyecto (bloque `fg/primary` como placeholder)
  - Nombre del proyecto (ej. `proyecto_01.tgz.gz`) en `fg/text`
  - Descripción (ej. `Diseño Web | 2024`) en `fg/text-muted`
  - Botón `[ Ver ]` y botón `[ Preview ]` (CS-06 Button)
- **Variantes**:
  - `ui/preview-card` — Desktop: layout horizontal
  - `ui/preview-card-mobile` — Mobile: layout vertical/apilado
- **`border-radius`**: `4.5px`
- **Borde**: `border/dim` (`#3d3d3d`)

---

### `ui/window/detail`
- **Descripción**: Ventana de detalle de proyecto, conceptualizada como ejecutable de SO
- **Patrón visual**: Frame de ventana con título `PROYECTO_01.EXE`, controles (`- □ ×`), y área de contenido
- **Estructura**:
  - Barra de título: nombre del proyecto (ej. `PROYECTO_01.EXE`) + **controles funcionales** (`_` `□` `×`) en `fg/primary`
  - `_` — minimiza la ventana
  - `□` — maximiza la ventana
  - `×` — cierra la ventana
  - Área de contenido: fondo `bg/panel` (`#111`), espacio para imagen/media del proyecto
- **Variantes**: Desktop (más grande) / Mobile (más estrecho, mismo concepto)
- **Borde**: `border/dim` (`#3d3d3d`)
- **`border-radius`**: `4.5px`

---

### `ui/panel-main`
- **Descripción**: Panel principal de contenido de cada sección
- **Propósito**: Contenedor principal donde se renderiza el contenido de cada pantalla del portfolio
- **Variantes**: Desktop / Mobile
- **Fondo**: `bg/panel` (`#111`)
- **Borde**: `border/dim` (`#3d3d3d`)

---

### `ui/panel`
- **Descripción**: Panel general / contenedor de sección
- **Propósito**: Wrapper o contenedor de alto nivel que agrupa otros componentes en una vista
- **Variantes**: Desktop / Mobile

---

> **Nota de nomenclatura de secciones** (confirmados desde los `ui/nav-option`):
> - `[1] ninin` → sección Ninin
> - `[2] la proyectos` → sección Proyectos
> - `[3] sobre_mi` → sección About
> - `[4] mail contacto` → sección Contacto
> - `[5] man ayuda` → sección Help
>
> La sección **Bienvenida** es la pantalla inicial (no listada en el nav, es el estado por defecto al cargar).

---

## 5. Componentes Reutilizables

| Componente | Aparece en | Evidencia |
|---|---|---|
| **Title Bar / Window Controls** | Desktop, Tablet, Phone, Compuestos, Simples | Mismo patrón SVG en todos los archivos |
| **Navbar** | Desktop, Tablet, Phone, Compuestos | 3 breakpoints con adaptación de ancho |
| **Panel lateral / Sidebar** | Desktop | Sidebar fijo — solo en Desktop (680px). Tablet y Phone usan hamburger overlay. |
| **Divider horizontal** | Desktop, Tablet, Phone | Línea fill `#3d3d3d`, 1px de altura |
| **Dot Indicators** | Desktop, Simples, Compuestos | Patrón circular repetitivo idéntico |
| **Texto de acento** | Compuestos, layouts | Texto en `#8b2323` para elementos destacados |

---

## 6. Jerarquía Visual del Sitio

### Niveles de importancia visual

1. **Nivel 1 — Identidad / Brand**: Nombre o logo del portfolio. Mayor jerarquía. Color `#fff` sobre `#0a0a0a`.
2. **Nivel 2 — Navegación**: Links del Navbar. Color `#c4c4c4`, tamaño menor.
3. **Nivel 3 — Hero / Titular**: Título y subtítulo de presentación. Máximo tamaño tipográfico.
4. **Nivel 4 — Contenido de sección**: Texto principal de cada sección. `#fff` / `#c4c4c4`.
5. **Nivel 5 — Soporte visual**: Íconos, indicadores, separadores. `#3d3d3d` / `#6b6b6b`.
6. **Nivel 6 — Acento interactivo**: CTAs, links activos, elementos de atención. `#8b2323`.

### Estructura de lectura

El diseño usa un **patrón de lectura en Z**: de izquierda a derecha (navbar) → diagonal hacia el héroe → contenido de sección.

- El sidebar actúa como ancla vertical permanente (solo Desktop).
- La navegación horizontal dirige al usuario de sección en sección.

### Distribución de contenido — Desktop (secciones por coordenada X)

| Sección | Posición X | Ancho | Contenido inferido |
|---|---|---|---|
| Sidebar | 0–680px | ~680px | Panel lateral fijo |
| Vista 1 | 720–2160px | 1440px | Hero / presentación |
| Vista 2 | 2200–3640px | 1440px | About |
| Vista 3 | 3680–5120px | 1440px | Experience |
| Vista 4 | 5160–6600px | 1440px | Projects |
| Vista 5 | 6640–8080px | 1440px | Contact u otra |
| Vista 6 | 8120–9560px | 1440px | Footer u otra |

### Prioridades visuales

- **Alto contraste** como principio rector: blanco sobre negro puro.
- **Un solo acento cromático** (`#8b2323`) para focalizar la atención.
- **Diseño plano sin profundidad**: sin sombras, sin gradientes, sin glassmorphism.

---

## 7. Patrones de Diseño Identificados

### Patrones de navegación

- **Horizontal slide navigation**: Las secciones se organizan horizontalmente. La navegación es lateral, no vertical.
- **Fixed sidebar**: Panel lateral fijo (solo Desktop) que actúa como ancla durante toda la experiencia. Tablet y Phone usan hamburger menu `≡` con el mismo comportamiento.
- **Window-style UI metaphor**: La interfaz simula una ventana de escritorio/IDE con controles de ventana en la esquina superior izquierda.

### Patrones de layout

- **Full-viewport sections**: Cada sección ocupa exactamente el viewport completo (1440×1024 en Desktop).
- **Two-column layout (Desktop)**: Sidebar fijo a la izquierda + área de contenido a la derecha.
- **Single-column (Phone)**: Sin sidebar, contenido en columna única.

### Patrones de interacción

- **Navegación directa por selección en NAV.EXE** ✅: El usuario selecciona una sección en el NAV.EXE y va directo a ella con una animación instantánea ("de una").
- **Estado hover**: Fondo `#1a1a1a` en elementos interactivos ✅.
- **Estado active**: Color de acento `#8b2323` ✅.
- **Dot indicators como indicador de sección activa**: CS-04 indica la sección en foco.
- **Metáfora NAV.EXE**: El elemento de navegación está conceptualizado como un ejecutable de SO antiguo.

**Patrón Prompt / Output** ✅ (confirmado por el autor):

| Elemento | Símbolo | Color del símbolo | Color del texto |
|---|---|---|---|
| `prompt` | `$` | `#8b2323` (acento) | `#c4c4c4` (text) |
| `output` | `>` | `#5a6b7a` (terciario) | `#c4c4c4` (text) |

Ejemplo visual:
```
$ whoisninin          ← $ en #8b2323, resto en #c4c4c4
> Jesús Ninin, ...    ← > en #5a6b7a, resto en #c4c4c4
```

En algunos contextos el texto usa `#6b6b6b` (text-muted) en lugar del color de texto principal.

### Patrones de composición visual

- **Minimalismo radical**: Sin gradientes, sin sombras, sin ornamentos. 100% plano.
- **Alto contraste deliberado**: `#fff` sobre `#0a0a0a`.
- **Acento monocromático**: Un único color de acento (`#8b2323`) para todos los elementos destacados.
- **Ritmo tipográfico y de puntos**: Los dot indicators crean ritmo visual repetitivo.

---

## 8. Observaciones Relevantes

1. **Metáfora de OS antiguo como concepto central** ✅: Todo el portfolio simula un sistema operativo retro. El NAV.EXE es la barra de navegación conceptualizada como ejecutable. Las secciones son "pantallas" dentro de ese OS. No se usan íconos externos — todo se construye con caracteres ASCII e IBM Plex Mono.

2. **Logo y foto del autor en ASCII art**: El logo del portfolio (sección Bienvenida) y la foto del autor (sección Ninin) están construidos con caracteres de teclado, sin imágenes rasterizadas.

3. **Texto completamente vectorizado**: Figma exportó todos los textos como paths SVG. La tipografía (`IBM Plex Mono`) y todos los datos tipográficos fueron confirmados directamente por el autor.

4. **Los colores variados en Componentes_Compuestos.svg son foto vectorizada**: Los cientos de colores únicos no son tokens del design system. Son la foto ASCII del autor convertida a vector por Figma.

5. **Coherencia perfecta entre breakpoints**: Desktop (1440×1024), Tablet (768×1024) y Phone (402×874) usan exactamente los mismos colores, `stroke-width: 0.64` y el mismo concepto de window-frame.

6. **Stroke `#3d3d3d` como borde estético de OS retro** ✅: El borde visible en todos los frames emula los bordes que tenían los sistemas operativos antiguos. Es decorativo e intencional.

7. **Estados interactivos de 3 niveles**: Default (sin fondo visible) → Hover (`#1a1a1a`) → Active (`#8b2323`). Aplica a los links del NAV.EXE al menos.

8. **Sistema de roles de color semántico** ✅: Acento (`#8b2323`) = prompt `$` y estado active. Terciario (`#5a6b7a`) = output `>`. Secundario (`#6b7a5a`) = resalte adicional. Los roles tienen significado narrativo dentro de la metáfora terminal.

9. **6 secciones confirmadas**: Bienvenida, Ninin, Proyectos, About, Contacto, Help — una más de lo estimado inicialmente (se inferían 6 frames pero no se confirmaban sus nombres).

10. **`prompt` y `output` son patrones visuales, no solo tipográficos**: `prompt` lleva siempre `$` en acento + texto. `output` lleva siempre `>` en terciario + texto. Son el lenguaje visual central de la interfaz.

---

## 9. Posibles Inconsistencias

1. **`rx="5"` (guía) vs `rx="4.5"` (componentes)**: Valores casi idénticos pero técnicamente distintos. Podría ser intencional o un descuido menor.

2. **Tres fondos oscuros similares** (`#0a0a0a`, `#111`, `#1a1a1a`): No está claro si son tres tokens distintos con roles específicos o si existe solapamiento/inconsistencia en su uso.

3. **Dos grises medio-oscuros similares** (`#3a3a3a` vs `#3d3d3d`): Ambos aparecen como swatches en la guía pero con diferencia de solo 3 puntos en el canal R y G. El riesgo de confusión al implementar es alto.

4. **Gap de 40px entre sidebar y primer frame**: El sidebar termina en X=680 y el primer frame de contenido inicia en X=720. El propósito de este gap no está documentado.

5. **`#5a6b7a` y `#6b7a5a` sin uso confirmado**: Aparecen como swatches en la guía de estilos pero no se detectaron en ningún layout ni componente. Su rol es desconocido.

6. **`#6b6b6b` sin uso confirmado en layouts**: Presente en la guía de estilos pero no detectado en los SVG de página.

---

## 10. Dudas o Información a Confirmar

> Todas las dudas principales han sido **resueltas**. Solo quedan preguntas menores de implementación.

| ID | Estado | Pregunta | Razón |
|---|---|---|---|
| **D1** | ✅ Resuelto | Tipografía: **IBM Plex Mono** | Confirmada |
| **D2** | ✅ Resuelto | Escala tipográfica completa (tamaños, line-heights, font-weights) | Confirmada |
| **D3** | ✅ Resuelto | Breakpoints: 1440×1024 / 768×1024 / 402×874 | Confirmados |
| **D4** | ✅ Resuelto | Navegación por selección en NAV.EXE con transición animada | Confirmado |
| **D5** | ✅ Corregido | Los controles `_` `□` `×` de `ui/window/detail` son **funcionales**: minimizar, maximizar y cerrar la ventana. `ui/panel-nav` **no tiene** controles de ventana. | Confirmado por el autor |
| **D6** | ✅ Resuelto | Hover: `#1a1a1a`. Active: `#8b2323` | Confirmados |
| **D7** | ✅ Resuelto | `#5a6b7a` = terciario (negativo del acento). `#6b7a5a` = secundario (resalte extra) | Confirmados |
| **D8** | ✅ Resuelto | 6 secciones: **Bienvenida, Ninin, Proyectos, About, Contacto, Help** | Confirmadas |
| **D9** | ✅ Resuelto | Sin librería de íconos — todo es **ASCII / caracteres de teclado** | Confirmado |
| **D10** | ✅ Resuelto | `stroke-width: 0.64` emula bordes de OS antiguos (decorativo intencional) | Confirmado |
| **D11** | ✅ Resuelto | Font-weights: Bold (h1, h2) / Semibold (h3) / Regular (body-lg y menores) | Confirmados |
| **D12** | ✅ Resuelto | `prompt` = línea con `$` (acento) + texto. `output` = línea con `>` (terciario) + texto | Confirmado |
> Todas las dudas han sido **resueltas**. El design system está completamente documentado.

| ID | Estado | Pregunta | Razón |
|---|---|---|---|
| **D1–D12** | ✅ Resueltos | Tipografía, escala, pesos, breakpoints, navegación, estados, colores, secciones, íconos, stroke, patrón prompt/output | Todos confirmados por el autor |
| **D13** | ✅ Resuelto | `#fff` **no es un token de paleta**. No hay swatch blanco en la guía. El texto más claro es `fg/text` (`#c4c4c4`) | Confirmado por inspección directa del SVG y por la imagen de variables de Figma |
| **D14** | ✅ Resuelto | `fg/text-muted` (`#6b6b6b`) es un token oficial con nombre confirmado en Figma | Confirmado por las capturas de variables del autor |
