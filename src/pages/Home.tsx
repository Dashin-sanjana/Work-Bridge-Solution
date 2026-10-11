import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import CTASection from "../components/CTASection";
import ScrollReveal from "../components/ScrollReveal";
import SectionHeading from "../components/SectionHeading";
import { advantages, approach, industries, services } from "../data/siteData";
import { organizationSchema, serviceSchema } from "../data/schema";

export default function Home() {
  const [activeService, setActiveService] = useState(0);
  const selected = services[activeService];
  const reduce = useReducedMotion();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <section className="hero">
        <img className="hero-background" src="/hospitality-hero.jpg" alt="Illustrative scene of a housekeeping professional cleaning a hotel reception" fetchPriority="high" />
        <div className="container hero-content">
          <p className="eyebrow"><span className="eyebrow-rule" />WORK BRIDGE SOLUTION</p>
          <h1>Cleaning manpower.<br /><span>A higher standard.</span></h1>
          <p className="hero-description">Professional people for spaces that matter.<br />Cleaning workforce solutions for hotels, residences<br className="desktop-break" /> and businesses across Sri Lanka.</p>
          <div className="hero-actions"><Link to="/contact" className="btn btn-primary">Let's discuss your property <ArrowUpRight size={19} /></Link><Link to="/services" className="hero-secondary">Explore services <ArrowRight size={18} /></Link></div>
          <div className="hero-assurance"><ShieldCheck size={18} /><span>Commercial focus. Flexible arrangements.</span></div>
        </div>
        <div className="hero-bottom"><div className="container hero-bottom-inner"><span>YOUR PROPERTY. OUR PEOPLE.</span><a href="#services">Discover the right workforce <ArrowRight size={16} /></a></div></div>
      </section>
      <section className="sector-strip" aria-label="Facilities served"><div className="container sector-inner"><span>Built for your<br /><strong>business environment.</strong></span>{["Hotels & Resorts", "Premium Residences", "Corporate Offices", "Commercial Properties"].map((name, index) => <span key={name}><small>0{index + 1}</small>{name}</span>)}</div></section>
      <section className="section home-services" id="services"><div className="container">
        <div className="section-topline"><SectionHeading eyebrow="01 / Our Expertise" title="The right people. For every space." text="Your property has its own rhythm. We help you plan a cleaning workforce that fits it." /><Link className="text-link" to="/services">View all services <ArrowUpRight size={18} /></Link></div>
        <div className="service-showcase">
          <div className="service-selector" role="tablist" aria-label="Cleaning manpower services" aria-orientation="vertical">
            {services.map((service, index) => <button key={service.slug} id={`service-tab-${index}`} role="tab" aria-selected={activeService === index} aria-controls="service-panel" tabIndex={activeService === index ? 0 : -1} onClick={() => setActiveService(index)} onKeyDown={event => {
              const next = event.key === "ArrowDown" ? (index + 1) % services.length : event.key === "ArrowUp" ? (index + services.length - 1) % services.length : event.key === "Home" ? 0 : event.key === "End" ? services.length - 1 : null;
              if (next !== null) { event.preventDefault(); setActiveService(next); document.getElementById(`service-tab-${next}`)?.focus(); }
            }}><span className="service-number">0{index + 1}</span><span>{service.title}</span><ArrowUpRight size={22} /></button>)}
          </div>
          <div className="service-preview" id="service-panel" role="tabpanel" aria-labelledby={`service-tab-${activeService}`} tabIndex={0}>
            <div className="service-preview-media"><AnimatePresence initial={false}><motion.img key={selected.slug} src={selected.image} alt={`${selected.title} facility setting`} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.3 }} /></AnimatePresence></div>
            <motion.div key={selected.slug} className="service-preview-copy" initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.22 }}><div><p className="eyebrow">{selected.facilities.slice(0, 2).join(" / ")}</p><p>{selected.summary}</p></div><Link className="round-link" to={`/services#${selected.slug}`} aria-label={`Explore ${selected.title}`}><ArrowUpRight size={23} /></Link></motion.div>
          </div>
        </div>
      </div></section>
      <section className="section about-section"><div className="container about-layout">
        <ScrollReveal><div className="about-photo"><img src={industries[2].image} alt="Well-presented contemporary commercial office" loading="lazy" /><div className="photo-caption"><span>PROFESSIONAL SPACES</span><span>Thoughtful workforce planning.</span></div></div></ScrollReveal>
        <ScrollReveal><div className="about-copy"><SectionHeading eyebrow="02 / Your Workforce Partner" title="Behind a well-kept property, there's a dependable team." text="Work Bridge Solution (Pvt) Ltd connects commercial properties with cleaning personnel, bringing practical staffing support and clear coordination to your operations." /><p className="about-body">From hospitality to everyday business spaces, our focus is simple: understand your requirements and help you build the right cleaning workforce.</p><div className="about-principles"><span><Check size={17} />Facility-specific planning</span><span><Check size={17} />Flexible staffing needs</span><span><Check size={17} />Clear communication</span></div><Link to="/about" className="text-link">Meet Work Bridge Solution <ArrowUpRight size={18} /></Link></div></ScrollReveal>
      </div></section>
      <section className="section home-industries"><div className="container">
        <div className="section-topline"><SectionHeading eyebrow="03 / Industries We Serve" title="Every environment. Its own expectations." /><div className="section-aside"><p>Guest-ready hospitality. Well-kept residences. Workplaces ready for the day.</p><Link to="/industries" className="text-link">Explore all industries <ArrowUpRight size={18} /></Link></div></div>
        <div className="industry-gallery">{[industries[0], industries[1], industries[2], industries[4]].map((industry, index) => <ScrollReveal key={industry.title} delay={index * 0.06}><Link to="/industries" className="industry-tile"><div className="industry-photo"><img src={industry.image} alt={industry.title} loading="lazy" /><span className="industry-index">0{index + 1}</span><span className="industry-action"><ArrowUpRight size={23} /></span></div><h3>{industry.title}</h3><p>{industry.summary}</p></Link></ScrollReveal>)}</div>
      </div></section>
      <section className="section advantage-section"><div className="container advantage-layout"><div><SectionHeading eyebrow="04 / The Work Bridge Difference" title="More than personnel. A practical partner." text="The details behind a workforce arrangement make a difference to your day-to-day operations." /><Link className="text-link" to="/contact">Talk to our team <ArrowUpRight size={18} /></Link></div><div className="advantage-list">{advantages.map(item => <div key={item.title}><item.icon size={24} strokeWidth={1.5} /><div><h3>{item.title}</h3><p>{item.text}</p></div><Check size={17} /></div>)}</div></div></section>
      <section className="section"><div className="container"><div className="section-topline"><SectionHeading eyebrow="05 / A Clear Approach" title="Good partnerships start with a conversation." /><Link to="/contact" className="text-link">Start yours <ArrowUpRight size={18} /></Link></div><ol className="process-grid">{approach.map((step, index) => <li key={step}><span>0{index + 1}</span><h3>{["Understand", "Plan", "Coordinate", "Review"][index]}</h3><p>{step}</p></li>)}</ol></div></section>
      <section className="capability-band"><div className="container"><p>Hospitality. Residential. Commercial.</p><Link to="/portfolio">Discover our capabilities <ArrowUpRight size={21} /></Link></div></section>
      <CTASection />
    </>
  );
}
