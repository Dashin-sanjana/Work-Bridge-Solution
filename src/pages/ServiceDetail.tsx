import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "../components/PageHeader";
import CustomerAnswers from "../components/CustomerAnswers";
import ContactActions from "../components/ContactActions";
import ScrollReveal from "../components/ScrollReveal";
import { commonAnswers, servicePages, type ServicePageContent } from "../data/servicePages";
import { services } from "../data/siteData";
import FacilityImage from "../components/FacilityImage";

export default function ServiceDetail({ page }: { page: ServicePageContent }) {
  const service = services.find(item => item.slug === page.legacySlug)!;
  return <>
    <nav className="container service-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><Link to="/services">Services</Link><span aria-hidden="true">/</span><span aria-current="page">{service.title}</span></nav>
    <PageHeader eyebrow="Work Bridge Solution Services" title={page.title} text={page.introduction} />
    <section className="section"><div className="container service-detail">
      <ScrollReveal><FacilityImage src={service.image} alt={`Illustrative ${service.title.toLowerCase()} facility setting`} /></ScrollReveal>
      <ScrollReveal><h2>Service scope</h2><ul>{page.scope.map(item => <li key={item}>{item}</li>)}</ul><h3>Intended business customers</h3><p>{service.facilities.join(", ")}.</p><h3>Colombo focus. Island-wide coverage.</h3><p>Colombo is our primary operational focus. Businesses throughout Sri Lanka can enquire about cleaning workforce support for their facilities.</p><Link className="text-link" to="/industries">Explore industries served<ArrowUpRight size={17} /></Link></ScrollReveal>
    </div></section>
    <section className="section section-muted"><div className="container content-grid"><div><h2>{page.planningTitle}</h2><p>{page.planning}</p></div><div><h2>Prepare your enquiry</h2><ul className="service-enquiry-list">{page.enquiry.map(item => <li key={item}>{item}</li>)}</ul><p>These details help start a discussion; they are not a promise of availability or an agreed service package.</p></div></div></section>
    <CustomerAnswers answers={[...page.answers, commonAnswers[2]]} />
    <section className="section"><div className="container"><h2>Discuss your requirements</h2><p className="section-copy">Contact Work Bridge Solution directly about your property and cleaning workforce needs.</p><ContactActions /><Link className="text-link" to="/contact">Contact details<ArrowUpRight size={17} /></Link></div></section>
    <section className="section section-muted"><div className="container"><h2>Related cleaning services</h2><div className="related-services">{servicePages.filter(item => item.path !== page.path).map(item => <Link className="text-link" key={item.path} to={item.path}>{services.find(service => service.slug === item.legacySlug)!.title}<ArrowUpRight size={17} /></Link>)}</div><Link className="text-link" to="/services">All services<ArrowUpRight size={17} /></Link></div></section>
  </>;
}
