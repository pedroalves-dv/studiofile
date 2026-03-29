import { NextRequest, NextResponse } from "next/server";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body.email !== "string" || !isValidEmail(body.email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  const { email, name } = body as { email: string; name?: string };

  // TODO: wire to Shopify before launch

  if (process.env.NODE_ENV === "development") {
    console.log("[newsletter] new subscriber:", { email, name: name ?? "" });
  }

  return NextResponse.json({ ok: true });
}
