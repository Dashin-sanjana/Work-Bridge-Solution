import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { cloneElement, useId, useState } from "react";
import type { ReactElement, InputHTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const quoteSchema = z.object({
  contactName: z.string().min(2, "Enter the contact person's name."),
  organization: z.string().min(2, "Enter the company or organization name."),
  email: z.string().email("Enter a valid business email address."),
  phone: z.string().min(6, "Enter a reachable phone number."),
  facilityType: z.string().min(1, "Choose a facility type."),
  location: z.string().min(2, "Enter the property location."),
  staffCount: z.coerce.number().min(1, "Enter at least one required staff member."),
  staffingType: z.string().min(1, "Choose a staffing requirement."),
  startDate: z.string().min(1, "Choose a preferred starting date."),
  requirements: z.string().min(10, "Add a short note about the requirement."),
  website: z.string().max(0, "Spam check failed.").optional()
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

const facilityTypes = ["Hotel / Resort", "Apartment Complex", "Corporate Office", "Commercial Property", "Other"];
const staffingTypes = ["Long-Term Contract", "Short-Term Contract", "Temporary Staff", "One-Time Requirement", "Other"];

export default function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<QuoteFormValues>({ resolver: zodResolver(quoteSchema), reValidateMode: "onChange" });

  async function onSubmit(values: QuoteFormValues) {
    setStatus("idle");
    setMessage("");
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Your inquiry was sent to Work Bridge Solution.");
        reset();
        return;
      }

      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      setStatus("error");
      setMessage(data?.message ?? "The quotation form is not connected to an email provider yet.");
    } catch {
      setStatus("error");
      setMessage("Your inquiry could not be sent. Please try again or email info@workbridgesolution.com.");
    }
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting} noValidate>
      <input className="hidden" tabIndex={-1} autoComplete="off" {...register("website")} aria-hidden="true" />
      <Field label="Contact Person Name" error={errors.contactName?.message}>
        <input {...register("contactName")} autoComplete="name" />
      </Field>
      <Field label="Company / Organization Name" error={errors.organization?.message}>
        <input {...register("organization")} autoComplete="organization" />
      </Field>
      <Field label="Business Email" error={errors.email?.message}>
        <input type="email" {...register("email")} autoComplete="email" />
      </Field>
      <Field label="Phone Number" error={errors.phone?.message}>
        <input type="tel" {...register("phone")} autoComplete="tel" />
      </Field>
      <Field label="Property / Facility Type" error={errors.facilityType?.message}>
        <select {...register("facilityType")}>
          <option value="">Select one</option>
          {facilityTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </Field>
      <Field label="Property Location" error={errors.location?.message}>
        <input {...register("location")} />
      </Field>
      <Field label="Required Cleaning Staff Count" error={errors.staffCount?.message}>
        <input type="number" min="1" {...register("staffCount")} />
      </Field>
      <Field label="Type of Staffing Requirement" error={errors.staffingType?.message}>
        <select {...register("staffingType")}>
          <option value="">Select one</option>
          {staffingTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </Field>
      <Field label="Preferred Starting Date" error={errors.startDate?.message}>
        <input type="date" {...register("startDate")} />
      </Field>
      <Field label="Additional Requirements" error={errors.requirements?.message} wide>
        <textarea rows={5} {...register("requirements")} />
      </Field>
      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
          {isSubmitting ? "Sending inquiry..." : "Submit Inquiry"}
        </button>
        {message ? <p className={status === "error" ? "form-error" : "form-success"} role="status">{message}</p> : null}
      </div>
    </form>
  );
}

function Field({ label, error, children, wide = false }: { label: string; error?: string; children: ReactElement<InputHTMLAttributes<HTMLInputElement>>; wide?: boolean }) {
  const id = useId();
  return (
    <label className={wide ? "field field-wide" : "field"}>
      <span>{label}</span>
      {cloneElement(children, { "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined })}
      {error ? <small id={`${id}-error`} role="alert">{error}</small> : null}
    </label>
  );
}
