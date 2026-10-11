type PageHeaderProps = {
  eyebrow: string;
  title: string;
  text: string;
};

export default function PageHeader({ eyebrow, title, text }: PageHeaderProps) {
  return (
    <section className="page-header">
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  );
}
