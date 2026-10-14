import { ArrowUpRight, Check, Copy, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import PageHeader from "../components/PageHeader";
import ScrollReveal from "../components/ScrollReveal";
import { company } from "../config/company";
import { contactLinks, contactNumbers } from "../config/contact";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(company.email);
      setCopied(true);
      setCopyMessage("Email address copied.");
    } catch {
      setCopyMessage("Unable to copy. You can select the displayed email address.");
    }
  }

  return <>
    <PageHeader eyebrow="Contact Work Bridge Solution" title="Let's talk about your property." text="Connect with us for commercial cleaning and workforce supply, with a Colombo focus and island-wide availability across Sri Lanka." />
    <section className="section direct-contact-section">
      <div className="container">
        <div className="direct-contact-grid">
          <ScrollReveal>
            <article className="direct-contact-card">
              <span className="direct-contact-icon"><Mail size={25} strokeWidth={1.6} aria-hidden="true" /></span>
              <h2>Email</h2>
              <p>Share your property details and staffing requirements with our team.</p>
              <div className="direct-email-row"><span className="direct-contact-detail">{company.email}</span><button className="copy-email" type="button" onClick={copyEmail} title={copied ? "Email copied" : "Copy email address"} aria-label={copied ? "Email copied" : "Copy email address"}>{copied ? <Check size={16} /> : <Copy size={16} />}</button></div>
              <span className="sr-only" role="status">{copyMessage}</span>
              <a className="btn btn-primary" href={contactLinks.email}>Send an Email <ArrowUpRight size={18} aria-hidden="true" /></a>
            </article>
          </ScrollReveal>
          <ContactCard icon={MessageCircle} title="WhatsApp" description="Start a conversation about cleaning workforce support for your business." channel="whatsapp" delay={0.06} />
          <ContactCard icon={Phone} title="Phone Call" description="Speak with us about your property and the workforce it needs." channel="phone" delay={0.12} />
        </div>
        <div className="direct-contact-context"><div><MapPin size={19} strokeWidth={1.6} aria-hidden="true" /><div><h3>Office Address</h3><p>{company.addressLines.join(", ")}</p></div></div><span>Colombo focus.<br />Island-wide service availability.</span></div>
      </div>
    </section>
  </>;
}

function ContactCard({ icon: Icon, title, description, channel, delay }: { icon: LucideIcon; title: string; description: string; channel: "phone" | "whatsapp"; delay: number }) {
  return <ScrollReveal delay={delay}><article className="direct-contact-card">
    <span className="direct-contact-icon"><Icon size={25} strokeWidth={1.6} aria-hidden="true" /></span>
    <h2>{title}</h2><p>{description}</p>
    <div className="direct-contact-actions">{contactNumbers.map(contact => contact[channel] ? <a key={contact.number} className="btn btn-primary" href={contact[channel]!} aria-label={`${channel === "phone" ? "Call" : "WhatsApp"} ${contact.number}`} target={channel === "whatsapp" ? "_blank" : undefined} rel={channel === "whatsapp" ? "noopener noreferrer" : undefined}>{contact.number}<ArrowUpRight size={18} aria-hidden="true" /></a> : null)}</div>
  </article></ScrollReveal>;
}
