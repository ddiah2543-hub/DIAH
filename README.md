# DIAH — Institutional Website

Modern, multilingual institutional website for **DIAH** (IT, Software Development & Digital Solutions). Built with plain HTML5, CSS3 and vanilla JavaScript — no frameworks, no build step. Open `index.html` in a browser and it works.

## Running it

Just open [index.html](index.html) directly, or serve the folder with any static server (e.g. `npx serve`, VS Code "Live Server") if you prefer working over `http://` instead of `file://`.

## Structure

```
diah/
├── index.html          all markup, single page
├── favicon.ico         root favicon (16/32/48px)
├── css/
│   ├── style.css        design tokens (CSS variables) + component styles
│   └── responsive.css   breakpoints: 1199 / 1100 / 1023 / 760 / 639 / 420px
├── js/
│   ├── config.js        site settings: News on/off, social links (LinkedIn, Instagram)
│   ├── translations.js  pt/en/fr dictionary, keyed by dot-path (hero.title, ...)
│   ├── projects.js      projects portfolio data, per language
│   ├── news.js          news/insights articles data, per language
│   └── main.js          all interactivity (i18n, theme, modals, filters, animations)
├── assets/
│   ├── images/          project & article photography (currently empty — see below)
│   ├── icons/            standalone icon assets, if needed beyond inline SVG
│   └── logo/             navbar logo (DIAH), full logo (DIAH Solutions), favicon.svg, app icons
└── README.md
```

## Content model — where to add things

### Projects
Edit [js/projects.js](js/projects.js). `projectsData` has one array per language (`pt`, `en`, `fr`) — add the **same project** (same `id`) to all three arrays, translated. `category` must be one of: `software`, `web`, `mobile`, `systems`, `consulting`, `automation` (it drives the portfolio filters and cover color). Leave `image: null` to keep the generated abstract cover, or set `image: "assets/images/your-file.jpg"` once real photography exists (you'll then need to swap the generated `.project-cover` div in `js/main.js` → `projectCardHTML()` / `openProjectModal()` for an `<img>`).

### News & Insights
The section (and its nav links) is **hidden** while `showNews` is `false` in [js/config.js](js/config.js); set it to `true` once there are articles. Same pattern in [js/news.js](js/news.js) (`newsData.pt/en/fr`), keep `id` in sync across languages. `date` (`YYYY-MM-DD`) is optional — leave it out rather than invent one. `cover: "brand"` uses the DIAH logo cover; a single article is centred automatically.

### Services, about
Page order: Hero → O que fazemos (`#services`) → Projectos (`#projects`) → Sobre (`#about`) → Contacto (`#contact`). These are static sections written directly in [index.html](index.html) with `data-i18n="key"` attributes; the actual copy lives in [js/translations.js](js/translations.js). To change a label, edit the translation value (all three languages) rather than the HTML. Each service card has an id (`#software`, `#automacao`, `#dados-ia`, `#consultoria`) that the Services dropdown links to. The Sobre section is an About block plus a panel with three tabs (Processo · Tecnologias · Prazos); all tab panels are in `index.html` and their copy is in translations.js under `about.*`. Technology logos are inline SVGs from simple-icons (CC0).

### Social links
LinkedIn and Instagram URLs live in [js/config.js](js/config.js) (`siteConfig.social`); they are `#` placeholders until the profiles exist.

The "+N" stats bar (Projectos/Clientes/Workshops) was removed from the About section — it showed "+0" for clients and workshops with no real figures behind them. Reintroduce it once there are real numbers to show.

### Translations
[js/translations.js](js/translations.js) exports `translations = { pt: {...}, en: {...}, fr: {...} }`. Any element with `data-i18n="some.key"` gets its `textContent` replaced on language switch; `data-i18n-attr="content:meta.description"` translates an attribute instead (format `attr:key`, `;`-separated for more than one). Portuguese is the default/fallback language.

## Notes on the demo data

- Project and article **images are intentionally `null`** — the UI generates abstract gradient covers instead, so the site looks complete before real photography exists.
- Project/news content is placeholder for structure and tone — not final DIAH copy. Replace before launch.
- The Contact section has no form — "Fale connosco" opens a `mailto:` link and "Agendar reunião" opens the Google Calendar booking page.
- Public contact email currently set to `info@diahsolutions.com`.

## Design system

All colors, spacing, type and radii are CSS custom properties in `:root` at the top of [css/style.css](css/style.css) — change the palette or scale there and it propagates everywhere. Dark mode is driven by `[data-theme="dark"]` on `<html>` (falls back to `prefers-color-scheme` when the visitor hasn't chosen explicitly) and persists via `localStorage`.
