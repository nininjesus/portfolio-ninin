# AGENTS.md

## Setup and Development
- Install dependencies: `npm install` (or `pnpm install`)
- Start development server: `npm run dev` (or `pnpm dev`)
- Build for production: `npm run build`

## Project Context & Core Goal
- **Goal:** Faithfully replicate Figma layouts (`DesignSystem.svg`, `Desktop.svg`, `Responsive.svg`) in Astro.
- **Strict Constraint:** Do NOT modify, improve, change, or invent design elements. Recreate them exactly as they are in the SVGs.

## Tech Stack Rules
- **Allowed:** Astro, HTML5, CSS3, JavaScript.
- **STRICTLY FORBIDDEN:** React, Vue, Svelte, Tailwind CSS, Bootstrap, or any other CSS framework or component library.

## Architectural Boundaries
- Keep all HTML semantic (`header`, `main`, `nav`, `section`, `article`, `footer`, `button`, `picture`, `img`, `figure`). Avoid unnecessary `div` elements.
- **CSS Separation:** No inline styles. Each component must have its own dedicated CSS file.
- **Variables:** Use CSS variables (e.g., `--color-primary`) for all styles. Do not hardcode style values.
- **Responsive:** Adapt the layouts using media queries in CSS. Do NOT duplicate HTML code for different screen sizes.
- **Accessibility:** Images must have `alt` tags. Interactive components must be keyboard-navigable.

## Conventions & Standards
- **Folder Structure:** 
  - `src/components/` (Single-responsibility components)
  - `src/layouts/` (Page layouts)
  - `src/pages/` (Page routing)
  - `src/styles/` (Global and component styles)
- **Naming Conventions:**
  - Astro Components: `PascalCase` (e.g., `Hero.astro`)
  - CSS Files: `kebab-case` (e.g., `hero.css`)
  - Variables: `camelCase`

## AI Agent Instructions
1. Develop sequentially in this order: Navbar -> Hero -> About -> Experience -> Projects -> Contact -> Footer.
2. Build and deliver only one component per request. Never attempt to build the entire site in a single turn.