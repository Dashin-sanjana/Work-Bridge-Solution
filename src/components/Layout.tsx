import { ArrowRight, ArrowUp, Mail, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "framer-motion";
import { company, navItems } from "../config/company";

function Logo() {
  return (
    <Link to="/" className="logo-link" aria-label="Work Bridge Solution home">
      <img src="/work-bridge-logo-transparent.png" alt="Work Bridge Solution logo" />
    </Link>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const { pathname } = useLocation();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 600);
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

  return (
    <div className="min-h-screen bg-white text-brand-ink">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <motion.div className="page-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <header ref={headerRef} className="site-header">
        <div className="utility-bar"><div className="container utility-shell"><span>Commercial cleaning manpower · Sri Lanka</span><a href={`mailto:${company.email}`}><Mail size={13} />{company.email}</a></div></div>
        <nav className="container nav-shell" aria-label="Main navigation">
          <Logo />
          <div className="desktop-nav">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => (isActive ? "active" : "")}>
                {item.label}
              </NavLink>
            ))}
          </div>
          <Link to="/contact" className="btn btn-primary nav-cta">
            Request a Quote <ArrowRight size={16} />
          </Link>
          <button ref={toggleRef} className="mobile-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label="Toggle navigation menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
        <AnimatePresence initial={false}>
        {open ? (
          <motion.div ref={menuRef} id="mobile-navigation" className="mobile-panel" initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduce ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}>
            <nav aria-label="Mobile navigation">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <Link to="/contact" className="btn btn-primary" onClick={() => setOpen(false)}>
              Request a Quote
            </Link>
            </nav>
          </motion.div>
        ) : null}
        </AnimatePresence>
      </header>

      <motion.main id="main-content" tabIndex={-1} key={pathname} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.3, ease: "easeOut" }}>
        <Outlet />
      </motion.main>

      <AnimatePresence>{scrolled ? <motion.button className="back-top" type="button" title="Back to top" aria-label="Back to top" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.18 }} onClick={() => { window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" }); document.getElementById("main-content")?.focus({ preventScroll: true }); }}><ArrowUp size={20} /></motion.button> : null}</AnimatePresence>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-600">
              Professional cleaning manpower solutions for hotels, apartments, offices, and commercial facilities in Sri Lanka.
            </p>
          </div>
          <div>
            <h3>Quick Links</h3>
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            <h3>Services</h3>
            <Link to="/services#hotel-housekeeping-support">Hotel Housekeeping Support</Link>
            <Link to="/services#apartment-cleaning-staff">Apartment Cleaning Staff</Link>
            <Link to="/services#office-commercial-cleaning">Office & Commercial Cleaning</Link>
            <Link to="/services#outsourced-cleaning-manpower">Outsourced Cleaning Manpower</Link>
          </div>
          <div>
            <h3>Contact</h3>
            <a href={`mailto:${company.email}`}>{company.email}</a>
            <a href={company.mapUrl} target="_blank" rel="noreferrer">
              {company.addressLines.join(", ")}
            </a>
            <span>Telephone: To be provided</span>
            <span>WhatsApp: To be provided</span>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} {company.shortName}. All rights reserved.</span>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}
