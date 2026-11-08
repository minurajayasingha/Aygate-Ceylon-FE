# Aygate Ceylon website

Frontend for the Aygate Ceylon website, built from the [Figma file](https://www.figma.com/design/84wz6AM3GS51HAJM0prY5W/Aygate-Ceylon-Website?node-id=112-3134) (page **Web**). Built with React, TypeScript, Vite and Tailwind CSS v4.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server at http://localhost:5173 |
| `npm run build` | Type-check and build to `dist/` |
| `npm run compare` | Screenshot every page and diff it against Figma (dev server must be running; results in `.compare/`) |
| `npm run figma:assets` | Re-export images and icons from Figma (needs `FIGMA_TOKEN` in `.env.local`) |

## Design system

Open **/design-system** in the browser to see every token and component.

| Where | What belongs there |
|---|---|
| `src/index.css` | Design tokens: colours, fonts, type sizes, radii, shadows, breakpoint |
| `src/components/ui/` | Basic parts: `Button`, `Eyebrow`, `Field`, `Chip`, `Dots`, `Icon`, `Logo` |
| `src/components/sections/` | Larger blocks: `Hero`, `ProductCard`, `ServiceCard`, `JoinSection`, `QuoteModal` |
| `src/components/layout/` | `Header`, `Footer`, `SiteLayout` |
| `src/pages/` | One file per route, composed from the parts above |
| `src/data/content.ts` | All shared copy and data. Replace placeholder text here |

### Rules

- Use tokens (`bg-gold`, `text-h2`, `rounded-card`) rather than new hex values or sizes. To change a brand value, edit `src/index.css`.
- Add an icon by dropping an SVG into `src/assets/icons/`, then use `<Icon name="file-name" />`. It follows the text colour.
- Add new reusable parts to `src/components/ui/` and show them on the design system page.

## Responsive behaviour

- The desktop layout (1024px and up) follows the 1440px Figma frame. Below 1440px it scales down evenly; above 1440px content stays centred and backgrounds stretch.
- The mobile layout (below 1024px) follows the 402px Figma frame. Below 402px it scales down evenly.
- `src/main.tsx` holds the scaling logic.

## Backend work still to connect

Forms prevent submission and send nothing yet: `JoinSection`, `ContactPage` and `QuoteModal`. Product data is static in `src/data/content.ts`.
