import { company } from "./company";
import { servicePages } from "../data/servicePages";

type PageSEO = { title: string; description: string };

const existingPages = {
  "/": {
    title: "Commercial Cleaning & Manpower Supply Sri Lanka | Work Bridge",
    description: "Commercial cleaning and workforce supply for hotels, apartments and businesses, with a primary focus on Colombo and island-wide coverage across Sri Lanka."
  },
  "/about": {
    title: "About Work Bridge Solution | Cleaning Workforce Sri Lanka",
    description: "Learn about Work Bridge Solution's commercial cleaning workforce approach, with Colombo as the primary operational focus and island-wide Sri Lanka coverage."
  },
  "/services": {
    title: "Commercial Cleaning & Workforce Services | Work Bridge",
    description: "Explore hotel housekeeping, apartment cleaning staff, office cleaning and outsourced cleaning manpower for Colombo and businesses island-wide in Sri Lanka."
  },
  "/industries": {
    title: "Industries We Serve in Sri Lanka | Work Bridge Solution",
    description: "Cleaning workforce support for hotels, apartments, offices and commercial properties, with a Colombo operational focus and service availability across Sri Lanka."
  },
  "/portfolio": {
    title: "Cleaning Workforce Capabilities | Work Bridge Solution",
    description: "Explore Work Bridge Solution's cleaning manpower capabilities for hospitality, residential and commercial properties in Colombo and throughout Sri Lanka."
  },
  "/contact": {
    title: "Contact Work Bridge Solution | Cleaning Workforce Sri Lanka",
    description: "Contact Work Bridge Solution directly about commercial cleaning and workforce supply, with a Colombo focus and island-wide availability across Sri Lanka."
  },
  "/privacy": {
    title: "Business Inquiry Privacy Policy | Work Bridge Solution",
    description: "Read how Work Bridge Solution uses contact information and staffing requirements shared through direct business inquiries."
  }
} as const satisfies Record<string, PageSEO>;

export const seoPages: Record<string, PageSEO> = {
  ...existingPages,
  ...Object.fromEntries(servicePages.map(page => [page.path, { title: page.seoTitle, description: page.description }]))
};

export type PublicRoute = keyof typeof seoPages;
export const publicRoutes = Object.keys(seoPages) as PublicRoute[];
export const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";
export const isPublicRoute = (path: string): path is PublicRoute => Object.prototype.hasOwnProperty.call(seoPages, path);

export function getSEO(path: string) {
  const normalized = normalizePath(path);
  const known = isPublicRoute(normalized);
  return {
    ...(known ? seoPages[normalized] : {
      title: "Page Not Found | Work Bridge Solution",
      description: "This page could not be found. Explore Work Bridge Solution's cleaning workforce services or contact the team about your staffing requirements."
    }),
    canonical: known ? `${company.url}${normalized}` : null,
    robots: known ? "index,follow,max-image-preview:large" : "noindex,follow",
    image: `${company.url}/work-bridge-logo.jpg`,
    imageAlt: "Official Work Bridge Solution logo"
  };
}

export function getSEOTags(path: string) {
  const seo = getSEO(path);
  return [
    { name: "description", content: seo.description },
    { name: "robots", content: seo.robots },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: company.shortName },
    { property: "og:title", content: seo.title },
    { property: "og:description", content: seo.description },
    ...(seo.canonical ? [{ property: "og:url", content: seo.canonical }] : []),
    { property: "og:image", content: seo.image },
    { property: "og:image:alt", content: seo.imageAlt },
    { property: "og:image:type", content: "image/jpeg" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: seo.title },
    { name: "twitter:description", content: seo.description },
    { name: "twitter:image", content: seo.image },
    { name: "twitter:image:alt", content: seo.imageAlt }
  ];
}

const escapeHTML = (value: string) => value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);

export function renderSEOHead(path: string) {
  const seo = getSEO(path);
  return [
    `<title>${escapeHTML(seo.title)}</title>`,
    ...getSEOTags(path).map(tag => `<meta data-seo ${"name" in tag ? `name="${tag.name}"` : `property="${tag.property}"`} content="${escapeHTML(tag.content)}" />`),
    ...(seo.canonical ? [`<link data-seo rel="canonical" href="${seo.canonical}" />`] : [])
  ].join("\n    ");
}

export function renderSitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicRoutes.map(path => `  <url><loc>${escapeHTML(company.url + path)}</loc></url>`).join("\n")}\n</urlset>\n`;
}
