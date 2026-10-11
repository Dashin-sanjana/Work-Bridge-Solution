import { company } from "../config/company";
import { services } from "./siteData";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  url: company.url,
  email: company.email,
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
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      name: service.title,
      description: service.summary,
      provider: {
        "@type": "Organization",
        name: company.name
      },
      areaServed: {
        "@type": "Country",
        name: "Sri Lanka"
      }
    }
  }))
};
