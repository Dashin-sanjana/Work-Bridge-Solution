import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="cta-band">
      <div className="container cta-shell">
        <div>
          <p className="eyebrow text-white/80">Let's work together</p>
          <h2>The right people for a cleaner property.</h2>
          <p>Tell us about your facility. We'll help you plan the cleaning workforce it needs.</p>
        </div>
        <Link to="/contact" className="btn btn-white">
          Request a Quote <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
