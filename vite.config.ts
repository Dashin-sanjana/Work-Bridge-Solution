import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { renderSEOHead, renderSitemap } from "./src/config/seo";
import { optimizeImages } from "./scripts/optimize-images.mjs";

export default defineConfig({
  plugins: [react(), {
    name: "development-seo-head",
    apply: "serve",
    async buildStart() { await optimizeImages(); },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split("?")[0] !== "/sitemap.xml") return next();
        response.setHeader("Content-Type", "application/xml");
        response.end(renderSitemap());
      });
    },
    transformIndexHtml(html, context) {
      const path = new URL(context.originalUrl ?? "/", "http://localhost").pathname;
      return html.replace("<!--seo-head-->", () => renderSEOHead(path));
    }
  }],
});
