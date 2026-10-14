import CTASection from "../components/CTASection";
import PageHeader from "../components/PageHeader";
import { services } from "../data/siteData";
import { Link } from "react-router-dom";
import { commonAnswers, servicePath } from "../data/servicePages";
import CustomerAnswers from "../components/CustomerAnswers";
import ContactActions from "../components/ContactActions";
import FacilityImage from "../components/FacilityImage";

export default function Services() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Cleaning manpower services for commercial facilities"
        text="Commercial cleaning and workforce supply with a primary focus on Colombo and island-wide availability across Sri Lanka. Request support tailored to your property."
      />
      <section className="section">
        <div className="container service-detail-list">
          {services.map((service) => (
            <article className="service-detail" id={service.slug} key={service.slug}>
              <FacilityImage src={service.image} alt={`Illustrative ${service.title.toLowerCase()} setting`} />
              <div>
                <service.icon className="detail-icon" aria-hidden="true" />
                <h2>{service.title}</h2>
                <p>{service.summary}</p>
                <h3>Relevant benefits</h3>
                <ul>{service.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
                <h3>Facilities served</h3>
                <ul>{service.facilities.map((facility) => <li key={facility}>{facility}</li>)}</ul>
                <Link className="text-link" to={servicePath(service.slug)}>Service scope and customer questions</Link>
                <a className="btn btn-primary" href="/contact">Request a Quote</a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CustomerAnswers answers={commonAnswers} />
      <section className="section"><div className="container"><h2>Contact our team</h2><ContactActions /></div></section>
      <CTASection />
    </>
  );
}
