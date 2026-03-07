import { NextRequest, NextResponse } from 'next/server';

const SUBJECTS = ['General', 'Custom Order Enquiry', 'Press', 'Other'] as const;

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;  // honeypot field — must be empty for real users
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<ContactPayload>;

    // Honeypot check — bots fill this field, real users don't see it
    if (body.website) return NextResponse.json({ success: true });

    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }
    if (!body.email?.trim() || !isValidEmail(body.email)) {
      return NextResponse.json(
        { success: false, error: 'A valid email is required' },
        { status: 400 }
      );
    }
    if (body.subject && !SUBJECTS.includes(body.subject as (typeof SUBJECTS)[number])) {
      return NextResponse.json({ success: false, error: 'Invalid subject' }, { status: 400 });
    }
    if (!body.message?.trim()) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Contact form]', {
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
      });
    }

    // TODO: wire to email service (Resend, Postmark, Shopify Email, etc.)

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
