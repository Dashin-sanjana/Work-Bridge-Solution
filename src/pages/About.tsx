import CTASection from "../components/CTASection";
import PageHeader from "../components/PageHeader";
import SectionHeading from "../components/SectionHeading";

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Commercial cleaning manpower with a corporate service mindset"
        text="Work Bridge Solution (Pvt) Ltd supports businesses that need professional cleaning personnel for hospitality, residential, office, and commercial environments."
      />
      <section className="section">
        <div className="container content-grid">
          <div>
            <SectionHeading eyebrow="Company Focus" title="Built for B2B property operations" />
            <p>
              The company works with clients that need cleaning staff as part of daily facility operations. Its role is to understand the client's property, staffing expectation, and operating context, then support a suitable cleaning manpower arrangement.
            </p>
            <p>
              Work Bridge Solution is positioned for hotels, resorts, apartment complexes, corporate offices, and other managed commercial spaces where presentation, staffing clarity, and communication matter.
            </p>
          </div>
          <div className="statement-grid">
            <article><h3>Mission</h3><p>To provide professional cleaning manpower solutions that help business environments remain clean, organized, and welcoming.</p></article>
            <article><h3>Vision</h3><p>To become a trusted workforce partner for Sri Lankan businesses that value dependable cleaning personnel and clear service coordination.</p></article>
            <article><h3>Service Philosophy</h3><p>Understand the facility first, recommend responsibly, and keep communication practical throughout the engagement.</p></article>
            <article><h3>Service Approach</h3><p>Focus on facility requirements, role clarity, service arrangements, and practical communication throughout the enquiry.</p></article>
          </div>
        </div>
      </section>
      <section className="section section-muted">
        <div className="container values-grid">
          {["Business-focused service", "Clear communication", "Facility requirements", "Flexible planning", "Service coordination", "Property standards"].map((value) => (
            <div key={value}>{value}</div>
          ))}
        </div>
      </section>
      <CTASection />
    </>
  );
}
