import sharp from "sharp";
import { stat } from "node:fs/promises";

export async function optimizeImages() {
  const source = "public/hospitality-hero.jpg";
  const original = await stat(source);
  for (const width of [640, 1280, 1536]) {
    const target = `public/hospitality-hero-${width}.webp`;
    const existing = await stat(target).catch(() => null);
    if (existing && existing.mtimeMs >= original.mtimeMs) continue;
    await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality: 88 }).toFile(target);
  }
}
