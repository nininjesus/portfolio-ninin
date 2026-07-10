# Fase 3 — Definición de Componentes: Portfolio Ninin

> Basado en `design_analysis.md` (Fase 1) y `architecture.md` (Fase 2).  
> **Stack**: Astro 7 · HTML5 · CSS3 · JavaScript vanilla  
> **Restricción estricta**: Sin React, Vue, Svelte, Tailwind, ni ningún framework o librería CSS.

---

## 1. Árbol de Composición

El árbol representa la jerarquía de instanciación en tiempo de build de Astro. Las flechas indican relación padre → hijo.

```
BaseLayout.astro
├── <head>                             (SEO, meta, @font-face, tokens.css, global.css)
├── SectionTransition.astro            (overlay global — siempre en DOM)
│   └── ProgressBar.astro
│
└── <body>
    ├── PanelNav.astro                 (sidebar persistente — fuera del flujo de secciones)
    │   └── NavOption.astro × 5        (generados con .map() sobre navigation.js)
    │
    └── <main>  ← slot de index.astro
        ├── SectionBienvenida.astro
        │   └── Panel.astro
        │       └── PanelMain.astro
        │           ├── Prompt.astro   ("$ whoisninin")
        │           └── Output.astro   ("> _" + Cursor.astro)
        │               └── Cursor.astro
        │
        ├── SectionNinin.astro
        │   └── Panel.astro
        │       └── PanelMain.astro
        │           ├── Prompt.astro   ("$ ninin")
        │           ├── Output.astro   ("> _" + Cursor.astro)
        │           │   └── Cursor.astro
        │           ├── <blockquote>   (cita del autor)
        │           ├── <nav>          (links sociales: GitHub, LinkedIn)
        │           └── <figure>       (foto SVG del autor)
        │
        ├── SectionProyectos.astro
        │   └── Panel.astro
        │       └── PanelMain.astro
        │           ├── Separator.astro (tope de lista)
        │           ├── PreviewCard.astro × n     (desktop — generados con .map())
        │           │   └── Btn.astro × 2         ("[ Ver ]" / "[ Preview ]")
        │           ├── PreviewCardMobile.astro × n (mobile — generados con .map())
        │           │   └── Btn.astro × 2
        │           ├── Separator.astro (cierre de lista)
        │           └── WindowDetail.astro
        │
        ├── SectionAbout.astro
        │   └── Panel.astro
        │       └── PanelMain.astro
        │           ├── Prompt.astro
        │           └── Output.astro × n
        │
        ├── SectionContacto.astro
        │   └── Panel.astro
        │       └── PanelMain.astro
        │           ├── Prompt.astro
        │           ├── Output.astro
        │           ├── InputLine.astro
        │           └── Btn.astro      ("[ Enviar ]")
        │
        └── SectionHelp.astro
            └── Panel.astro
                └── PanelMain.astro
                    ├── Prompt.astro
                    └── Output.astro × n
```

---

## 2. Inventario Completo de Componentes

El sistema está compuesto por **20 componentes** organizados en 3 capas de abstracción:

| Capa | Cantidad | Componentes |
|---|---|---|
| `primitives/` — Átomos | 7 | `Btn`, `ProgressBar`, `Prompt`, `Output`, `Separator`, `InputLine`, `Cursor` |
| `ui/` — Compuestos | 7 | `NavOption`, `PanelNav`, `PreviewCard`, `PreviewCardMobile`, `WindowDetail`, `PanelMain`, `Panel` |
| `sections/` — Secciones | 7 | `SectionBienvenida`, `SectionNinin`, `SectionProyectos`, `SectionAbout`, `SectionContacto`, `SectionHelp`, `SectionTransition` |

> **Nota**: `BaseLayout.astro` no figura como componente sino como **layout raíz**. `index.astro` es la **página** que ensambla las secciones.

---

## 3. Primitives — Definición Detallada

---

### 3.1 `Btn`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/primitives/Btn.astro` |
| **CSS** | `src/styles/components/btn.css` |
| **Nombre Figma** | `ui/btn` |
| **Nivel de reutilización** | Alto — aparece en `SectionProyectos` y `SectionContacto` |

**Descripción**  
Botón de acción estilo ASCII. El texto aparece envuelto en corchetes: `[ Contactar ]`. No usa `<button>` como ornamento — **sí** es semánticamente un `<button>` o un `<a>` según el contexto.

**Responsabilidad**  
Renderizar un elemento interactivo clicable con los 3 estados visuales del design system (default, hover, active). No gestiona lógica de negocio — delega eventos al componente padre.

**Props recomendadas**

| Prop | Tipo | Requerida | Default | Descripción |
|---|---|---|---|---|
| `label` | `string` | ✅ | — | Texto interior del botón (sin corchetes — se agregan en el template) |
| `href` | `string` | ❌ | `undefined` | Si se pasa, el elemento raíz es `<a>` en lugar de `<button>` |
| `variant` | `'default' \| 'active'` | ❌ | `'default'` | Variante visual inicial |
| `type` | `'button' \| 'submit' \| 'reset'` | ❌ | `'button'` | Tipo de botón (solo aplica cuando no hay `href`) |
| `ariaLabel` | `string` | ❌ | `undefined` | Texto accesible cuando el `label` no es suficientemente descriptivo |

**Variantes**

| Variante | Fondo | Color texto | Borde |
|---|---|---|---|
| `default` | Transparente | `--fg-text` (`#c4c4c4`) | `--border-dim` (`#3d3d3d`) punteado |
| `hover` (CSS `:hover`) | `--bg-hover` (`#1a1a1a`) | `--fg-text` | `--border-dim` |
| `active` (prop) | `--fg-primary` (`#8b2323`) | `--fg-text` o `--bg-terminal` | `--border-default` (`#8b2323`) |

**Componentes hijos**  
Ninguno.

**Dependencias**  
Tokens: `--fg-text`, `--fg-primary`, `--bg-hover`, `--bg-terminal`, `--border-dim`, `--border-default`, `--radius-component`.

**Datos para `map()`**  
No aplica directamente. Los padres lo instancian explícitamente.

**Estados visuales**  
`default` → `hover` → `active`. El estado hover es puramente CSS (`:hover`). El estado active puede ser CSS (`:active`) o controlado por prop para el estado persistente.

**Accesibilidad**
- Usar `<button type="button">` por defecto; `<a href>` solo cuando navega a una URL.
- Si el `label` es críptico (e.g., `"[ Ver ]"` sin contexto), añadir `aria-label="Ver proyecto {título}"`.
- Asegurar `outline` de foco visible al navegar con teclado (no eliminar con `outline: none`).
- Relación de contraste mínima WCAG AA entre texto y fondo en todos los estados.

---

### 3.2 `ProgressBar`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/primitives/ProgressBar.astro` |
| **CSS** | `src/styles/components/progress-bar.css` |
| **Nombre Figma** | `ui/progress-bar` |
| **Nivel de reutilización** | Bajo — usado únicamente en `SectionTransition` para emular la carga del OS |

**Descripción**  
Barra de progreso ASCII. Patrón visual: `[████░░░░] 75%`. Los bloques rellenos usan caracteres Unicode `█` y los vacíos `░`.

**Responsabilidad**  
Renderizar una representación visual de progreso entre 0% y 100%. En `SectionTransition` representa la transición de pantalla; en `SectionAbout` representa el nivel de una habilidad.

**Props recomendadas**

| Prop | Tipo | Requerida | Default | Descripción |
|---|---|---|---|---|
| `value` | `number` | ✅ | — | Porcentaje de progreso (0–100) |
| `label` | `string` | ❌ | `undefined` | Etiqueta descriptiva opcional (e.g., nombre de habilidad) |
| `showPercent` | `boolean` | ❌ | `true` | Mostrar el valor numérico del porcentaje |
| `animated` | `boolean` | ❌ | `false` | Si es `true`, activa la animación de llenado (para `SectionTransition`) |
| `totalBlocks` | `number` | ❌ | `20` | Número total de caracteres de la barra (rellenos + vacíos) |

**Variantes**  
No tiene variantes de diseño. La variación es por datos (`value`) y contexto de uso (`animated`).

**Componentes hijos**  
Ninguno.

**Dependencias**  
Tokens: `--fg-primary`, `--fg-dim`, `--fg-text`, `--fg-text-muted`.  
Animación: `@keyframes` definido en `animations.css` (si `animated: true`).

**Datos para `map()`**  
No aplica. Es un componente de instancia única dentro de `SectionTransition`.

**Estados visuales**  
Estático (renderiza el `value` en build time) o animado (CSS animation de 0 a `value`%).

**Accesibilidad**
- Usar `role="progressbar"` en el elemento raíz.
- Añadir `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`.
- Si tiene `label`, asociarlo con `aria-label` o `aria-labelledby`.

---

### 3.3 `Prompt`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/primitives/Prompt.astro` |
| **CSS** | `src/styles/components/prompt.css` |
| **Nombre Figma** | `cmd/prompt` |
| **Nivel de reutilización** | Alto — aparece en todas las secciones |

**Descripción**  
Línea de entrada de comando tipo terminal. Patrón visual: `$ whoisninin`. El símbolo `$` actúa como prompt del sistema; el texto siguiente es el "comando" introducido.

**Responsabilidad**  
Renderizar una línea de prompt inmutable. No es un campo de entrada real — es decorativo, representa el comando que "invocó" el contenido de la sección.

**Props recomendadas**

| Prop | Tipo | Requerida | Default | Descripción |
|---|---|---|---|---|
| `command` | `string` | ✅ | — | Texto del comando (sin el `$` — se agrega en el template) |

**Variantes**  
No tiene variantes visuales. El único token de color que cambia es el símbolo `$` (siempre `--fg-primary`).

**Componentes hijos**  
Ninguno.

**Dependencias**  
Tokens: `--fg-primary` (símbolo `$`), `--fg-text` (texto del comando).  
Tipografía: `terminal/prompt`.

**Datos para `map()`**  
No aplica.

**Estados visuales**  
Único estado (estático).

**Accesibilidad**
- El elemento raíz debe ser `<p>` o `<span>` dentro de un contexto semántico.
- El símbolo `$` debe estar dentro de un `<span aria-hidden="true">` para que los lectores de pantalla no lean el símbolo literalmente y solo lean el comando.
- Si se agrupa con un `Output`, envolver ambos en un `<section>` o `<div role="log">`.

---

### 3.4 `Output`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/primitives/Output.astro` |
| **CSS** | `src/styles/components/output.css` |
| **Nombre Figma** | `cmd/output` |
| **Nivel de reutilización** | Alto — aparece en todas las secciones |

**Descripción**  
Línea de respuesta del sistema tipo terminal. Patrón visual: `> Jesús Ninin, diseñador`. El símbolo `>` actúa como el prefijo de respuesta del sistema.

**Responsabilidad**  
Renderizar una línea de respuesta de terminal. Puede contener texto estático o alojar un `Cursor.astro` al final de la línea para el efecto de cursor activo.

**Props recomendadas**

| Prop | Tipo | Requerida | Default | Descripción |
|---|---|---|---|---|
| `text` | `string` | ❌ | `undefined` | Texto de respuesta (si no se usa slot) |
| `showCursor` | `boolean` | ❌ | `false` | Si es `true`, renderiza `Cursor.astro` al final del texto |

**Slot**  
Acepta un `<slot />` para permitir contenido HTML enriquecido en la respuesta (e.g., `<strong>`, `<a>`).

**Variantes**  
No tiene variantes de diseño. El símbolo `>` siempre usa `--fg-tertiary`.

**Componentes hijos**  
- `Cursor.astro` (condicional, cuando `showCursor: true`)

**Dependencias**  
Tokens: `--fg-tertiary` (símbolo `>`), `--fg-text` (texto de respuesta).  
Tipografía: `terminal/body` o `terminal/code`.

**Datos para `map()`**  
Las secciones pueden generar múltiples `Output` con `.map()` sobre un array de líneas de respuesta.

**Estados visuales**  
Estático, o con cursor parpadeante (delegado a `Cursor.astro`).

**Accesibilidad**
- El símbolo `>` dentro de un `<span aria-hidden="true">`.
- Si representa contenido semántico significativo, el texto que sigue debe ser accesible sin depender del símbolo.
- Cuando agrupa `Prompt` + `Output`, el grupo puede usar `aria-live="polite"` si el contenido cambia dinámicamente.

---

### 3.5 `Separator`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/primitives/Separator.astro` |
| **CSS** | `src/styles/components/separator.css` |
| **Nombre Figma** | `ui/separator` |
| **Nivel de reutilización** | Medio — principalmente en `SectionProyectos` |

**Descripción**  
Línea horizontal divisoria que separa visualmente los `PreviewCard` en el listado de proyectos.

**Responsabilidad**  
Renderizar un divisor visual semántico (`<hr>`) con estilo de línea delgada en el color correspondiente a la variante.

**Props recomendadas**

| Prop | Tipo | Requerida | Default | Descripción |
|---|---|---|---|---|
| `variant` | `'default' \| 'active'` | ❌ | `'default'` | Controla el color de la línea |

**Variantes**

| Variante | Color de línea | Uso |
|---|---|---|
| `default` | `--border-dim` (`#3d3d3d`) | Separación normal entre tarjetas |
| `active` | `--fg-primary` (`#8b2323`) | Separador de la tarjeta actualmente en foco |

**Componentes hijos**  
Ninguno.

**Dependencias**  
Tokens: `--border-dim`, `--fg-primary`, `--stroke-width`.

**Datos para `map()`**  
No aplica directamente. Se inserta intercalado dentro del `.map()` de proyectos en el padre.

**Estados visuales**  
`default` / `active`.

**Accesibilidad**
- Usar `<hr>` como elemento raíz (semántico de separación de secciones temáticas).
- Añadir `aria-hidden="true"` si es puramente decorativo y el orden de lectura no lo requiere.

---

### 3.6 `InputLine`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/primitives/InputLine.astro` |
| **CSS** | `src/styles/components/input-line.css` |
| **Nombre Figma** | `ui/input-line` |
| **Nivel de reutilización** | Bajo — usado exclusivamente en `SectionContacto` |

**Descripción**  
Campo de entrada de texto estilo terminal. Patrón visual: `Input: ___________` con línea punteada como indicador de área de texto.

**Responsabilidad**  
Renderizar un campo de formulario (`<input>` o `<textarea>`) con estética de terminal. Es el único primitivo funcional del sistema (interactivo real, no decorativo).

**Props recomendadas**

| Prop | Tipo | Requerida | Default | Descripción |
|---|---|---|---|---|
| `label` | `string` | ✅ | — | Etiqueta del campo (e.g., `"Nombre"`, `"Email"`, `"Mensaje"`) |
| `name` | `string` | ✅ | — | Atributo `name` del input para el formulario |
| `type` | `'text' \| 'email' \| 'textarea'` | ❌ | `'text'` | Tipo de campo |
| `placeholder` | `string` | ❌ | `undefined` | Texto de placeholder |
| `required` | `boolean` | ❌ | `false` | Si el campo es requerido en el formulario |

**Variantes**  
No tiene variantes de diseño documentadas. El foco (`focus`) aplica `--border-default` como borde activo.

**Componentes hijos**  
Ninguno.

**Dependencias**  
Tokens: `--fg-text`, `--fg-text-muted`, `--border-dim`, `--border-default`, `--bg-terminal`.  
Tipografía: `terminal/prompt`.

**Datos para `map()`**  
`SectionContacto` puede generar múltiples `InputLine` con `.map()` sobre un array de definición de campos del formulario.

**Estados visuales**  
`default` → `focus` → `filled` (con contenido).

**Accesibilidad**
- El elemento `<label>` debe estar **siempre visible** y asociado al `<input>` mediante `for`/`id`.
- No depender solo del `placeholder` como etiqueta.
- Indicar campos requeridos con `aria-required="true"` y señal visual.
- En caso de error de validación, usar `aria-describedby` apuntando al mensaje de error.

---

### 3.7 `Cursor`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/primitives/Cursor.astro` |
| **CSS** | `src/styles/components/cursor.css` |
| **Nombre Figma** | `fx/cursor` |
| **Nivel de reutilización** | Bajo — usado como hijo de `Output` en contextos específicos |

**Descripción**  
Cursor del terminal: bloque rectangular sólido de color `fg/primary` que parpadea. Prefijo `fx/` en Figma confirma que es un efecto visual / elemento de animación.

**Responsabilidad**  
Renderizar el bloque de cursor parpadeante. No recibe información — es puramente visual. La animación de parpadeo se define en `animations.css` (`@keyframes blink`).

**Props recomendadas**  
Ninguna. Es un componente sin estado y sin configuración.

**Variantes**  
Ninguna.

**Componentes hijos**  
Ninguno.

**Dependencias**  
Tokens: `--fg-primary`.  
Animación: `@keyframes blink` de `animations.css`.

**Datos para `map()`**  
No aplica.

**Estados visuales**  
Visible (lleno) ↔ Invisible (vacío) — ciclo continuo via CSS animation.

**Accesibilidad**
- Añadir `aria-hidden="true"` siempre — es un efecto puramente decorativo.
- `prefers-reduced-motion`: respetar la media query para detener la animación de parpadeo cuando el usuario lo prefiere.

---

## 4. UI — Compuestos: Definición Detallada

---

### 4.1 `NavOption`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/ui/NavOption.astro` |
| **CSS** | `src/styles/components/nav-option.css` |
| **Nombre Figma** | `ui/nav-option` |
| **Nivel de reutilización** | Alto — instanciado 5 veces dentro de `PanelNav` |

**Descripción**  
Ítem individual de navegación del NAV.EXE. Patrón visual: `[1] ninin`. El número entre corchetes es el índice de la sección; el texto es su nombre.

**Responsabilidad**  
Renderizar un link de navegación semántico (`<a>` o `<li><a>`) que apunta a la sección correspondiente. Gestiona su estado `active` cuando la sección que representa es la visible.

**Props recomendadas**

| Prop | Tipo | Requerida | Default | Descripción |
|---|---|---|---|---|
| `index` | `number` | ✅ | — | Número de ítem (1–5) |
| `label` | `string` | ✅ | — | Nombre de la sección (e.g., `"ninin"`) |
| `sectionId` | `string` | ✅ | — | ID de la sección destino (e.g., `"ninin"`) para el `href="#sectionId"` |
| `isActive` | `boolean` | ❌ | `false` | Si es `true`, aplica estilos de estado activo |

**Variantes**

| Estado | Fondo | Texto | Mecanismo |
|---|---|---|---|
| `default` | Transparente | `--fg-text` | CSS base |
| `hover` | `--bg-hover` | `--fg-text` | CSS `:hover` |
| `active` | `--fg-primary` | `--fg-text` o `--bg-terminal` | Prop `isActive` + clase CSS + `aria-current` |

**Componentes hijos**  
Ninguno.

**Dependencias**  
Datos: `navigation.js` (el padre `PanelNav` provee las props).  
Tokens: `--fg-primary`, `--fg-text`, `--bg-hover`, `--bg-terminal`.

**Datos para `map()`**  
`PanelNav` genera los 5 `NavOption` con `.map()` sobre el array `navigation.js`.

**Estados visuales**  
`default` / `hover` / `active`.

**Accesibilidad**
- Usar `aria-current="page"` en el ítem activo para indicar la sección en foco.
- El número entre corchetes `[1]` es decorativo; el lector de pantalla debe leer el label del link, no el número.
- Toda la lista de opciones debe estar en un `<nav aria-label="Navegación principal">` con la lista en `<ul>`.
- Navegación por teclado (`Tab`, `Enter`/`Space`) debe funcionar correctamente.

---

### 4.2 `PanelNav`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/ui/PanelNav.astro` |
| **CSS** | `src/styles/components/panel-nav.css` |
| **Nombre Figma** | `ui/panel-nav` |
| **Nivel de reutilización** | Único — instanciado una sola vez en `BaseLayout` |

**Descripción**  
Panel de navegación principal conceptualizado como ejecutable de OS antiguo: `NAV.EXE`. Muestra únicamente el título `NAV.EXE` en su cabecera — **sin controles de ventana** — seguido de la lista de `NavOption`.

**Responsabilidad**  
Renderizar el sidebar de navegación completo. En Desktop es un panel lateral fijo siempre visible. En Tablet y Phone se comporta igual: es un panel overlay que emerge al activar el hamburger menu `≡`.

**Props recomendadas**

| Prop | Tipo | Requerida | Default | Descripción |
|---|---|---|---|---|
| `activeSectionId` | `string` | ✅ | — | ID de la sección actualmente visible (para pasar `isActive` a los hijos) |
| `navItems` | `Array<{ index, label, sectionId }>` | ✅ | — | Array de ítems de navegación desde `navigation.js` |

**Variantes**
- **Desktop**: sidebar fijo, siempre visible.
- **Tablet y Phone**: mismo comportamiento — panel overlay que se muestra/oculta con JS al activar el hamburger `≡`.

**Componentes hijos**  
- `NavOption.astro × 5` (generados con `.map()`)

**Dependencias**  
Datos: `navigation.js`.  
Tokens: `--bg-panel`, `--border-dim`, `--fg-text`, `--fg-primary`.  
Layout: `--layout-sidebar-desktop` (~680px), `--layout-sidebar-tablet` (~342px).

**Datos para `map()`**  
Itera sobre `navItems` (array de `navigation.js`) para generar los `NavOption`.

```
navItems.map(item => <NavOption
  index={item.index}
  label={item.label}
  sectionId={item.sectionId}
  isActive={activeSectionId === item.sectionId}
/>)
```

**Estados visuales**
- Panel siempre visible (Desktop)
- Panel oculto / Panel visible (Tablet y Phone — mismo toggle por JS)

**Accesibilidad**
- El panel es un `<nav>` semántico con `aria-label="Navegación principal"`.
- En Tablet y Phone, el panel overlay debe tener `aria-hidden="true"` cuando está oculto.
- El botón hamburger `≡` debe ser un `<button aria-controls="panel-nav" aria-expanded="false/true">`.
- Cuando el panel se abre en Tablet o Phone, el foco debe moverse al interior del panel.
- Al cerrar, el foco debe regresar al botón hamburger.

---

### 4.3 `PreviewCard`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/ui/PreviewCard.astro` |
| **CSS** | `src/styles/components/preview-card.css` |
| **Nombre Figma** | `ui/preview-card` |
| **Nivel de reutilización** | Alto — instanciado por cada proyecto en Desktop |

**Descripción**  
Tarjeta de proyecto en layout horizontal (Desktop). Contiene thumbnail del proyecto, nombre, descripción/metadatos y botones de acción.

**Responsabilidad**  
Renderizar la representación visual de un proyecto individual en el listado. Maneja su propia visibilidad (visible solo en Desktop, oculto en Mobile con CSS).

**Props recomendadas**

| Prop | Tipo | Requerida | Default | Descripción |
|---|---|---|---|---|
| `id` | `string` | ✅ | — | Identificador único del proyecto (e.g., `"proyecto-01"`) |
| `title` | `string` | ✅ | — | Nombre del archivo del proyecto (e.g., `"proyecto_01.tgz.gz"`) |
| `description` | `string` | ✅ | — | Descripción corta del proyecto |
| `year` | `number` | ✅ | — | Año del proyecto |
| `category` | `string` | ✅ | — | Categoría (e.g., `"Diseño Web"`) |
| `thumbnailSrc` | `string` | ❌ | `undefined` | Ruta al thumbnail. Si es `undefined`, muestra bloque de color `fg/primary` |
| `urlView` | `string` | ❌ | `undefined` | URL del proyecto en vivo |
| `urlPreview` | `string` | ❌ | `undefined` | URL de preview/repositorio |

**Variantes**
- **Default**: Layout horizontal — imagen a la izquierda, info a la derecha.
- **Hover**: Fondo de la tarjeta cambia a `--bg-hover`.

**Componentes hijos**
- `Btn.astro` con `label="Ver"` (si `urlView` está definido)
- `Btn.astro` con `label="Preview"` (si `urlPreview` está definido)

**Dependencias**  
Datos: `projects.js`.  
Tokens: `--fg-text`, `--fg-text-muted`, `--fg-primary`, `--bg-panel`, `--bg-hover`, `--border-dim`, `--radius-component`.

**Datos para `map()`**  
`SectionProyectos` genera las `PreviewCard` con `.map()` sobre el array de `projects.js`.

**Estados visuales**  
`default` / `hover`. No tiene estado `active` propio (el `WindowDetail` se abre al hacer click).

**Accesibilidad**
- Cada tarjeta debe estar en un `<article>` con un `<h3>` (o el nivel jerárquico correcto) con el nombre del proyecto.
- Los botones `[ Ver ]` y `[ Preview ]` deben tener `aria-label="Ver proyecto {title}"` para dar contexto.
- La imagen thumbnail debe tener `alt` descriptivo. El bloque de color placeholder debe tener `alt=""` (decorativo).

---

### 4.4 `PreviewCardMobile`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/ui/PreviewCardMobile.astro` |
| **CSS** | `src/styles/components/preview-card.css` (puede compartir base) |
| **Nombre Figma** | `ui/preview-card-mobile` |
| **Nivel de reutilización** | Alto — instanciado por cada proyecto en Mobile |

**Descripción**  
Variante Mobile de `PreviewCard`. Layout vertical/apilado: el thumbnail ocupa todo el ancho y la información se posiciona debajo.

**Responsabilidad**  
Idéntica a `PreviewCard` pero con layout vertical. Se muestra solo en breakpoints de Tablet y Phone, oculta en Desktop mediante CSS.

**Props recomendadas**  
Idénticas a `PreviewCard`.

**Variantes**  
Sin variantes adicionales. La diferencia respecto a `PreviewCard` es exclusivamente de layout (vertical vs. horizontal).

**Componentes hijos**
- `Btn.astro × 2` (igual que `PreviewCard`)

**Dependencias**  
Idénticas a `PreviewCard`.

**Datos para `map()`**  
`SectionProyectos` genera ambas (`PreviewCard` y `PreviewCardMobile`) con el mismo `.map()`. El CSS controla cuál es visible según breakpoint.

**Estados visuales**  
Idénticos a `PreviewCard`.

**Accesibilidad**
- Si ambas tarjetas están en el DOM simultáneamente para el mismo proyecto, la tarjeta oculta (`display: none`) debe tener `aria-hidden="true"` para evitar contenido duplicado en lectores de pantalla.

---

### 4.5 `WindowDetail`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/ui/WindowDetail.astro` |
| **CSS** | `src/styles/components/window-detail.css` |
| **Nombre Figma** | `ui/window/detail` |
| **Nivel de reutilización** | Bajo-Medio — una instancia en `SectionProyectos` |

**Descripción**  
Ventana de detalle de proyecto, conceptualizada como ejecutable de SO: `PROYECTO_01.EXE`. Se presenta como **overlay en todos los breakpoints** (Desktop, Tablet y Phone). Tiene barra de título con el nombre del proyecto y **tres controles funcionales** que emulan una ventana de OS: `_` minimiza, `□` maximiza y `×` cierra la ventana. El área de contenido aloja la imagen/media del proyecto.

**Responsabilidad**  
Renderizar el frame de ventana OS como overlay encima del contenido de `SectionProyectos`. Se activa al hacer click en una `PreviewCard` y se cierra con el control `×`. Su contenido cambia dinámicamente via JS según el proyecto seleccionado.

**Props recomendadas**

| Prop | Tipo | Requerida | Default | Descripción |
|---|---|---|---|---|
| `title` | `string` | ✅ | — | Nombre del proyecto en la barra de título (e.g., `"PROYECTO_01.EXE"`) |
| `imageSrc` | `string` | ❌ | `undefined` | Imagen principal del proyecto |
| `imageAlt` | `string` | ❌ | `""` | Texto alternativo de la imagen |

**Slot**  
Acepta `<slot />` para permitir contenido HTML libre dentro del área de contenido de la ventana.

**Variantes**  
Ninguna de diseño. El comportamiento de overlay es el mismo en todos los breakpoints. El tamaño se adapta con media queries.

**Componentes hijos**  
Ninguno (el contenido se inyecta via slot o props).

**Dependencias**  
Tokens: `--bg-panel`, `--border-dim`, `--fg-primary`, `--fg-text`, `--radius-component`.

**Datos para `map()`**  
No aplica. Es una instancia única cuyo contenido cambia via JS.

**Estados visuales**  
`oculto` (por defecto) / `visible` (overlay activo al seleccionar un proyecto).

**Accesibilidad**
- Los controles de ventana son **funcionales** y deben ser `<button>` con `aria-label` descriptivo:
  - `_` → `aria-label="Minimizar ventana"`
  - `□` → `aria-label="Maximizar ventana"`
  - `×` → `aria-label="Cerrar ventana"`
- La barra de título debe ser un `<h2>` (o el nivel correcto según jerarquía) con el nombre del proyecto.
- Usar `role="dialog"` con `aria-modal="true"` al ser un overlay que bloquea el contenido subyacente.
- Al abrir, el foco debe moverse al interior del dialog (`tabindex="-1"` en el contenedor).
- Al cerrar (`×`), el foco debe regresar a la `PreviewCard` que lo abrió.
- `Escape` debe cerrar el overlay (comportamiento estándar de dialog).

---

### 4.6 `PanelMain`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/ui/PanelMain.astro` |
| **CSS** | `src/styles/components/panel-main.css` |
| **Nombre Figma** | `ui/panel-main` |
| **Nivel de reutilización** | Alto — usado en todas las secciones como contenedor principal |

**Descripción**  
Panel principal de contenido de cada sección. Contenedor interno donde se renderiza el contenido específico de cada vista del portfolio.

**Responsabilidad**  
Proporcionar el contenedor de fondo (`--bg-panel`), borde (`--border-dim`) y espaciado interno para el contenido de la sección. Expone `<slot />` para que las secciones inyecten su contenido.

**Props recomendadas**  
Ninguna prop requerida. Es un contenedor puro.

**Slot**  
`<slot />` principal para el contenido de la sección.

**Variantes**  
No tiene variantes de diseño. La diferencia Desktop/Mobile se gestiona con media queries en su CSS.

**Componentes hijos**  
Cualquier componente del sistema (inyectado via slot).

**Dependencias**  
Tokens: `--bg-panel`, `--border-dim`, `--radius-component`.

**Datos para `map()`**  
No aplica.

**Estados visuales**  
Único estado (estático). No tiene estados interactivos propios.

**Accesibilidad**
- El elemento raíz debe ser semántico: `<main>`, `<section>` o `<article>` según el contexto donde se instancie.
- Si es `<section>`, debe tener `aria-labelledby` apuntando al heading de la sección.

---

### 4.7 `Panel`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/ui/Panel.astro` |
| **CSS** | `src/styles/components/panel.css` |
| **Nombre Figma** | `ui/panel` |
| **Nivel de reutilización** | Alto — wrapper de alto nivel para cada sección |

**Descripción**  
Contenedor de más alto nivel de una vista completa. Agrupa todos los subcomponentes de una sección. Es el equivalente al "frame" de la sección en el diseño de Figma.

**Responsabilidad**  
Proporcionar el contenedor raíz de una sección completa. Gestiona el layout de la sección (posición en el flujo horizontal de la SPA) y expone `<slot />`.

**Props recomendadas**

| Prop | Tipo | Requerida | Default | Descripción |
|---|---|---|---|---|
| `sectionId` | `string` | ✅ | — | ID del `<section>` raíz (e.g., `"ninin"`) para la navegación por anclas |
| `ariaLabel` | `string` | ❌ | `undefined` | Label del `<section>` para lectores de pantalla |

**Slot**  
`<slot />` principal.

**Variantes**  
No tiene variantes. La diferencia Desktop/Mobile se gestiona con media queries.

**Componentes hijos**  
`PanelMain.astro` (inyectado via slot desde las secciones padre).

**Dependencias**  
Tokens: `--bg-terminal` (fondo del área exterior al panel), layout: posición en el flujo horizontal.

**Datos para `map()`**  
No aplica.

**Estados visuales**  
`inactive` (sección no visible) / `active` (sección visible). El estado activo es gestionado por JS en `index.astro`.

**Accesibilidad**
- El elemento raíz debe ser `<section id="{sectionId}" aria-label="{ariaLabel}">`.
- Cada sección tiene exactamente un `<h1>` o el heading correcto según la jerarquía del documento.

---

## 5. Sections — Definición Detallada

---

### 5.1 `SectionBienvenida`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/sections/SectionBienvenida.astro` |
| **CSS** | `src/styles/components/section-bienvenida.css` |
| **ID de sección** | `bienvenida` |
| **Nivel de reutilización** | Único — una sola instancia |

**Descripción**  
Pantalla de bienvenida inicial del portfolio. Es el estado por defecto al cargar. No está listada en el NAV.EXE. Contiene la presentación inicial con logo ASCII del portfolio y el efecto de prompt/output de entrada.

**Responsabilidad**  
Montar la vista inicial del portfolio. Gestionar su propio estado de visibilidad (visible por defecto, se oculta al navegar a otra sección).

**Props recomendadas**  
Ninguna. El contenido es estático.

**Variantes**  
Ninguna.

**Componentes hijos**
- `Panel.astro` (sectionId: `"bienvenida"`)
  - `PanelMain.astro`
    - `Prompt.astro`
    - `Output.astro` → `Cursor.astro`

**Dependencias**  
Ningún dato externo. Contenido hardcodeado (es contenido único de presentación).

**Datos para `map()`**  
No aplica.

**Estados visuales**  
`visible` (estado inicial) / `oculta` (al navegar a otra sección).

**Accesibilidad**
- `<section id="bienvenida" aria-label="Bienvenida">`.
- El logo ASCII debe estar en un `<pre>` con `aria-label` descriptivo o `role="img"`.

---

### 5.2 `SectionNinin`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/sections/SectionNinin.astro` |
| **CSS** | `src/styles/components/section-ninin.css` |
| **ID de sección** | `ninin` |
| **Nivel de reutilización** | Único — una sola instancia |

**Descripción**  
Sección de presentación personal del autor `[1] ninin`. Contiene el par prompt/output de "quién es ninin", la cita del autor, los links sociales y la foto SVG.

**Responsabilidad**  
Montar la vista de presentación personal con todos sus elementos estáticos confirmados.

**Props recomendadas**  
Ninguna. El contenido es estático y específico del autor.

**Variantes**  
Ninguna.

**Componentes hijos**
- `Panel.astro` (sectionId: `"ninin"`)
  - `PanelMain.astro`
    - `Prompt.astro` (command: `"ninin"`)
    - `Output.astro` (showCursor: `true`) → `Cursor.astro`
    - `<blockquote>` (cita + atribución)
    - `<nav>` con `<a>` para GitHub y LinkedIn (usando `<img>` de los SVGs en `/icons/`)
    - `<figure>` con `<img src="/images/ninin-photo.svg">`

**Dependencias**  
Assets: `/icons/github.svg`, `/icons/linkedin.svg`, `/images/ninin-photo.svg`.  
No consume datos de `src/data/`.

**Datos para `map()`**  
Los links sociales pueden generarse con `.map()` sobre un array local si se anticipan más plataformas en el futuro.

**Estados visuales**  
`visible` / `oculta`.

**Accesibilidad**
- `<section id="ninin" aria-labelledby="ninin-heading">`.
- La foto SVG debe tener `alt="Jesús Ninin"`.
- Los links sociales deben tener `aria-label="Perfil de GitHub de Jesús Ninin"` (descriptivos).
- `<nav aria-label="Redes sociales">` para el grupo de links.

---

### 5.3 `SectionProyectos`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/sections/SectionProyectos.astro` |
| **CSS** | `src/styles/components/section-proyectos.css` |
| **ID de sección** | `la-proyectos` |
| **Nivel de reutilización** | Único — una sola instancia |

**Descripción**  
Sección de proyectos `[2] la proyectos`. Lista todos los proyectos del portfolio mediante `PreviewCard` y permite ver el detalle en el `WindowDetail`.

**Responsabilidad**  
Importar datos de `projects.js`, generar el listado de tarjetas y gestionar la apertura del `WindowDetail` al seleccionar un proyecto.

**Props recomendadas**  
Ninguna. Consume datos de `src/data/projects.js`.

**Variantes**  
Ninguna en el componente. Las variantes Desktop/Mobile se delegan a `PreviewCard` / `PreviewCardMobile`.

**Componentes hijos**
- `Panel.astro` (sectionId: `"la-proyectos"`)
  - `PanelMain.astro`
    - `Separator.astro` (variant: `"default"`) — al inicio
    - `PreviewCard.astro × n` (generados con `.map()`)
    - `PreviewCardMobile.astro × n` (generados con `.map()`)
    - `Separator.astro` (variant: `"default"`) — al final
    - `WindowDetail.astro`

**Dependencias**  
Datos: `src/data/projects.js`.  
JS: lógica de apertura de `WindowDetail` al hacer click en una tarjeta.

**Datos para `map()`**
```
projects.map(project => <PreviewCard {...project} />)
projects.map(project => <PreviewCardMobile {...project} />)
```

**Estados visuales**  
`visible` / `oculta`. Internamente: `windowDetail oculto` / `windowDetail visible`.

**Accesibilidad**
- `<section id="la-proyectos" aria-labelledby="proyectos-heading">`.
- La lista de proyectos debe estar en `<ul>` con cada tarjeta en `<li>`.
- Gestionar el foco correctamente al abrir/cerrar `WindowDetail`.

---

### 5.4 `SectionAbout`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/sections/SectionAbout.astro` |
| **CSS** | `src/styles/components/section-about.css` |
| **ID de sección** | `sobre-mi` |
| **Nivel de reutilización** | Único — una sola instancia |

**Descripción**  
Ficha técnica del autor `[3] sobre_mi`. Presenta datos personales y habilidades técnicas íntegramente como líneas `Output` — **sin `Prompt` inicial**. El contenido confirmado es: nombre, rol, ubicación y skills agrupados por categoría (Frontend, Backend, Databases).

**Responsabilidad**  
Montar la vista de ficha técnica del autor con sus datos personales y stack tecnológico.

**Props recomendadas**  
Ninguna. Contenido estático.

**Variantes**  
Ninguna.

**Componentes hijos**
- `Panel.astro` (sectionId: `"sobre-mi"`)
  - `PanelMain.astro`
    - `Separator.astro` (variant: `"default"`) — al inicio
    - `Output.astro` (text: `"NOMBRE: JESÚS NININ"`)
    - `Output.astro` (text: `"ROL: DESARROLLADOR FULL STACK"`)
    - `Output.astro` (text: `"UBICACION: GUACARA"`)
    - `Output.astro` (text: `"SKILLS: FRONTEND (REACT, NEXT.JS, ANGULAR, BLAZOR)"`)
    - `Output.astro` (text: `"SKILLS: BACKEND (.NET, C#, NODE.JS, EXPRESS.JS)"`)
    - `Output.astro` (text: `"SKILLS: DATABASES (MYSQL, POSTGRESQL, MONGODB)"`)

**Dependencias**  
Datos del autor: pueden definirse como array estático en `src/data/about.js` o hardcodeados directamente en la sección (contenido único, no repetido).

**Datos para `map()`**  
Los bloques de datos personales y skills pueden generarse con `.map()` sobre arrays definidos localmente:
```
personalData.map(line => <Output text={line} />)
skills.map(skill => <Output text={`SKILLS: ${skill.category} (${skill.tools})`} />)
```

**Estados visuales**  
`visible` / `oculta`.

**Accesibilidad**
- `<section id="sobre-mi" aria-labelledby="about-heading">`.
- Las líneas de skills deben agruparse en una `<ul>` con `<li>` si se requiere semántica de lista, o en `<dl>` si se presenta como término-definición.

---

### 5.5 `SectionContacto`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/sections/SectionContacto.astro` |
| **CSS** | `src/styles/components/section-contacto.css` |
| **ID de sección** | `mail-contacto` |
| **Nivel de reutilización** | Único — una sola instancia |

**Descripción**  
Sección de contacto `[4] mail contacto`. Contiene el formulario de contacto con campos `InputLine` y un `Btn` de envío.

**Responsabilidad**  
Montar el formulario de contacto. Gestionar la semántica del `<form>` y el estado del botón de envío.

**Props recomendadas**  
Ninguna. Contenido estático.

**Variantes**  
Ninguna.

**Componentes hijos**
- `Panel.astro` (sectionId: `"mail-contacto"`)
  - `PanelMain.astro`
    - `Prompt.astro` (command: `"mail contacto"`)
    - `Output.astro`
    - `<form>`
      - `InputLine.astro` (label: `"Nombre"`, name: `"nombre"`, type: `"text"`)
      - `InputLine.astro` (label: `"Email"`, name: `"email"`, type: `"email"`)
      - `InputLine.astro` (label: `"Mensaje"`, name: `"mensaje"`, type: `"textarea"`)
      - `Btn.astro` (label: `"Enviar"`, type: `"submit"`)

**Dependencias**  
No consume datos externos. La lógica de envío del formulario se gestiona con JS vanilla.

**Datos para `map()`**  
Posible `.map()` sobre array de definición de campos para generar los `InputLine`.

**Estados visuales**  
`visible` / `oculta`. Internamente: estados del formulario (`idle` / `enviando` / `enviado` / `error`).

**Accesibilidad**
- `<section id="mail-contacto" aria-labelledby="contacto-heading">`.
- El `<form>` debe tener `aria-label="Formulario de contacto"`.
- Gestionar estados del formulario con `aria-live` para anunciar éxito/error.
- El botón de envío debe comunicar su estado (`aria-busy="true"` mientras se envía).

---

### 5.6 `SectionHelp`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/sections/SectionHelp.astro` |
| **CSS** | `src/styles/components/section-help.css` |
| **ID de sección** | `man-ayuda` |
| **Nivel de reutilización** | Único — una sola instancia |

**Descripción**  
Manual de usuario del sistema `[5] man ayuda` en formato terminal. Muestra el título `MANUAL DE USUARIO (NININ_OS v1.0)`, la lista de comandos disponibles `[1]–[5]` con sus descripciones, y una nota de uso. La lista de comandos mapea directamente sobre los datos de `navigation.js`.

**Responsabilidad**  
Montar la vista de manual de usuario del portfolio en formato terminal. Reutiliza los datos de navegación para generar la lista de comandos disponibles.

**Props recomendadas**  
Ninguna. Consume datos de `src/data/navigation.js`.

**Variantes**  
Ninguna.

**Componentes hijos**
- `Panel.astro` (sectionId: `"man-ayuda"`)
  - `PanelMain.astro`
    - `Prompt.astro` (command: `"man ayuda"`)
    - `Output.astro` (text: `"MANUAL DE USUARIO (NININ_OS v1.0)"`)
    - `Output.astro` (text: `"COMANDOS DISPONIBLES:"`)
    - `Output.astro × 5` — lista de comandos generada con `.map()` sobre `navigation.js`
    - `Output.astro` (text: `"NOTA: Puedes ejecutar cualquiera de estos comandos haciendo"`)
    - `Output.astro` (text: `"clic directamente en el panel de navegación izquierdo (NAV.EXE)"`)

**Dependencias**  
Datos: `src/data/navigation.js` — reutiliza el mismo array que `PanelNav` para generar la lista de comandos.

**Datos para `map()`**  
La lista de comandos `[1]–[5]` se genera con `.map()` sobre `navigation.js`:
```
navItems.map(item => <Output text={`[${item.index}] ${item.sectionId} - ${item.description}`} />)
```
> Requiere añadir un campo `description` al objeto de `navigation.js` con la descripción de cada sección.

**Estados visuales**  
`visible` / `oculta`.

**Accesibilidad**
- `<section id="man-ayuda" aria-labelledby="help-heading">`.
- La lista de comandos `[1]–[5]` debe estar en `<ul>` con `<li>` por cada ítem.
- Los números entre corchetes son decorativos: `<span aria-hidden="true">[n]</span>`.

---

### 5.7 `SectionTransition`

| Propiedad | Valor |
|---|---|
| **Archivo** | `src/components/sections/SectionTransition.astro` |
| **CSS** | `src/styles/components/section-transition.css` |
| **ID** | `transition-overlay` (no es sección de nav) |
| **Nivel de reutilización** | Único — una sola instancia en `BaseLayout` |

**Descripción**  
Overlay de transición entre secciones. No es una sección de contenido — es un componente de efecto visual que simula la "carga" de OS retro al navegar. Vive en `BaseLayout`, fuera del flujo de secciones.

**Responsabilidad**  
Renderizar el overlay de pantalla completa con la `ProgressBar` animada. Está siempre en el DOM pero oculto por defecto. El JS de navegación lo muestra, ejecuta la animación y lo oculta.

**Props recomendadas**  
Ninguna. Es controlado completamente por JS externo.

**Variantes**  
Ninguna.

**Componentes hijos**
- `ProgressBar.astro` (animated: `true`, value: `0` inicial — JS lo anima a `100`)

**Dependencias**  
Animación: lógica JS en `index.astro`.  
Tokens: `--bg-terminal` (fondo del overlay).

**Datos para `map()`**  
No aplica.

**Estados visuales**  
`oculto` (por defecto: `display: none`) / `visible` (durante la transición, controlado por JS).

**Accesibilidad**
- Añadir `aria-hidden="true"` cuando está oculto.
- Usar `role="status"` y `aria-live="polite"` para anunciar el cambio de sección una vez que la transición se completa.
- Respetar `prefers-reduced-motion`: si el usuario lo prefiere, saltar la animación y mostrar la sección destino directamente.

---

## 6. Resumen de Relaciones entre Componentes

### Relaciones de Composición

```
index.astro
    └─ instancia ──→ Section* (× 7)
                         └─ contiene ──→ Panel
                                            └─ contiene ──→ PanelMain
                                                               └─ contiene ──→ primitives + ui

BaseLayout.astro
    ├─ instancia ──→ PanelNav
    │                   └─ genera con map() ──→ NavOption × 5
    └─ instancia ──→ SectionTransition
                         └─ contiene ──→ ProgressBar
```

### Flujo de Datos

```
src/data/navigation.js ──→ PanelNav ──→ NavOption (× 5 via map())

src/data/projects.js ──→ SectionProyectos ──→ PreviewCard (× n via map())
                                          └──→ PreviewCardMobile (× n via map())
                                          └──→ WindowDetail (instancia única, dato dinámico)

JS de navegación (index.astro) ──→ SectionTransition (visibilidad)
                               ──→ PanelNav (activeSectionId)
                               ──→ Section* (visibilidad activa)
```

### Dependencias de Datos por Componente

| Componente | Fuente de datos |
|---|---|
| `PanelNav` | `navigation.js` |
| `NavOption` | Props desde `PanelNav` |
| `PreviewCard` | `projects.js` (via `SectionProyectos`) |
| `PreviewCardMobile` | `projects.js` (via `SectionProyectos`) |
| `WindowDetail` | Props dinámicas via JS |
| `ProgressBar` | `SectionTransition` — JS lo anima de 0 a 100% durante la carga |
| `InputLine` (Contacto) | Array de campos (a definir localmente en `SectionContacto`) |
| Resto | Contenido estático en el template |

---

## 7. Clasificación de Componentes

### Componentes Reutilizables (alta frecuencia de instanciación)

| Componente | Instancias | Contextos |
|---|---|---|
| `Prompt` | ~6 | Una por sección |
| `Output` | ~10+ | Múltiples por sección |
| `Btn` | ~2×n + 1 | Proyectos + Contacto |
| `NavOption` | 5 | PanelNav |
| `PreviewCard` | n (por proyecto) | SectionProyectos Desktop |
| `PreviewCardMobile` | n (por proyecto) | SectionProyectos Mobile |
| `Panel` | ~6 | Una por sección |
| `PanelMain` | ~6 | Una por sección |
| `Separator` | ~n+1 | Entre cada proyecto |

### Componentes Específicos (una sola instancia)

| Componente | Contexto único |
|---|---|
| `PanelNav` | `BaseLayout` (sidebar persistente) |
| `WindowDetail` | `SectionProyectos` |
| `SectionTransition` | `BaseLayout` (overlay global) |
| `SectionBienvenida` | `index.astro` |
| `SectionNinin` | `index.astro` |
| `SectionProyectos` | `index.astro` |
| `SectionAbout` | `index.astro` |
| `SectionContacto` | `index.astro` |
| `SectionHelp` | `index.astro` |

### Componentes Parametrizables (comportamiento variable por props)

| Componente | Props clave | Variaciones |
|---|---|---|
| `Btn` | `label`, `href`, `variant` | Link vs. botón, variantes visuales |
| `ProgressBar` | `value`, `animated`, `label` | Estático vs. animado, con/sin label |
| `Prompt` | `command` | Un prompt diferente por sección |
| `Output` | `text`, `showCursor` | Con/sin cursor parpadeante |
| `Separator` | `variant` | Default vs. Active |
| `InputLine` | `label`, `name`, `type` | Texto, email, textarea |
| `NavOption` | `index`, `label`, `sectionId`, `isActive` | Activo vs. inactivo |
| `PreviewCard` | Datos del proyecto | Un card por proyecto |
| `WindowDetail` | `title`, `imageSrc` | Un detalle diferente por proyecto |
| `Panel` | `sectionId`, `ariaLabel` | Una instancia por sección |

---

## 8. Recomendaciones Antes del Desarrollo

### Orden de Desarrollo Recomendado

Siguiendo la regla del `AGENTS.md` (un componente por turno):

```
1.  BaseLayout.astro          ← scaffolding raíz
2.  tokens.css / global.css   ← sistema de tokens completo y verificado
3.  Panel.astro               ← contenedor raíz de secciones
4.  PanelMain.astro           ← contenedor de contenido
5.  PanelNav.astro            ← sidebar (con NavOption)
6.  NavOption.astro           ← ítem de navegación
7.  Prompt.astro              ← primitivo más usado
8.  Output.astro              ← primitivo + integra Cursor
9.  Cursor.astro              ← efecto de cursor
10. Separator.astro           ← divisor de proyectos
11. Btn.astro                 ← botón de acción
12. InputLine.astro           ← campo de formulario
13. ProgressBar.astro         ← barra de progreso
14. PreviewCard.astro         ← tarjeta de proyecto desktop
15. PreviewCardMobile.astro   ← tarjeta de proyecto mobile
16. WindowDetail.astro        ← ventana de detalle
17. SectionTransition.astro   ← overlay de transición
18. SectionBienvenida.astro   ← sección inicial
19. SectionNinin.astro        ← sección de presentación
20. SectionProyectos.astro    ← sección de proyectos
21. SectionAbout.astro        ← sección sobre mí
22. SectionContacto.astro     ← sección de contacto
23. SectionHelp.astro         ← sección de ayuda
```

### Prioridades Pre-Desarrollo

1. **Resolver el Riesgo R6 antes de todo**: Migrar `index.astro` al patrón `BaseLayout.astro` es la tarea #1 sin excepción.

2. **Completar `tokens.css`** con todos los tokens documentados en `design_analysis.md` antes del primer componente. Sin tokens completos, los componentes no pueden implementarse fielmente.

3. **Verificar los SVG de Maquetación** (`Componentes_Simples.svg` y `Componentes_Compuestos.svg`) antes de implementar cada componente para confirmar medidas exactas de padding, gap y tamaños de fuente que no están documentados en píxeles precisos.

4. **Revisar el SVG para `SectionAbout` y `SectionHelp`**: El contenido de estas secciones no está confirmado. Antes de implementarlas, consultar el SVG correspondiente para determinar su estructura interna exacta.

5. **Definir `src/data/projects.js` antes de `SectionProyectos`**: Los componentes `PreviewCard` y `WindowDetail` dependen directamente de esta estructura de datos.

6. **Confirmar comportamiento del `PanelNav` en Tablet**: El diseño de Phone usa hamburger `≡`, pero el comportamiento en Tablet (768px) no está completamente especificado. Verificar en `Tablet.svg` antes de implementar.

### Decisiones de Implementación que Requieren Verificación

| Decisión | Pregunta pendiente | Fuente de verdad |
|---|---|---|
| Layout de `SectionAbout` | ✅ Confirmado: `Separator` + `Output × n` (nombre, rol, ubicación, skills por categoría). Sin `Prompt`. | — |
| Layout de `SectionHelp` | ✅ Confirmado: `Prompt` + `Output × n`. Lista `[1]–[5]` mapeada desde `navigation.js`. Incluye nota de uso. | — |
| Comportamiento NAV en Tablet | ✅ Confirmado: igual que Phone — panel overlay con hamburger `≡` | — |
| WindowDetail en Mobile | ✅ Confirmado: overlay en **todos** los breakpoints (Desktop, Tablet y Phone) | — |
| Número de campos en el formulario | ¿Cuántos y cuáles `InputLine` hay en Contacto? | `Desktop.svg` vista 4 |
| Gap entre sidebar y main (40px R4) | ✅ Confirmado: intencional — implementar como `--layout-gap: 40px` | — |

### Restricciones Recordatorio

> Estas restricciones provienen del `AGENTS.md` del proyecto y son de cumplimiento estricto en todo el desarrollo:

- ❌ Sin React, Vue, Svelte ni ningún framework JS de componentes
- ❌ Sin Tailwind CSS, Bootstrap ni ningún framework CSS
- ❌ Sin estilos inline (`style=""` en HTML)
- ❌ Sin duplicar HTML para distintos breakpoints (salvo la excepción documentada de `PreviewCard` / `PreviewCardMobile`)
- ❌ Sin valores hardcodeados fuera de `tokens.css`
- ❌ Sin inventar componentes o variantes no documentadas en los SVG
- ✅ Solo: Astro · HTML5 semántico · CSS3 con variables · JavaScript vanilla
- ✅ Un componente por turno de desarrollo
- ✅ Cada componente tiene su propio archivo CSS dedicado
- ✅ `aria-current`, `alt`, `aria-label` en todos los componentes que los necesiten

---

*Fin del documento — Fase 3: Definición de Componentes*  
*Próximo paso: Iniciar desarrollo comenzando por `BaseLayout.astro` y `tokens.css` (Fase 4)*
