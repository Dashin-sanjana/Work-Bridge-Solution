import CTASection from "../components/CTASection";
import { IndustryCard } from "../components/Cards";
import PageHeader from "../components/PageHeader";
import { industries } from "../data/siteData";

export default function Industries() {
  return (
    <>
      <PageHeader
        eyebrow="Industries"
        title="Cleaning workforce solutions for managed properties"
        text="Work Bridge Solution supports businesses and property managers that are planning cleaning staff and service arrangements for their facilities."
      />
      <section className="section">
        <div className="container card-grid three">
          {industries.map((industry) => (
            <IndustryCard key={industry.title} industry={industry} />
          ))}
        </div>
      </section>
      <CTASection />
    </>
  );
}
