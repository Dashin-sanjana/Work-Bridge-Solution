import CTASection from "../components/CTASection";
import PageHeader from "../components/PageHeader";
import { services } from "../data/siteData";

export default function Services() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Cleaning manpower services for commercial facilities"
        text="Choose the staffing category that best matches your property, then request a quotation with your expected staff count, location, and starting date."
      />
      <section className="section">
        <div className="container service-detail-list">
          {services.map((service) => (
            <article className="service-detail" id={service.slug} key={service.slug}>
              <img src={service.image} alt={`${service.title} setting`} />
              <div>
                <service.icon className="detail-icon" aria-hidden="true" />
                <h2>{service.title}</h2>
                <p>{service.summary}</p>
                <h3>Relevant benefits</h3>
                <ul>{service.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
                <h3>Facilities served</h3>
                <ul>{service.facilities.map((facility) => <li key={facility}>{facility}</li>)}</ul>
                <a className="btn btn-primary" href="/contact">Request a Quote</a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CTASection />
    </>
  );
}
