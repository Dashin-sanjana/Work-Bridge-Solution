type Props = { src: string; alt: string; className?: string; priority?: boolean };

export default function FacilityImage({ src, alt, className, priority = false }: Props) {
  const remote = src.startsWith("https://images.unsplash.com/");
  const variant = (width: number) => {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    return url.toString();
  };
  const hero = src === "/hospitality-hero.jpg";
  const sizes = priority ? "100vw" : "(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 600px";
  return <picture className={className}>
    {hero ? <source type="image/webp" srcSet="/hospitality-hero-640.webp 640w, /hospitality-hero-1280.webp 1280w, /hospitality-hero-1536.webp 1536w" sizes={sizes} /> : null}
    <img src={remote ? variant(1200) : src} srcSet={remote ? [480, 800, 1200].map(width => `${variant(width)} ${width}w`).join(", ") : undefined} sizes={remote ? sizes : undefined} alt={alt} width={hero ? 1536 : 1200} height={hero ? 1024 : 800} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" />
  </picture>;
}
