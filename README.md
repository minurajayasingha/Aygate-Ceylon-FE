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

## SEO

Every URL's title, description, canonical link, social preview (Open Graph / X) and structured data (JSON-LD) are defined in **`src/seo/pages.ts`**. The domain, company details and social profiles are in `src/seo/config.ts`.

| Where | What it does |
|---|---|
| `src/seo/pages.ts` | SEO for each page, product (`productSeo`) and blog article (`articleSeo`) |
| `src/seo/schema.ts` | Structured data: Organization, WebSite, Product with prices, BreadcrumbList, BlogPosting |
| `src/seo/useSeo.ts` | `useSeo(...)` hook each page calls to update `<head>` in the browser |
| `scripts/seo-plugin.ts` | On `npm run build`, writes `dist/<path>/index.html` with that page's tags already in place, plus `sitemap.xml` and `robots.txt` |
| `scripts/og-image.mjs` | Regenerates `public/og-image.jpg`, the default 1200×630 link-preview image |

- **New page:** add an entry to `staticList` in `src/seo/pages.ts`, then call `useSeo(pageSeo('/path'))` at the top of the page.
- **New product:** add it to `src/data/shop.ts`. Its SEO, structured data and sitemap entry are generated.
- **New blog article:** add it to `src/data/blog.ts` (the fields are documented there). Build the `/blog` and `/blog/:slug` pages first and call `useSeo(blogIndexSeo)` / `useSeo(articleSeo(post))` in them. Blog URLs join the sitemap once the first article exists. If articles later come from the backend, load them at build time into the same `BlogPost` shape so they still get pre-filled HTML.
- Account, checkout, login, register and design-system pages are marked `noindex`.
- **Hosting:** serve `dist/<path>/index.html` when it exists and fall back to `dist/index.html` otherwise (Netlify, Vercel and Cloudflare Pages do this by default; nginx: `try_files $uri $uri/ /index.html;`).
- Check the result with Google's [Rich Results Test](https://search.google.com/test/rich-results), then submit `https://<domain>/sitemap.xml` in Google Search Console.

## Backend work still to connect

Forms prevent submission and send nothing yet: `JoinSection`, `ContactPage` and `QuoteModal`. Product data is static in `src/data/content.ts`.
