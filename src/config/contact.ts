import { company } from "./company";

export const inquirySubject = "Business Inquiry - Work Bridge Solution";
export const whatsappInquiry = "Hello Work Bridge Solution, I would like to discuss cleaning and workforce support for my business.";

function internationalNumber(value: string) {
  const number = value.trim().replace(/[\s()-]/g, "");
  return /^\+?[1-9]\d{6,14}$/.test(number) ? number : null;
}

export function getContactLinks(details: { email: string; phone: string; whatsapp: string }) {
  const phone = internationalNumber(details.phone);
  const whatsapp = internationalNumber(details.whatsapp);
  return {
    email: `mailto:${details.email}?subject=${encodeURIComponent(inquirySubject)}`,
    phone: phone ? `tel:${phone}` : null,
    whatsapp: whatsapp ? `https://wa.me/${whatsapp.replace(/^\+/, "")}?text=${encodeURIComponent(whatsappInquiry)}` : null
  };
}

export const contactNumbers = company.contactNumbers.map(number => ({
  number,
  ...getContactLinks({ email: company.email, phone: number, whatsapp: number })
}));

export const contactLinks = getContactLinks({ email: company.email, phone: company.contactNumbers[0], whatsapp: company.contactNumbers[0] });
