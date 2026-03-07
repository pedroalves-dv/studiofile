'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/common/Toast';

type Subject = 'General' | 'Custom Order Enquiry' | 'Press' | 'Other';

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

const SUBJECTS: Subject[] = ['General', 'Custom Order Enquiry', 'Press', 'Other'];

const EMPTY_FORM: FormState = {
  name: '',
  email: '',
  subject: 'General',
  message: '',
  honeypot: '',
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address';
  }
  if (!form.message.trim()) errors.message = 'Message is required';
  return errors;
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check — if filled, silently discard
    if (form.honeypot) return;

    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast.success('Message sent — we\'ll be in touch soon.');
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Honeypot — hidden from real users, visible to bots */}
      <div aria-hidden="true" className="hidden" tabIndex={-1}>
        <input
          type="text"
          name="website"
          value={form.honeypot}
          onChange={set('honeypot')}
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Name"
          id="contact-name"
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={set('name')}
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
          onChange={set('email')}
          error={errors.email}
          autoComplete="email"
          required
        />
      </div>

      {/* Subject */}
      <div className="w-full">
        <label
          htmlFor="contact-subject"
          className="block text-sm font-mono uppercase tracking-wider mb-2 text-ink"
        >
          Subject
        </label>
        <div className="border-b border-border focus-within:border-accent transition-colors">
          <select
            id="contact-subject"
            value={form.subject}
            onChange={set('subject')}
            className="w-full px-0 py-2 bg-transparent text-ink focus:outline-none appearance-none cursor-pointer"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div className="w-full">
        <label
          htmlFor="contact-message"
          className="block text-sm font-mono uppercase tracking-wider mb-2 text-ink"
        >
          Message
        </label>
        <div className="border-b border-border focus-within:border-accent transition-colors">
          <textarea
            id="contact-message"
            value={form.message}
            onChange={set('message')}
            rows={6}
            placeholder="Tell us about your project or enquiry…"
            className="w-full px-0 py-2 bg-transparent text-ink placeholder-muted focus:outline-none resize-none"
            required
          />
        </div>
        {errors.message && (
          <p className="text-error text-xs font-mono mt-1 uppercase tracking-wider">
            {errors.message}
          </p>
        )}
      </div>

      <Button type="submit" variant="primary" size="lg" isLoading={submitting} disabled={submitting}>
        Send message
      </Button>
    </form>
  );
}
