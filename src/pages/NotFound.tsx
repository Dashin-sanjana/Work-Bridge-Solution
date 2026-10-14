import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function NotFound() {
  return <>
    <PageHeader eyebrow="404 / Page Not Found" title="This page couldn't be found." text="The link may have changed, or the address may be incorrect. Explore our services or return to the homepage." />
    <section className="section"><div className="container hero-actions"><Link to="/" className="btn btn-primary">Return home <ArrowRight size={18} /></Link><Link to="/services" className="btn btn-outline">Explore services</Link></div></section>
  </>;
}
