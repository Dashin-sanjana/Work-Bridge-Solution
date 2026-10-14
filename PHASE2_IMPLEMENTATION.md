# Phase 2 SEO, AEO, GEO and Website Optimization

## Completed locally

- Added four public, indexable service pages using the cleaning services already represented by the website:
  - `/services/commercial-cleaning`
  - `/services/hotel-housekeeping`
  - `/services/apartment-cleaning`
  - `/services/outsourced-workforce-solutions`
- Kept all seven existing routes and `/services#...` fragment targets working.
- Added unique titles, descriptions, canonicals, H1s and original service content.
- Added visible customer-answer sections, enquiry checklists, related services, breadcrumbs and direct contact actions.
- Linked Home, Services, Industries and footer content to the approved service pages.
- Added Organization, WebPage and BreadcrumbList entities to public pages; approved service pages also receive a connected Service entity. Home and Services retain the approved ItemList.
- Kept the registered Ambalangoda address distinct from the Colombo operational focus and island-wide Sri Lanka coverage.
- Added both official numbers to visible contact areas and structured contact points. Email, Call and WhatsApp remain direct actions; no contact form or active frontend Web3Forms integration was restored.
- Generated the sitemap from the public route registry so route metadata, prerendering and sitemap membership cannot drift independently.
- Added nested route directory creation, strict sitemap tests and draft exclusion tests.
- Added responsive Unsplash `srcset` values, explicit intrinsic image dimensions, lazy decoding/loading for non-critical images, and 640/1280/1536 WebP hero variants. The hero keeps high fetch priority.
- Replaced the CSS font import with preconnect and stylesheet hints while preserving Manrope and the existing visual design.
- Increased compact text-link hit areas and retained reduced-motion handling.

## Deliberately unpublished

`/services/security-staff-supply` and `/services/general-labour-supply` are not routes, links or sitemap entries. Approval drafts live in `drafts/`.

Security requires confirmation of the current licensing and operating model, including whether Work Bridge supplies staff directly or through an appropriately licensed provider. General labour requires approved domestic role scope, exclusions, safety responsibilities and operating model. Neither draft contains publishable capability claims.

## Structured data graph

- Organization: `https://www.workbridgesolution.com/#organization`
- WebPage: `{canonical}#webpage`
- BreadcrumbList: `{canonical}#breadcrumb` on non-home pages
- Service: `{canonical}#service` on approved service pages
- ItemList: `https://www.workbridgesolution.com/services#service-list` on Home and Services

All Service entities reference the Organization as provider and Sri Lanka as `areaServed`. No ratings, reviews, certifications, licences, awards or Colombo branch were added.

## Search Console sitemap investigation

Read-only production verification on 2026-10-12 found:

- Three consecutive `GET https://www.workbridgesolution.com/sitemap.xml` requests returned HTTP 200 and `application/xml`.
- Strict XML validation passed; the production sitemap currently contains the seven released URLs.
- `https://workbridgesolution.com/sitemap.xml` and `http://www.workbridgesolution.com/sitemap.xml` each return one HTTP 308 redirect to the preferred HTTPS www URL.
- Production robots.txt returns HTTP 200, allows crawling and references the preferred sitemap URL.
- The Vercel project protection policy excludes custom production domains from deployment login protection.
- Public DNS/TLS requests completed successfully during these checks.

These results do not clear the Search Console report. Account access is required to inspect the exact submitted property/URL, last fetch details, Page availability result, manual actions and Google-side retry history. Do not change otherwise-valid XML solely because the dashboard reported `Couldn't fetch`.

## Verification performed

- `npm run build`: passed; 11 public routes and the custom 404 were prerendered.
- `npm run lint`: passed.
- `npm test`: 49/49 passed.
- `npm run verify:vercel`: required before preview deployment.
- Browser checks: all 11 routes at desktop and tablet widths; key pages at 390px and 320px. No horizontal overflow, broken images, duplicate IDs or console warnings/errors were observed.
- Hydration checks: homepage tabs respond to click and keyboard; mobile navigation toggles; Copy Email reports success.
- Contact checks: both `tel:` links and both `wa.me` links are correct. No real call or message was made.
- `npm audit --omit=dev`: no production dependency vulnerabilities reported. The full development tree reports 15 advisories inherited through existing build tooling; suggested automatic fixes require major changes to `@vercel/node` or Tailwind and were not applied during this scoped release.

## Performance notes

The original 318 KB JPEG hero now has WebP variants of approximately 40 KB, 90 KB and 116 KB. The current client bundle is approximately 116 KB gzip. Route-level code splitting was reviewed but not introduced because the current synchronous prerenderer depends on all route components being immediately available; adding lazy routes without an async SSR migration would weaken crawlable initial HTML. Measure production Core Web Vitals before making that architectural change. No Core Web Vitals improvement is claimed here.

## Local preview and release checklist

```sh
npm ci
npm run build
npm run lint
npm test
npm run verify:vercel
npm run preview -- --port 4173
```

Before release:

1. Approve the four published cleaning page scopes and wording.
2. Confirm the registered office address remains current.
3. Confirm both listed numbers remain phone- and WhatsApp-enabled.
4. Keep security and general labour drafts unpublished until their factual gates are resolved.
5. Create a Vercel Preview only, verify 11 public routes, draft 404s, generated sitemap, canonicals, JSON-LD, redirects and mobile layouts.
6. Preserve production domains and environment variables. Promote only after explicit approval and save the current production deployment ID for rollback.
7. After production release, resubmit the preferred sitemap only if Search Console evidence supports it, then monitor the last-read status and page indexing report.
