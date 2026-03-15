import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body.email !== "string" || !body.email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  const { email, name } = body as { email: string; name?: string };

  // TODO: wire to Shopify before launch

  console.log("[newsletter] new subscriber:", { email, name: name ?? "" });

  return NextResponse.json({ ok: true });
}
