import PageHeader from "../components/PageHeader";
import { company } from "../config/company";

export default function Privacy() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="Privacy Policy"
        text="How Work Bridge Solution handles information shared through direct business inquiries."
      />
      <section className="section">
        <div className="container prose-block">
          <p>
            Information shared through direct business inquiries is used to review and respond to commercial cleaning and workforce requirements.
          </p>
          <p>
            Inquiry details may include contact person name, organization, business email, phone number, facility type, property location, staffing requirement, preferred starting date, and additional requirements.
          </p>
          <p>
            For privacy questions, contact <a className="inline-contact-link" href={`mailto:${company.email}`}>{company.email}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
