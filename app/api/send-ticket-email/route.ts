import { NextResponse } from "next/server";
import { sendPostPaymentEmails } from "@/lib/order-emails";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Re-send post-payment emails (admin + customer). Requires ADMIN_SECRET in production.
 */
export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const body = (await req.json()) as { ticketId?: string };
    if (!body.ticketId?.trim()) {
      return NextResponse.json({ error: "ticketId is required." }, { status: 400 });
    }

    const result = await sendPostPaymentEmails(body.ticketId.trim());
    return NextResponse.json({
      ok: true,
      adminSent: result.adminSent,
      customerSent: result.customerSent,
      reasons: result.reasons,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not send emails." }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
