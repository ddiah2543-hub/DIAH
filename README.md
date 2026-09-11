# DIAH — Institutional Website

Modern, multilingual institutional website for **DIAH** (IT, Software Development & Digital Solutions). Built with plain HTML5, CSS3 and vanilla JavaScript — no frameworks, no build step. Open `index.html` in a browser and it works.

## Running it

Just open [index.html](index.html) directly, or serve the folder with any static server (e.g. `npx serve`, VS Code "Live Server") if you prefer working over `http://` instead of `file://`.

## Structure

```
diah/
├── index.html          all markup, single page
├── css/
│   ├── style.css        design tokens (CSS variables) + component styles
│   └── responsive.css   breakpoints: 1100px / 760px / 420px
├── js/
│   ├── translations.js  pt/en/fr dictionary, keyed by dot-path (hero.title, ...)
│   ├── projects.js      projects portfolio data, per language
│   ├── news.js          news/insights articles data, per language
│   └── main.js          all interactivity (i18n, theme, modals, filters, animations)
├── assets/
│   ├── images/          project & article photography (currently empty — see below)
│   ├── icons/            standalone icon assets, if needed beyond inline SVG
│   └── logo/             DIAH logo + favicon (SVG)
└── README.md
```

## Content model — where to add things

### Projects
Edit [js/projects.js](js/projects.js). `projectsData` has one array per language (`pt`, `en`, `fr`) — add the **same project** (same `id`) to all three arrays, translated. `category` must be one of: `software`, `web`, `mobile`, `systems`, `consulting`, `automation` (it drives the portfolio filters and cover color). Leave `image: null` to keep the generated abstract cover, or set `image: "assets/images/your-file.jpg"` once real photography exists (you'll then need to swap the generated `.project-cover` div in `js/main.js` → `projectCardHTML()` / `openProjectModal()` for an `<img>`).

### News & Insights
Same pattern in [js/news.js](js/news.js) (`newsData.pt/en/fr`), keep `id` in sync across languages, `date` in `YYYY-MM-DD`.

### Services, workshops, process, tech stack, stats
These are static sections written directly in [index.html](index.html) with `data-i18n="key"` attributes; the actual copy lives in [js/translations.js](js/translations.js). To change a label, edit the translation value (all three languages) rather than the HTML. The **Technology** section (frontend/backend/mobile/database/cloud lists) is plain `<li>` text in `index.html` — those are placeholders, replace with DIAH's real stack directly in the markup.

Stats (`+120 Projectos`, etc.) use `data-count="120"` on `.stat-num` elements in `index.html` — placeholders, update the numbers directly.

### Translations
[js/translations.js](js/translations.js) exports `translations = { pt: {...}, en: {...}, fr: {...} }`. Any element with `data-i18n="some.key"` gets its `textContent` replaced on language switch; `data-i18n-attr="content:meta.description"` translates an attribute instead (format `attr:key`, `;`-separated for more than one). Portuguese is the default/fallback language.

## Notes on the demo data

- Project and article **images are intentionally `null`** — the UI generates abstract gradient covers instead, so the site looks complete before real photography exists.
- Stats, testimonials-free counters, and project/news content are placeholders for structure and tone — not real DIAH figures. Replace before launch.
- The contact form has no backend: submitting it simulates a send (client-side only) and shows a success message. Wire it to a real endpoint (or a service like Formspree) before going live.
- Public contact email currently set to `didarcia@diahsolutions.com`.

## Design system

All colors, spacing, type and radii are CSS custom properties in `:root` at the top of [css/style.css](css/style.css) — change the palette or scale there and it propagates everywhere. Dark mode is driven by `[data-theme="dark"]` on `<html>` (falls back to `prefers-color-scheme` when the visitor hasn't chosen explicitly) and persists via `localStorage`.
