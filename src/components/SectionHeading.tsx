import ScrollReveal from "./ScrollReveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  text?: string;
  align?: "left" | "center";
};

export default function SectionHeading({ eyebrow, title, text, align = "left" }: SectionHeadingProps) {
  return (
    <ScrollReveal className={`section-heading ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text ? <p className="section-copy">{text}</p> : null}
    </ScrollReveal>
  );
}
