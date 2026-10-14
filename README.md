# Work Bridge Solution

React, Vite and TypeScript corporate website, deployed manually to Vercel.

```sh
npm ci
npm run dev
```

Production and SEO checks:

```sh
npm run build
npm run lint
npm test
npm run verify:vercel
npm run preview -- --port 4173
```

The build prerenders all public routes and a custom 404 page, then hydrates the
existing React app. See [PHASE1_SEO.md](PHASE1_SEO.md) for architecture,
validation, manual deployment and rollback instructions, and
[PHASE2_IMPLEMENTATION.md](PHASE2_IMPLEMENTATION.md) for service routes,
structured data, sitemap generation, performance work and release gates. See
[EMAIL_DELIVERY.md](EMAIL_DELIVERY.md) for verified direct-contact details and
the retained legacy inquiry API. The active contact page does not use a form
or require a Web3Forms frontend access key.
