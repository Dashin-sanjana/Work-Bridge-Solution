import { Link } from "react-router-dom";
import CTASection from "../components/CTASection";
import PageHeader from "../components/PageHeader";
import { ServiceCard } from "../components/Cards";
import { services } from "../data/siteData";

export default function Portfolio() {
  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Workforce support. Across your property."
        text="Explore our cleaning manpower capabilities for hospitality, residential and commercial environments."
      />
      <section className="section">
        <div className="container">
          <div className="section-topline"><div className="section-heading"><p className="eyebrow">Our capabilities</p><h2>Cleaning personnel for your operating environment.</h2><p className="section-copy">Every property has different needs. Our services provide a starting point for discussing the right people, roles and staffing arrangement for yours.</p></div><Link className="text-link" to="/contact">Discuss your property</Link></div>
          <div className="card-grid four">{services.map(service => <ServiceCard key={service.slug} service={service} />)}</div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
