<div align="center">
  <img src="./.github/assets/NININTRON_OS_PORTFOLIO_BANNER.svg" alt="NININTRON OS Portfolio Banner" width="50%" />
</div>

## **Descripción general**
**NININTRON_OS_PORTFOLIO** es una plataforma interactiva y visual diseñada para presentar proyectos, experiencia y habilidades con una estética única estilo "OS Window" (Sistema Operativo retro-moderno).
Con este portafolio, los usuarios pueden:

**Navegación Fluida e Inmersiva:** Explorar diferentes secciones (Bienvenida, Sobre Mí, Proyectos, Contacto) en un entorno que simula ventanas interactivas.

**Diseño Adaptativo (Responsive):** Experiencia consistente tanto en Desktop como en dispositivos móviles, ajustando automáticamente el menú lateral y el contenido mediante `IntersectionObserver` y media queries.

**Experiencia Autónoma (Sin Frameworks CSS):** Construido empleando variables de CSS puras y HTML semántico, garantizando un rendimiento óptimo, accesibilidad y un estilo 100% personalizado sin librerías externas.

```Carpetas
.
├── 📂 public/                    # Recursos estáticos públicos
│   ├── 📂 fonts/                 # Fuentes de texto (ej. IBM Plex Mono)
│   ├── 📂 icons/                 # Íconos SVG (GitHub, LinkedIn, etc)
│   └── 📂 images/                # Imágenes (Logos, fotos, portadas de proyectos)
└── 📂 src/
    ├── 📂 components/            # Componentes reutilizables de Astro
    │   ├── 📂 primitives/        # Elementos básicos (botones, inputs, barras de estado)
    │   ├── 📂 sections/          # Secciones principales de la página (Hero, About, etc)
    │   └── 📂 ui/                # Componentes de interfaz (Topbar, PanelNav, WindowDetail)
    ├── 📂 data/                  # Datos estáticos (JSON/JS)
    │   ├── 📄 navigation.js      # Datos del menú de navegación
    │   ├── 📄 nininQuotes.js     # Frases aleatorias para secciones
    │   └── 📄 projects.js        # Información de los proyectos mostrados
    ├── 📂 layouts/               # Plantillas de páginas base
    │   └── 📄 BaseLayout.astro   # Layout principal estilo "OS Window"
    ├── 📂 pages/                 # Rutas de la aplicación
    │   └── 📄 index.astro        # Página principal (Single Page)
    ├── 📂 scripts/               # Lógica interactiva en cliente (JavaScript)
    │   └── 📄 window-detail.js   # Manejador del comportamiento de ventanas y modales
    └── 📂 styles/                # Hojas de estilo globales (CSS Puro)
        ├── 📄 global.css         # Estilos base y reseteos
        ├── 📄 layout.css         # Reglas del layout principal y grid
        ├── 📄 tokens.css         # Variables de CSS (Colores, tipografías, espaciados)
        └── 📄 animations.css     # Animaciones clave (Transiciones)
```

## Arquitectura y Patrones Técnicos

*   **HTML Semántico y Accesibilidad:** Uso estricto de etiquetas semánticas (`header`, `main`, `nav`, `section`, `article`, `footer`, `aside`). Navegación operable por teclado.
*   **Aislamiento CSS (Zero CSS Frameworks):** Las hojas de estilo se estructuran en archivos separados. Cada componente cuenta con sus propios estilos o consume `tokens.css` usando CSS Variables (`--fg-primary`, `--space-4`, etc). **No** se utiliza Tailwind, Bootstrap, ni similares (cumpliendo las directrices).
*   **Modularidad en Astro:** Enfoque de componentes de responsabilidad única (`PascalCase` para componentes de Astro, `kebab-case` para archivos CSS), mejorando la mantenibilidad del código base.
*   **Scroll & IntersectionObserver:** Lógica en Vanilla JavaScript para detectar la sección activa y actualizar dinámicamente el título del panel de ventana, además de gestionar la navegación responsiva.

## Configuración para Desarrollo Local

### 🖥️ Requisitos previos

Asegúrate de tener instalados:
- **Node.js (versión >= 22.12.0)**
- **npm (o pnpm)**
- **Editor de código (ej. Visual Studio Code)**

## Instala dependencias y paquetes
```sh
  npm install
  # o si usas pnpm
  pnpm install
```

Para levantar el servidor de desarrollo en local:
```sh
  npm run dev
  # o
  pnpm dev
```

## Tecnologías utilizadas

### 🧠 Backend / Framework

*   **Framework:** `Astro 7.0`
*   **Renderizado:** `SSG (Static Site Generation) por defecto`

### 🎨 Frontend

*   **Motor de Vistas:** `Componentes .astro`
*   **Lenguaje:** `JavaScript (ESM)`
*   **Interactividad:** `Vanilla JS (DOM, IntersectionObserver)`
*   **Estilos:** `CSS3 Vanilla (Custom Properties / CSS Variables)`
*   **Tipografía:** `IBM Plex Mono (Vía Fontsource)`

### 📦 Herramientas y Ecosistema

*   **Gestor de Paquetes:** `npm / pnpm`
*   **Control de versiones:** `Git` / `GitHub`
*   **Despliegue:** `npm run build` genera un sitio estático listo para alojarse en cualquier CDN o servidor web (ej. Vercel, Netlify, GitHub Pages).