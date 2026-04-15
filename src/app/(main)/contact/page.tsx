import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Studiofile. Custom orders, press enquiries, or general questions — we read every message.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/contact`,
  },
};

export default function ContactPage() {
  return (
    <div className="px-site">
      <section className="section-h page-pt page-pb">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[1fr_480px_1fr] gap-8 lg:gap-12 2xl:gap-20 items-start">
          {/* Hero */}
          <div className="space-y-6">
            <h1 className="text-7xl sm:text-9xl font-medium tracking-[-0.06em] sm:tracking-[-0.07em] mb-2 sm:-ml-[8px] leading-[0.9] whitespace-nowrap">
              Let&apos;s talk
            </h1>

            <p className="text-lg text-ink tracking-[-0.03em] leading-tight pb-8">
              We&apos;re a small studio — every enquiry is read and answered
              personally. Whether you&apos;re interested in a custom order, a
              press collaboration, or just want to learn more about our process,
              reach out.
            </p>
            {/* Information */}
            <div className="space-y-4 xl:hidden text-base tracking-[-0.03em] leading-tight pb-8">
              <div className="">
                <p className="text-light mb-1">Email</p>
                <p className="text-ink text-lg">hello@studiofile.com</p>
              </div>
              <div className="">
                <p className="text-light mb-1">Based in</p>
                <p className="text-ink text-lg">Paris, France (GMT +01:00)</p>
              </div>
              <div className="">
                <p className="text-light mb-1">Response time</p>
                <p className="text-ink text-lg">Within 1–2 business days</p>
              </div>
            </div>
          </div>
          {/* Information xl+ */}
          <div className="space-y-4 hidden xl:block xl:order-last text-base tracking-[-0.03em] leading-tight pb-8">
            <div className="">
              <p className="text-light mb-1">Email</p>
              <p className="text-ink text-lg">hello@studiofile.com</p>
            </div>
            <div className="">
              <p className="text-light mb-1">Based in</p>
              <p className="text-ink text-lg">Paris, France (GMT +01:00)</p>
            </div>
            <div className="">
              <p className="text-light mb-1">Response time</p>
              <p className="text-ink text-lg">Within 1–2 business days</p>
            </div>
          </div>
          {/* Form */}
          <div className="">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
