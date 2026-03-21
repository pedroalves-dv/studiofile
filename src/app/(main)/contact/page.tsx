import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

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
    <main id="main-content" className="px-6 section-height tracking-tight">
      <section className="pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20 items-start">
          {/* Hero */}
          <div className="space-y-6">
            <h1 className="text-[5.2rem] sm:text-9xl tracking-tighter pb-8 sm:-ml-[10px] leading-[5rem]">
              Let&apos;s talk
            </h1>

            <p className="text-sm font-mono text-ink tracking-tight">
              We&apos;re a small studio — every enquiry is read and answered
              personally. Whether you&apos;re interested in a custom order, a
              press collaboration, or just want to learn more about our process,
              reach out.
            </p>
          </div>
          {/* Information */}
          <div className="space-y-4 md:order-last tracking-tight ">
            <div className="">
              <p className="text-sm font-mono text-light mb-1">Email</p>
              <p className="font-mono text-sm text-ink">hello@studiofile.com</p>
            </div>
            <div className="">
              <p className="text-sm font-mono text-light mb-1">Based in</p>
              <p className="font-mono text-sm text-ink">Paris, France</p>
            </div>
            <div className="">
              <p className="text-sm font-mono text-light mb-1">Response time</p>
              <p className="font-mono text-sm text-ink">
                Within 1–2 business days
              </p>
            </div>
          </div>
          {/* Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
