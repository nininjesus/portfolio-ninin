# CLAUDE.md

## Build and Development Commands
- Start dev server: `npm run dev` (or `pnpm dev` / `pnpm --filter portfolio-ninin dev`)
- Build production: `npm run build`
- Typecheck: `npm run astro check`

## Project Context & Goal
- **Objective:** Faithfully replicate Figma layouts (`DesignSystem.svg`, `Desktop.svg`, `Responsive.svg`) in Astro.
- **Strict Rule:** Do NOT modify, improve, or invent design elements. Recreate them exactly as they are.

## Technology Restrictions
- **Allowed:** Astro, HTML5, CSS3, JavaScript.
- **FORBIDDEN:** React, Vue, Svelte, Tailwind CSS, Bootstrap, or any CSS frameworks/component libraries.

## Code & Architecture Guidelines
- **HTML Semantics:** Use semantic tags (`header`, `main`, `nav`, `section`, `article`, `footer`, `button`, `picture`, `img`, `figure`). Avoid unnecessary `div` elements.
- **CSS Organization:** No inline styles. Each component must have its own CSS file (e.g., `Hero.astro` imports `styles/hero.css`). Use CSS variables for everything; do not hardcode style values.
- **Data-Driven:** Use JS arrays to render repetitive lists (experience, projects, skills).
- **Responsive:** Build responsive views using CSS media queries. Do NOT duplicate HTML markup.
- **Accessibility:** Images must have `alt` text. Interactive elements must be keyboard-navigable.

## Naming Conventions
- Astro Components: `PascalCase` (e.g., `Hero.astro`, `Navbar.astro`)
- Variables: `camelCase`
- CSS Files: `kebab-case` (e.g., `hero.css`, `project-card.css`)

## AI Workflow Rules
1. Develop only one component per prompt following this order: Navbar -> Hero -> About -> Experience -> Projects -> Contact -> Footer.
2. Analyze the SVG design and structure before writing any code.