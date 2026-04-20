import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { sendAdminOrderTestEmail } from "@/lib/order-emails";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;

  const result = await sendAdminOrderTestEmail(id);

  if (!result.sent) {
    return NextResponse.json(
      {
        ok: false,
        error: result.error ?? "Failed to send test email.",
      },
      { status: result.error === "Ticket not found." ? 404 : 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: `Test email sent successfully to ${result.to ?? "ops inbox"}.`,
    to: result.to,
  });
}

export const dynamic = "force-dynamic";
