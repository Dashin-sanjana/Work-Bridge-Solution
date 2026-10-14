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
import NotFound from "./pages/NotFound";
import { getSEO, getSEOTags, isPublicRoute, normalizePath } from "./config/seo";
import { getPageSchemas } from "./data/schema";
import { servicePages } from "./data/servicePages";
import ServiceDetail from "./pages/ServiceDetail";

function MetaUpdater() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    const seo = getSEO(location.pathname);
    document.title = seo.title;
    document.head.querySelectorAll("[data-seo]").forEach(tag => tag.remove());
    getSEOTags(location.pathname).forEach(tag => {
      const element = document.createElement("meta");
      element.dataset.seo = "";
      Object.entries(tag).forEach(([key, value]) => element.setAttribute(key, value));
      document.head.append(element);
    });
    if (seo.canonical) {
      const canonical = document.createElement("link");
      canonical.dataset.seo = "";
      canonical.rel = "canonical";
      canonical.href = seo.canonical;
      document.head.append(canonical);
    }
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
  const path = normalizePath(useLocation().pathname);
  return (
    <>
      <MetaUpdater />
      {isPublicRoute(path) ? getPageSchemas(path).map(schema => <script key={schema["@id"]} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />) : null}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          {servicePages.map(page => <Route key={page.path} path={page.path} element={<ServiceDetail page={page} />} />)}
          <Route path="/industries" element={<Industries />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
