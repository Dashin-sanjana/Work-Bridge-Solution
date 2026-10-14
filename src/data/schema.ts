import { company } from "../config/company";
import { services } from "./siteData";
import { contactLinks, contactNumbers } from "../config/contact";
import { getSEO } from "../config/seo";
import { servicePages, servicePath } from "./servicePages";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${company.url}/#organization`,
  name: company.name,
  url: company.url,
  email: company.email,
  ...(contactLinks.phone ? { telephone: contactLinks.phone.slice(4) } : {}),
  contactPoint: contactNumbers.filter(contact => contact.phone).map(contact => ({
    "@type": "ContactPoint",
    telephone: contact.phone!.slice(4),
    contactType: "business inquiries",
    areaServed: "LK"
  })),
  logo: `${company.url}/work-bridge-logo.jpg`,
  description: "Commercial cleaning and workforce supply with a primary operational focus on Colombo and island-wide service availability across Sri Lanka.",
  areaServed: { "@type": "Country", name: "Sri Lanka" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "No. 47, Cross Road, Kandegoda",
    addressLocality: "Ambalangoda",
    addressRegion: "Southern Province",
    postalCode: "80300",
    addressCountry: "LK"
  }
};

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${company.url}/services#service-list`,
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      "@id": `${company.url}${servicePath(service.slug)}#service`,
      url: `${company.url}${servicePath(service.slug)}`,
      name: service.title,
      description: service.summary,
      provider: {
        "@id": `${company.url}/#organization`
      },
      areaServed: {
        "@type": "Country",
        name: "Sri Lanka"
      }
    }
  }))
};

export function getPageSchemas(path: string) {
  const seo = getSEO(path);
  const page = servicePages.find(item => item.path === path);
  const url = `${company.url}${path}`;
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${company.url}/` },
      ...(page ? [{ "@type": "ListItem", position: 2, name: "Services", item: `${company.url}/services` }] : []),
      ...(path !== "/" ? [{ "@type": "ListItem", position: page ? 3 : 2, name: page?.title ?? seo.title.split(" | ")[0], item: url }] : [])
    ]
  };
  const webPage = {
    "@context": "https://schema.org", "@type": "WebPage", "@id": `${url}#webpage`, url,
    name: seo.title, description: seo.description, inLanguage: "en",
    publisher: { "@id": organizationSchema["@id"] },
    ...(path !== "/" ? { breadcrumb: { "@id": breadcrumb["@id"] } } : {}),
    ...(page ? { mainEntity: { "@id": `${url}#service` } } : {})
  };
  const service = page ? {
    "@context": "https://schema.org", "@type": "Service", "@id": `${url}#service`, url,
    name: page.title, description: page.introduction,
    serviceType: services.find(item => item.slug === page.legacySlug)!.title,
    provider: { "@id": organizationSchema["@id"] },
    areaServed: { "@type": "Country", name: "Sri Lanka" },
    mainEntityOfPage: { "@id": webPage["@id"] }
  } : null;
  return [organizationSchema, webPage, ...(path !== "/" ? [breadcrumb] : []), ...(service ? [service] : []), ...(path === "/" || path === "/services" ? [serviceSchema] : [])];
}
