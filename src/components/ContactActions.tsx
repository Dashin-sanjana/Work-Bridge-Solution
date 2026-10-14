import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { company } from "../config/company";
import { contactLinks, contactNumbers } from "../config/contact";

export default function ContactActions() {
  return <div className="service-contact-actions" aria-label="Business enquiry contact options">
    <a className="text-link" href={contactLinks.email}><Mail size={17} aria-hidden="true" />{company.email}</a>
    {contactNumbers.map(contact => <div key={contact.number}>
      {contact.phone ? <a className="text-link" href={contact.phone} aria-label={`Call ${contact.number}`}><Phone size={17} aria-hidden="true" />{contact.number}</a> : null}
      {contact.whatsapp ? <a className="text-link" href={contact.whatsapp} aria-label={`WhatsApp ${contact.number}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true" />WhatsApp<ArrowUpRight size={15} aria-hidden="true" /></a> : null}
    </div>)}
  </div>;
}
