import { ArrowRight, ArrowUp, ArrowUpRight, Globe2, Mail, MapPin, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "framer-motion";
import { company, navItems } from "../config/company";
import { services } from "../data/siteData";
import ScrollReveal from "./ScrollReveal";
import { contactLinks, contactNumbers } from "../config/contact";
import { servicePath } from "../data/servicePages";

function Logo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link to="/" className="logo-link" aria-label="Work Bridge Solution home" onClick={onNavigate}>
      <img src="/work-bridge-logo-transparent.png" alt="Work Bridge Solution logo" />
    </Link>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [elevated, setElevated] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const { pathname } = useLocation();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const update = () => { setScrolled(window.scrollY > 600); setElevated(window.scrollY > 16); };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (menuRef.current) menuRef.current.inert = !open;
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggleRef.current?.focus(); }
    };
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setOpen(false);
    };
    const media = window.matchMedia("(min-width: 1025px)");
    const closeOnDesktop = () => { if (media.matches) setOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    media.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
      media.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  function returnToTop() {
    window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }

  return (
    <div className="min-h-screen bg-white text-brand-ink">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <motion.div className="page-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <header ref={headerRef} className={`site-header${elevated ? " is-elevated" : ""}`} onBlur={event => { if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
        <div className="utility-bar"><div className="container utility-shell"><span><Globe2 size={12} />Sri Lanka <span className="utility-divider" />Commercial cleaning manpower</span><a href={contactLinks.email}><Mail size={13} />{company.email}<ArrowUpRight size={12} /></a></div></div>
        <nav className="container nav-shell" aria-label="Main navigation">
          <div className="header-brand"><Logo onNavigate={() => setOpen(false)} /><span className="brand-note">People for<br />exceptional spaces.</span></div>
          <div className="desktop-nav">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === "/"} className={({ isActive }) => (isActive ? "active" : "")}>
                {({ isActive }) => <><span>{item.label}</span>{isActive ? <motion.span className="nav-marker" layoutId="desktop-nav-marker" transition={{ duration: reduce ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }} /> : null}</>}
              </NavLink>
            ))}
          </div>
          <Link to="/contact" className="btn btn-primary nav-cta">
            Request a Quote <span className="nav-cta-arrow"><ArrowUpRight size={18} /></span>
          </Link>
          <button ref={toggleRef} className="mobile-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label="Toggle navigation menu">
            <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: reduce ? 0 : 0.18 }}>{open ? <X size={22} /> : <Menu size={22} />}</motion.span>
          </button>
        </nav>
        <AnimatePresence initial={false}>
        {open ? (
          <motion.div ref={menuRef} id="mobile-navigation" className="mobile-panel" initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduce ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}>
            <nav aria-label="Mobile navigation">
            <p className="mobile-menu-label">Explore Work Bridge</p>
            <ul>{navItems.map((item, index) => <motion.li key={item.path} initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduce ? 0 : 0.2, delay: reduce ? 0 : index * 0.025 }}><NavLink to={item.path} end={item.path === "/"} onClick={() => setOpen(false)}><span className="mobile-link-number" aria-hidden="true">0{index + 1}</span><span>{item.label}</span><ArrowUpRight size={18} /></NavLink></motion.li>)}</ul>
            <Link to="/contact" className="btn btn-primary" onClick={() => setOpen(false)}>
              Request a Quote <ArrowRight size={18} />
            </Link>
            <a className="mobile-email" href={contactLinks.email}><Mail size={15} />{company.email}</a>
            </nav>
          </motion.div>
        ) : null}
        </AnimatePresence>
      </header>

      <motion.main id="main-content" tabIndex={-1} key={pathname} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.3, ease: "easeOut" }}>
        <Outlet />
      </motion.main>

      <AnimatePresence>{scrolled ? <motion.button className="back-top" type="button" title="Back to top" aria-label="Back to top" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.18 }} onClick={returnToTop}><ArrowUp size={20} /></motion.button> : null}</AnimatePresence>

      <footer className="footer">
        <div className="footer-brand-band"><div className="container footer-brand-row"><Logo /><div><p>Good people. Better spaces.</p><span>Professional cleaning manpower for your business.</span></div><Link to="/about" className="footer-about-link">Meet your workforce partner <ArrowUpRight size={20} /></Link></div></div>
        <ScrollReveal className="container footer-grid">
          <nav aria-label="Footer navigation"><h3>Explore</h3>{navItems.map(item => <Link key={item.path} to={item.path}>{item.label}<ArrowUpRight size={14} /></Link>)}</nav>
          <nav aria-label="Footer services"><h3>Workforce Solutions</h3>{services.map(service => <Link key={service.slug} to={servicePath(service.slug)}>{service.title}<ArrowUpRight size={14} /></Link>)}<span className="footer-service-note">Hospitality · Residential · Commercial</span></nav>
          <div className="footer-contact"><h3>Let's start a conversation.</h3><a className="footer-email" href={contactLinks.email}>{company.email}<ArrowUpRight size={20} /></a><div className="footer-address"><MapPin size={20} /><span>{company.addressLines.slice(0, 3).join(", ")}<br />{company.addressLines.slice(3).join(", ")}</span></div>{contactNumbers.map(contact => <div key={contact.number} className="footer-contact-number">{contact.phone ? <a href={contact.phone} aria-label={`Call ${contact.number}`}>{contact.number}</a> : null}{contact.whatsapp ? <a href={contact.whatsapp} aria-label={`WhatsApp ${contact.number}`} target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={14} /></a> : null}</div>)}</div>
        </ScrollReveal>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} {company.name}. All rights reserved.</span>
          <div><Link to="/privacy">Privacy Policy</Link><button type="button" onClick={returnToTop} aria-label="Return to top" title="Return to top"><ArrowUp size={17} /></button></div>
        </div>
      </footer>
    </div>
  );
}
