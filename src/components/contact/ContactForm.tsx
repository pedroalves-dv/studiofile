"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { useToast } from "@/components/common/Toast";
import { CustomSelect } from "@/components/ui/CustomSelect";

import type { ChangeEvent } from "react";

type Subject = "General" | "Custom Order Enquiry" | "Press" | "Other";

interface FormState {
  name: string;
  email: string;
  subject: Subject;
  message: string;
  honeypot: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const SUBJECTS: Subject[] = [
  "General",
  "Custom Order Enquiry",
  "Press",
  "Other",
];

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  subject: "General",
  message: "",
  honeypot: "",
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!form.message.trim()) errors.message = "Message is required";
  return errors;
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const set =
    (field: keyof FormState) =>
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success("Message sent — we'll be in touch soon.");
    setSubmitted(true);
    return;
  };

  // if (submitted) {
  //   return (
  //     <div className="space-y-6">
  //       <h2 className="text-[5.2rem] font-medium  sm:text-9xl tracking-[-0.05em] pb-8 sm:leading-[0.9] leading-[0.9]">
  //         Thank you.
  //       </h2>
  //       <p className="text-ink text-lg tracking-[-0.04em] leading-tight">
  //         We've received your message and will get back to you shortly.
  //       </p>
  //       <ArrowButton
  //         type="button"
  //         label="Send another message"
  //         onClick={() => setSubmitted(false)}
  //         disabled={submitting}
  //         className="w-full py-2.5 bg-white text-ink font-mono tracking-wide
  //        text-xs rounded-lg border border-stroke"
  //       />
  //     </div>
  //   );
  // }
  // const handleSubmit = async (e: SubmitEvent) => {
  //   e.preventDefault();

  //   // Honeypot check — if filled, silently discard
  //   if (form.honeypot) return;

  //   const errs = validate(form);
  //   setErrors(errs);
  //   if (Object.keys(errs).length > 0) return;

  //   setSubmitting(true);
  //   try {
  //     const res = await fetch("/api/contact", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         name: form.name,
  //         email: form.email,
  //         subject: form.subject,
  //         message: form.message,
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok || !data.success) {
  //       throw new Error(data.error || "Something went wrong");
  //     }

  //     toast.success("Message sent — we'll be in touch soon.");
  //     setForm(EMPTY_FORM);
  //     setErrors({});
  //   } catch (err) {
  //     toast.error(
  //       err instanceof Error
  //         ? err.message
  //         : "Failed to send. Please try again.",
  //     );
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-8"
    >
      {/* Honeypot — hidden from real users, visible to bots */}
      <div aria-hidden="true" className="hidden" hidden tabIndex={-1}>
        <input
          type="text"
          name="website"
          value={form.honeypot}
          onChange={set("honeypot")}
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      {/* Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Name"
          id="contact-name"
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={set("name")}
          error={errors.name}
          autoComplete="name"
          required
        />
        <Input
          label="Email"
          id="contact-email"
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
          autoComplete="email"
          required
        />
      </div>

      {/* Subject */}
      <CustomSelect
        id="contact-subject"
        label="Subject"
        value={form.subject}
        onChange={(val) =>
          setForm((prev) => ({ ...prev, subject: val as Subject }))
        }
        options={SUBJECTS}
      />

      {/* Message */}
      <div className="w-full">
        <label
          htmlFor="contact-message"
          className="px-1 block text-base mb-1 text-light"
        >
          Message
        </label>
        <div className="bg-white border border-stroke rounded-md focus-within:border-ink transition-colors">
          <textarea
            id="contact-message"
            value={form.message}
            onChange={set("message")}
            rows={6}
            placeholder="Tell us about your project or enquiry…"
            className="w-full px-4 py-2 bg-transparent text-ink tracking-tight placeholder-light focus:outline-none text-base"
            required
          />
        </div>
        {errors.message && (
          <p className="text-error text-xs mt-1">{errors.message}</p>
        )}
      </div>

      <ArrowButton
        type="submit"
        label={submitting ? "Sending…" : "Send message"}
        disabled={submitting}
        className="w-full mt-4 px-6 py-2 bg-white text-ink text-base font-medium tracking-[-0.03em] rounded-md  border border-ink  disabled:opacity-50"
      />
    </form>
  );
}
