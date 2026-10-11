import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Industries from "./pages/Industries";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";

const titles: Record<string, string> = {
  "/": "Work Bridge Solution | Cleaning Manpower Supply Sri Lanka",
  "/about": "About Work Bridge Solution | Commercial Cleaning Workforce",
  "/services": "Cleaning Manpower Services | Work Bridge Solution",
  "/industries": "Industries We Serve | Work Bridge Solution",
  "/portfolio": "Our Capabilities | Work Bridge Solution",
  "/contact": "Request a Quote | Work Bridge Solution",
  "/privacy": "Privacy Policy | Work Bridge Solution"
};

function MetaUpdater() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    document.title = titles[location.pathname] ?? titles["/"];
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = `https://workbridgesolution.com${location.pathname}`;
  }, [location.pathname]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
      if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
      else window.scrollTo({ top: 0, behavior: "instant" });
      if (previousPath.current !== location.pathname) document.getElementById("main-content")?.focus({ preventScroll: true });
      previousPath.current = location.pathname;
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  return (
    <>
      <MetaUpdater />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
        </Route>
      </Routes>
    </>
  );
}
