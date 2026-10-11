import { Link } from "react-router-dom";
import type { Industry, Service } from "../data/siteData";
import type React from "react";
import { ArrowUpRight } from "lucide-react";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <article className="image-card" id={service.slug}>
      <img src={service.image} alt={`${service.title} for commercial facilities`} loading="lazy" />
      <div className="image-card-body">
        <Icon className="card-icon" aria-hidden="true" />
        <h3>{service.title}</h3>
        <p>{service.summary}</p>
        <Link to={`/services#${service.slug}`} className="text-link">Explore service <ArrowUpRight size={17} /></Link>
      </div>
    </article>
  );
}

export function IndustryCard({ industry }: { industry: Industry }) {
  const Icon = industry.icon;
  return (
    <article className="industry-card">
      <img src={industry.image} alt={`${industry.title} facility`} loading="lazy" />
      <div>
        <Icon className="card-icon" aria-hidden="true" />
        <h3>{industry.title}</h3>
        <p>{industry.summary}</p>
      </div>
    </article>
  );
}

export function FeatureCard({ title, text, icon: Icon }: { title: string; text: string; icon: React.ElementType }) {
  return (
    <article className="feature-card">
      <Icon aria-hidden="true" />
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}
