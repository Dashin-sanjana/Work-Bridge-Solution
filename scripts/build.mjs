import { build } from "vite";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { optimizeImages } from "./optimize-images.mjs";

await optimizeImages();
await build();
await build({ build: { ssr: "src/entry-server.tsx", outDir: ".prerender", emptyOutDir: true } });
const { render, renderSEOHead, renderSitemap, publicRoutes } = await import(pathToFileURL(resolve(".prerender/entry-server.js")));
const template = await readFile("dist/index.html", "utf8");
for (const marker of ["<!--seo-head-->", "<!--app-html-->"]) {
  if (!template.includes(marker)) throw new Error(`Build template is missing ${marker}`);
}
for (const path of [...publicRoutes, "/404"]) {
  const html = template.replace("<!--seo-head-->", () => renderSEOHead(path))
    .replace("<!--app-html-->", () => render(path));
  const file = `dist/${path === "/" ? "index" : path.slice(1)}.html`;
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}
await writeFile("dist/sitemap.xml", renderSitemap());
console.log(`Prerendered ${publicRoutes.length} public routes and a custom 404 page.`);
