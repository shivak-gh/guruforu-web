# GuruForU Web — Developer Guide

This document covers the marketing site architecture: design system, localization, regional content, SEO, locale debugging, and page layouts.

For deployment, see [README.md](./README.md). For an older localization audit, see [LOCALIZATION_AUDIT.md](./LOCALIZATION_AUDIT.md).

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [CSS & design system](#css--design-system)
3. [Page layouts](#page-layouts)
4. [Navigation & footer](#navigation--footer)
5. [Localization overview](#localization-overview)
6. [Locale detection priority](#locale-detection-priority)
7. [Locale debug query params](#locale-debug-query-params)
8. [Regional About page content](#regional-about-page-content)
9. [SEO & server rendering](#seo--server-rendering)
10. [Adding a new region](#adding-a-new-region)
11. [Key files reference](#key-files-reference)

---

## Tech stack

- **Next.js 16** (App Router)
- **React Server Components** for page content
- **CSS**: global stylesheets (no CSS modules on marketing pages except Nav, BlogCategories, etc.)
- **Locale config**: JSON (`lib/locales.json`, `lib/localized-content.json`)
- **Proxy**: `proxy.ts` (www redirect + locale debug headers)

---

## CSS & design system

Styles are imported in `app/globals.css`:

| File | Purpose |
|------|---------|
| `app/styles/theme.css` | Design tokens (`--primary`, `--nav-height`), buttons, footer grid |
| `app/styles/home.css` | Homepage |
| `app/styles/about.css` | About + shared card patterns (`about-card`, `about-section`, `about-cta`) |
| `app/styles/how-it-works.css` | How It Works–specific (audience pills, comparison table, step cards) |
| `app/styles/blog.css` | Resources / blog listing article cards |
| `app/styles/pages.css` | Legacy inner-page styles (contact, legal, old patterns) |
| `app/styles/overrides.css` | Fixes token pollution from `pages.css` — **must stay last** |

### Shared UI classes

| Class | Use |
|-------|-----|
| `gf-container` | Max-width content wrapper |
| `gf-badge` | Hero pill badge |
| `gf-btn-primary` / `gf-btn-outline` | CTAs |
| `about-card` | Feature / benefit card |
| `about-section` / `about-section-alt` | Page sections |
| `about-cta` | Bottom gradient CTA panel |
| `home-steps` / `home-step` | Numbered 3-step flows |
| `gf-footer` | Multi-column footer (`PageFooter.tsx`) |

### Fonts

- **Inter** — body (`--font-sans`)
- **Space Grotesk** — headings (`--font-display`)

Configured in `app/layout.tsx`.

---

## Page layouts

### Card-based marketing pages (new theme)

| Route | Wrapper class | Notes |
|-------|---------------|-------|
| `/` | `.home` | Homepage hero, trust, features, blog preview |
| `/about` | `.about` | Regional content + SEO |
| `/how-it-works` | `.hiw` | Parents / students / teachers sections |
| `/blog` | `.blog` | Resources listing (nav label: **Resources**) |

### Still on legacy `ip-*` styles

Contact, free-session, legal pages (`terms`, `privacy`, etc.), blog category and article pages.

### Layout pattern (card pages)

```
<NavMenu />
<main className="about|hiw|blog|home">
  <section className="about-hero">...</section>
  <section className="about-section">...</section>
  <PageFooter />
</main>
```

---

## Navigation & footer

### Nav (`app/components/NavMenu.tsx`)

- Fixed top bar (`position: fixed`, `body { padding-top: var(--nav-height) }`)
- Links: Home, About Us, How It Works, Resources (`/blog`), Contact
- **Go to Classroom** → `https://learn.guruforu.com/` (outline button)
- **Book Free Session** → `/free-session` (primary button)
- Active page: blue highlight via `usePathname()`
- Client-side locale for spelling (`localizeText` via browser)

### Footer (`app/components/PageFooter.tsx`)

Multi-column: Brand | Company | Product | Legal  
Copyright bar only (no Classroom link — moved to nav).

---

## Localization overview

### Supported regions

| Region | Locale code | Country | Curriculum focus (About page) |
|--------|-------------|---------|--------------------------------|
| `US` | `en-US` | United States | K-12, Common Core, SAT/ACT |
| `UK` | `en-GB` | United Kingdom | GCSE, A-Level, National Curriculum |
| `CA` | `en-CA` | Canada | Provincial curriculum |
| `AU` | `en-AU` | Australia | Australian Curriculum, NAPLAN, HSC/VCE |
| `NZ` | `en-NZ` | New Zealand | NZ Curriculum, NCEA |
| `QA` | `en-QA` | Qatar | International / IGCSE / IB |
| `AE` | `en-AE` | UAE | International / British / IB |
| `IN` | `en-IN` | India | CBSE, ICSE, NCERT |
| `DEFAULT` | `x-default` | Global | K-12 + international keywords |

European countries (DE, FR, IT, ES, etc.) map to **`en-GB`** via geo headers in `lib/locales.json`.

### Config files

| File | Contents |
|------|----------|
| `lib/locales.json` | Locale codes, country mapping, detection header keys |
| `lib/localized-content.json` | Spelling replacements, educational terms, SEO, About content |
| `lib/locale.ts` | `detectLocale()`, `localizeText()`, getters |

### Spelling localization

UK, AU, NZ, IN use British spelling where configured (e.g. Math → Maths, Personalized → Personalised).  
Applied via `localizeText(text, region)` — not separate page copies.

---

## Locale detection priority

Highest to lowest:

1. **Debug query params** — `?gf_locale=` or `?gf_region=` (see below)
2. **Geo country headers** — `cf-ipcountry`, `x-vercel-ip-country`, `x-country-code`
3. **Accept-Language** — primary tag only (ordered list, not substring match)
4. **Default** — `x-default` / global content

### Implementation

- **Server**: `detectLocale(await headers())` in async Server Components
- **Client**: `detectLocale()` reads URL params + `navigator.language`
- **Proxy**: `proxy.ts` copies query params into internal headers:
  - `x-gf-locale-override`
  - `x-gf-region-override`

### Debug banner

When `gf_locale` or `gf_region` is present, `LocaleDebugBanner` shows bottom-left:

```
Locale debug · en-IN · IN · India · [Clear]
```

Component: `app/components/LocaleDebugBanner.tsx` (in root layout).

---

## Locale debug query params

Use these on **any page** to force a locale without VPN or changing browser settings.

### Query parameters

| Param | Example | Description |
|-------|---------|-------------|
| `gf_region` | `?gf_region=IN` | Short region code |
| `gf_locale` | `?gf_locale=en-IN` | Full locale code |

### Region examples (`?gf_region=`)

```
/about?gf_region=IN
/about?gf_region=US
/about?gf_region=UK
/about?gf_region=AE
/about?gf_region=AU
/about?gf_region=CA
/about?gf_region=NZ
/about?gf_region=QA
/about?gf_region=DEFAULT
```

### Locale examples (`?gf_locale=`)

```
/about?gf_locale=en-IN
/about?gf_locale=en-US
/about?gf_locale=en-GB
/about?gf_locale=en-AE
/about?gf_locale=en-AU
/about?gf_locale=en-CA
/about?gf_locale=en-NZ
/about?gf_locale=en-QA
/about?gf_locale=x-default
```

### Local dev

```
http://localhost:3000/about?gf_region=IN
http://localhost:3000/blog?gf_locale=en-GB
http://localhost:3000/how-it-works?gf_region=AE
```

### Production

```
https://www.guruforu.com/about?gf_region=IN
https://www.guruforu.com/about?gf_locale=en-IN
```

### What changes per region (About page)

| Region | Hero badge | Trust strip |
|--------|------------|-------------|
| IN | Expert CBSE & ICSE Tutoring | Class 1–12 |
| US | Expert K-12 Tutoring | K-12 |
| UK | Expert GCSE & A-Level Tutoring | Years 1–13 |
| AE | Expert International Curriculum Tutoring | K-12 |
| DEFAULT | Expert K-12 & International Tutoring | K-12+ |

### Verify in terminal

```bash
# Page title (metadata)
curl -s 'http://localhost:3000/about?gf_region=IN' | grep -o '<title>[^<]*</title>'

# Body content
curl -s 'http://localhost:3000/about?gf_region=IN' | grep -o 'CBSE'

# View full HTML
curl -s 'http://localhost:3000/about?gf_region=UK' > /tmp/about-uk.html && open /tmp/about-uk.html
```

Or use **View Page Source** in the browser (not DevTools Elements — that shows post-hydration DOM).

### Clear debug mode

Click **Clear** on the debug banner, or remove `gf_locale` / `gf_region` from the URL.

---

## Regional About page content

About (`/about`) is fully regionalized on the **server**.

### Data source

`lib/localized-content.json` → `aboutPageContent` and `aboutPageSeo`

### API (`lib/locale.ts`)

```typescript
import { detectLocale, getAboutPageContent, getAboutPageSeo, localizeText } from '../lib/locale'

const headersList = await headers()
const localeInfo = detectLocale(headersList)
const content = getAboutPageContent(localeInfo.region)
const seo = getAboutPageSeo(localeInfo.region)
const localized = (text: string) => localizeText(text, localeInfo.region)
```

### Regionalized fields

- Hero badge, trust strip, exam prep card, curriculum card
- Math / Science topic lists and alignment notes
- FAQ answers (math & science)
- JSON-LD (`EducationalOrganization`, `FAQPage`)
- `<title>`, meta description, Open Graph (via `generateMetadata`)

### Pages with locale on server (headers)

- `/about` — full regional content + SEO
- `/blog` — spelling via `localizeText`
- `/how-it-works` — spelling via `localizeText`

Homepage uses `detectLocale()` without headers at build time → **DEFAULT** on static prerender unless dynamic.

---

## SEO & server rendering

### Server vs client

| | Server-rendered | Client-only |
|--|-----------------|-------------|
| About body, metadata, JSON-LD | ✅ | |
| Nav labels (spelling) | | ✅ `NavMenu` |
| Locale debug banner | | ✅ |

About is **SSR (dynamic)** because it uses `headers()`. HTML is complete in the initial response — good for SEO.

### Metadata

About uses `generateMetadata()` — title/description match detected region.

### Crawler behavior

- Googlebot often crawls from the US → may index **DEFAULT** or **US** body/metadata unless geo headers indicate otherwise.
- DEFAULT copy intentionally includes global keywords: CBSE, ICSE, GCSE, IB, K-12.
- Debug params work for manual QA; crawlers normally do not use them.

### Structured data (About)

- `EducationalOrganization` — region-aware description
- `FAQPage` — region-aware math/science answers

### Blog / Resources SEO

- Static metadata in `generateMetadata()` on `/blog`
- JSON-LD: `Blog`, `BreadcrumbList`, `Organization`
- RSS: `/feed.xml` linked in metadata alternates
- ISR: `revalidate = 3600` (1 hour)

---

## Adding a new region

Example: adding `SG` (Singapore) — adapt as needed.

### 1. `lib/locales.json`

Add to `supportedLocales`:

```json
{
  "code": "en-SG",
  "hreflang": "en-SG",
  "region": "SG",
  "countryCode": "SG",
  "countryName": "Singapore",
  "currency": "SGD",
  "currencySymbol": "$",
  "openGraphLocale": "en_SG",
  "htmlLang": "en"
}
```

Add to `countryCodeMapping` and `languageMapping`:

```json
"SG": "en-SG",
"en-sg": "en-SG"
```

### 2. `lib/locale.ts`

Extend types:

```typescript
export type SupportedLocale = ... | 'en-SG'
export type Region = ... | 'SG'
```

### 3. `lib/localized-content.json`

Add blocks under:

- `textReplacements.SG` (if British spelling)
- `educationalTerms.SG`
- `aboutPageContent.SG`
- `aboutPageSeo.SG`

### 4. Test

```
/about?gf_region=SG
/about?gf_locale=en-SG
```

---

## Key files reference

| Path | Role |
|------|------|
| `app/layout.tsx` | Fonts, global scripts, `LocaleDebugBanner` |
| `app/globals.css` | CSS import chain |
| `app/page.tsx` | Homepage |
| `app/about/page.tsx` | About + `generateMetadata` |
| `app/how-it-works/page.tsx` | How It Works |
| `app/blog/page.tsx` | Resources listing |
| `app/components/NavMenu.tsx` | Top navigation |
| `app/components/PageFooter.tsx` | Footer |
| `app/components/LocaleDebugBanner.tsx` | Debug pill UI |
| `app/components/BlogCategories.tsx` | Topic cards |
| `lib/locale.ts` | Locale detection & helpers |
| `lib/locales.json` | Locale / country config |
| `lib/localized-content.json` | Copy, SEO, About regional content |
| `proxy.ts` | www redirect + locale debug headers |

### Locale helper exports

```typescript
detectLocale(headers?, debugOverride?)
getLocaleConfig(localeCode)
getLocaleDebugParams(searchParams)
getAboutPageContent(region)
getAboutPageSeo(region)
getEducationalTerms(region)
getSEOContent(region)
localizeText(text, region)
generateHreflangLinks(baseUrl, path) // defined, not yet wired to all pages

LOCALE_DEBUG_QUERY   // { locale: 'gf_locale', region: 'gf_region' }
LOCALE_DEBUG_HEADERS // internal header names
```

---

## Caching notes

- **Production**: long-lived cache headers when `IS_PRODUCTION && !DISABLE_CACHE` (`next.config.js`)
- **Development**: no-cache on assets (avoids stale CSS after theme changes)
- **Blog listing**: ISR `revalidate = 3600`

---

## Classroom / external links

| Label | URL |
|-------|-----|
| Go to Classroom | `https://learn.guruforu.com/` |
| Marketing site | `https://www.guruforu.com` |

---

## Quick checklist for developers

- [ ] Test About with `?gf_region=IN` and `?gf_region=UK` before shipping copy changes
- [ ] View **Page Source** to confirm SSR HTML and `<title>`
- [ ] After CSS changes, hard-refresh in dev (or restart dev server)
- [ ] New regional copy → edit `localized-content.json`, not hardcoded in `page.tsx`
- [ ] Keep `overrides.css` last in `globals.css`
- [ ] Do not commit secrets (`.env`, API keys)

---

*Last updated: March 2026 — reflects card-based marketing pages, India locale, locale debug params, and regional About SEO.*
