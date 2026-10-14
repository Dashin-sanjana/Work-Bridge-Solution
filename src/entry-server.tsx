import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import App from "./App";

export { publicRoutes, renderSEOHead, renderSitemap } from "./config/seo";
export { servicePages } from "./data/servicePages";
export { default as quoteHandler } from "../api/quote";
export { getContactLinks, contactLinks, contactNumbers, inquirySubject, whatsappInquiry } from "./config/contact";

export function render(path: string) {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={path}>
        <MotionConfig reducedMotion="user"><App /></MotionConfig>
      </StaticRouter>
    </React.StrictMode>
  );
}
