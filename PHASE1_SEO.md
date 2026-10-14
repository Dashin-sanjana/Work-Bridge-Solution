# Phase 1: Crawlable HTML and URL Consistency

## Architecture

The app remains React, Vite, TypeScript and BrowserRouter. `scripts/build.mjs`
uses Vite's native client and SSR builds, then React's `renderToString` with
StaticRouter to generate `dist/index.html`, six named route HTML files and
`dist/404.html`. The browser hydrates these pages with `hydrateRoot`; development
still supports client rendering. All visitors receive the same HTML; there is
no bot detection, cloaking or runtime rendering service.

`src/config/seo.ts` owns route metadata. The build writes it into each page's
initial head. Client navigation updates that same metadata. Known pages have
one self-referencing canonical on `https://www.workbridgesolution.com`.
Unknown pages have `noindex,follow` and no misleading homepage canonical.

The social image is the supplied original company logo, not generated service
photography. Organization and Service entities use the preferred domain and
linked entity IDs. Coverage is Sri Lanka; Colombo is described as the primary
operational focus, not a physical office. Existing Ambalangoda address details
are retained without making a new registered-office claim. No LocalBusiness,
reviews, ratings or new location pages were added pending further confirmation.

The existing header, footer, stylesheet, animation components, tab controls,
contact form and API handler were not edited by Phase 1. The contact experience
now uses direct Email, WhatsApp and Phone actions rather than a visible form.
The earlier server adapter remains available for legacy tooling and callers. Geographic copy
changes are confined to the existing homepage paragraph and services intro.
The HTML template's noscript stylesheet exposes animation-hidden content when
JavaScript is disabled; it does not apply to normal JavaScript-enabled layouts.

## Vercel Routing

Vercel serves generated files through `cleanUrls: true`: `/about` resolves to
`about.html`. `trailingSlash: false` redirects `/about/` to `/about`. The old
SPA-wide rewrite has been removed. Vercel's static custom-404 mechanism serves
`404.html` with a 404 response for unmatched URLs. `/api/quote` is still
discovered from the `api/quote.ts` function. No host-level redirects
were added or removed; retain the existing non-www to www domain redirect in
Vercel project settings.

The included preview server models these configured static routes and runs the
existing quote handler locally. Local tests and schema validation do not replace
checking an actual Vercel Preview Deployment before production promotion.

## Validation

Run `npm ci`, `npm run build`, `npm run lint`, `npm test`, and
`npm run verify:vercel`. The last command needs network access; it validates all
configured fields against Vercel's current published definitions without
compiling unrelated experimental fields that mix schema draft conventions.

Run `npm run preview -- --port 4173` to inspect the production build locally.
Do not use Vite's development SPA fallback as evidence of production status
codes. `npm test` checks initial HTML, unique metadata, JSON-LD, all internal
links/anchors, sitemap, 200/404 responses, redirects and quote-handler behavior.
Email success/failure tests use mocks and send no real inquiries.

The active website uses direct contact links and needs no email-provider
environment variable; see `EMAIL_DELIVERY.md`. The retained legacy API uses
optional `WEB3FORMS_ACCESS_KEY` and returns 503 if it is unset.

## Deployment (Manual, After Approval)

1. Review this patch with the pre-existing header/footer changes. Keep those
   changes intact; the Phase 1 work does not alter their files.
2. Commit the approved work and create a Vercel Preview Deployment using the
   existing project. Build command: `npm run build`; output directory: `dist`.
3. Confirm that all seven routes return 200 with their own initial HTML and
   exactly one canonical/description. Check a random invalid URL returns 404,
   `/about/` and `/about.html` redirect to `/about`, and `/api/quote` GET returns
   405 (not the homepage). Active contact links do not call this legacy API.
   Do not send a real message or place a call without the owner's approval.
4. Check hydration diagnostics, mobile navigation, tabs, direct contact actions and existing
   service-anchor deep links. Confirm no Vercel dashboard rewrite overrides the
   checked-in configuration and the non-www redirect remains enabled.
5. Only after approval, promote the checked preview to production. Recheck both
   hostnames and submit `https://www.workbridgesolution.com/sitemap.xml` in the
   search webmaster tools. Nothing in these scripts publishes a deployment.

## Rollback

For a deployed release, promote the previous known-good Vercel deployment;
retain the existing domain and email environment settings.

For source rollback, revert the dedicated Phase 1 commit after it exists, then
run `npm ci` to restore its previous lockfile dependencies. Do not reset the
working tree or restore `src/components/Layout.tsx` or `src/styles.css`: those
contain the earlier user-approved header/footer work. Until committed, use a
reviewed, file-specific revert of only the Phase 1 files listed below; remove
only newly added Phase 1 files. No rollback is executed automatically.

## Exact Phase 1 Files

Modified: `.gitignore`, `README.md`, `index.html`, `package.json`, `package-lock.json`,
`public/robots.txt`, `public/sitemap.xml`, `src/App.tsx`, `src/main.tsx`,
`src/config/company.ts`, `src/data/schema.ts`, `src/pages/Home.tsx`,
`src/pages/Services.tsx`, `tsconfig.node.json`, `vercel.json`, `vite.config.ts`.

Added: `src/config/seo.ts`, `src/entry-server.tsx`, `src/pages/NotFound.tsx`,
`scripts/build.mjs`, `scripts/preview.mjs`, `scripts/verify-vercel.mjs`,
`tests/phase1.test.mjs`, `PHASE1_SEO.md`.

## Recorded QA Results

- TypeScript and the production prerendered build pass; ESLint passes.
- The initial HTML/metadata, link/anchor, local HTTP and mocked API test suite
  passes. It includes a scripting-disabled HTML parse for the noscript fallback.
- All configured Vercel fields pass their official schema definitions.
- Direct hydration checks on all public routes and an unknown URL produced no
  hydration warnings. Browser checks exercised service tabs, client navigation,
  form validation, mobile menu opening and Escape-to-close.
- At 320px the homepage and contact page had no horizontal overflow; the desktop
  view was inspected at 1440px. The existing header and stylesheet checksums are
  unchanged during Phase 1. Contact-specific styling was later added when the
  form was replaced by direct-contact cards. The retained API was previously
  updated for Web3Forms with separately mocked delivery tests.
- Successful and failed email delivery were tested with mocks, not real emails.
  Live Vercel routing/domain verification is deferred until an approved Preview
  Deployment; no production deployment or push was performed.
