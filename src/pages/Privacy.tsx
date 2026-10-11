import PageHeader from "../components/PageHeader";
import { company } from "../config/company";

export default function Privacy() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="Privacy Policy"
        text="How Work Bridge Solution handles business inquiry information submitted through this website."
      />
      <section className="section">
        <div className="container prose-block">
          <p>
            Information submitted through the quotation form is used to review and respond to business cleaning manpower inquiries.
          </p>
          <p>
            Inquiry details may include contact person name, organization, business email, phone number, facility type, property location, staffing requirement, preferred starting date, and additional requirements.
          </p>
          <p>
            For privacy questions, contact <a href={`mailto:${company.email}`}>{company.email}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
