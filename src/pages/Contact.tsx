import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type React from "react";
import QuoteForm from "../components/QuoteForm";
import PageHeader from "../components/PageHeader";
import { company } from "../config/company";

export default function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Request a quotation for cleaning manpower"
        text="Share the facility type, staff count, location, and timing so Work Bridge Solution can review your requirement."
      />
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-panel">
            <h2>Company Information</h2>
            <Info icon={Mail} title="Email" text={company.email} href={`mailto:${company.email}`} />
            <Info icon={MapPin} title="Office Address" text={company.addressLines.join(", ")} href={company.mapUrl} />
            <Info icon={Phone} title="Telephone" text="To be provided" />
            <Info icon={MessageCircle} title="WhatsApp" text="Prepared for future configuration" />
          </div>
          <QuoteForm />
        </div>
      </section>
    </>
  );
}

function Info({ icon: Icon, title, text, href }: { icon: React.ElementType; title: string; text: string; href?: string }) {
  return (
    <div className="contact-item">
      <Icon aria-hidden="true" />
      <div>
        <h3>{title}</h3>
        {href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{text}</a> : <p>{text}</p>}
      </div>
    </div>
  );
}
