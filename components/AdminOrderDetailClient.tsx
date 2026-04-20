"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FulfillmentStatus, TicketStatus } from "@prisma/client";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { AdminDeliverSongModal } from "@/components/AdminDeliverSongModal";

export type AdminTicketDetail = {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string | null;
  customerName: string;
  accessToken: string;
  occasion: string;
  recipientName: string;
  relationship: string;
  personality: string;
  story: string;
  emotion: string;
  specificLines: string;
  genre: string;
  mood: string;
  vocals: string;
  instruments: string;
  tempo: string;
  production: string;
  duration: string;
  grokPrompt: string;
  sunoPrompt: string;
  status: TicketStatus;
  fulfillmentStatus: FulfillmentStatus;
  deliveredAudioUrl: string | null;
  deliveredAudioKey: string | null;
  deliveredFileName: string | null;
  deliveryDownloadToken: string | null;
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
};

const fulfillmentLabels: Record<FulfillmentStatus, string> = {
  PENDING_PAYMENT: "Pending payment",
  NEW: "New",
  IN_PROGRESS: "In progress",
  DELIVERED: "Delivered",
};

const statusLabels: Record<TicketStatus, string> = {
  AWAITING_PAYMENT: "Awaiting payment",
  PAYMENT_RECEIVED: "Payment received",
  PROMPTS_READY: "Prompts ready",
  SONG_DELIVERED: "Song delivered",
};

function DetailSection({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-950/95 to-black/85 p-6 shadow-[0_0_50px_rgba(0,245,255,0.05)] backdrop-blur-md",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00F5FF]/30 to-transparent" />
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#00F5FF]">{title}</h2>
      {subtitle ? <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{subtitle}</p> : null}
      <div className={subtitle ? "mt-6" : "mt-5"}>{children}</div>
    </section>
  );
}

function Field({ label, value, className }: { label: string; value: string; className?: string }) {
  const v = value?.trim();
  if (!v) return null;
  return (
    <div className={cn("space-y-1.5", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-100">{v}</p>
    </div>
  );
}

function OptionalField({ label, value, className }: { label: string; value: string; className?: string }) {
  const v = value?.trim();
  return (
    <div className={cn("space-y-1.5", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-100">{v || "—"}</p>
    </div>
  );
}

function CopyPromptPanel({ title, body }: { title: string; body: string }) {
  const text = body?.trim() ?? "";
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <DetailSection title={title}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <p className="text-xs text-zinc-500">Full prompt — copy into your workflow</p>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!text}
          className="rounded-lg border border-[#00F5FF]/35 bg-[#00F5FF]/[0.07] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#00F5FF] transition hover:bg-[#00F5FF]/15 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre
        className={cn(
          "mt-4 max-h-[min(380px,52vh)] overflow-auto rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-[13px] leading-relaxed text-zinc-300 shadow-inner",
          !text && "text-zinc-600",
        )}
      >
        {text || "— No prompt generated yet."}
      </pre>
    </DetailSection>
  );
}

export function AdminOrderDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [ticket, setTicket] = useState<AdminTicketDetail | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deliverModalOpen, setDeliverModalOpen] = useState(false);
  const [deliverBanner, setDeliverBanner] = useState<string | null>(null);
  const [resendBanner, setResendBanner] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const fetchOrder = useCallback(async (auth: string) => {
    if (!auth.trim()) {
      setError("Enter your admin secret below to load this order.");
      setTicket(null);
      setFetching(false);
      return;
    }
    setFetching(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        headers: { Authorization: `Bearer ${auth.trim()}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load order");
      setTicket(json.ticket as AdminTicketDetail);
      if (typeof window !== "undefined") sessionStorage.setItem("tuneticket_admin_secret", auth.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setTicket(null);
    } finally {
      setFetching(false);
    }
  }, [id]);

  useEffect(() => {
    const s = typeof window !== "undefined" ? sessionStorage.getItem("tuneticket_admin_secret") ?? "" : "";
    setSecret(s);
    void fetchOrder(s);
  }, [fetchOrder]);

  const deleteOrder = async () => {
    if (!secret.trim() || !ticket) return;
    const ok =
      typeof window !== "undefined" &&
      window.confirm(
        `Delete this order permanently?\n\n${ticket.recipientName?.trim() || ticket.id}\n\nThis cannot be undone.`,
      );
    if (!ok) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${secret.trim()}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Delete failed");
      router.push("/admin/orders");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const resendOrderEmail = async () => {
    if (!ticket || !secret.trim() || ticket.fulfillmentStatus === "DELIVERED") return;
    setError(null);
    setResendBanner(null);
    setResending(true);
    try {
      const res = await fetch(`/api/admin/orders/${ticket.id}/resend-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret.trim()}`,
        },
      });
      const json = (await res.json()) as { ok?: boolean; message?: string; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Failed to re-send email.");
      }
      setResendBanner(json.message ?? "Email re-sent successfully.");
      await fetchOrder(secret);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to re-send email.");
    } finally {
      setResending(false);
    }
  };

  const customerPreviewHref = ticket ? `/ticket/${ticket.id}?token=${encodeURIComponent(ticket.accessToken)}` : "#";

  const paid = ticket ? ticket.status !== "AWAITING_PAYMENT" : false;
  const canMarkDelivered =
    ticket && paid && ticket.fulfillmentStatus !== "DELIVERED" && Boolean(ticket.email?.trim());
  const isDelivered = ticket?.fulfillmentStatus === "DELIVERED";

  const customerDownloadUrl =
    ticket?.deliveryDownloadToken && typeof window !== "undefined"
      ? `${window.location.origin}/api/delivery/download?token=${encodeURIComponent(ticket.deliveryDownloadToken)}`
      : null;

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,245,255,0.12),transparent)]" />

      <div className="relative mx-auto max-w-3xl px-6 pb-36 pt-24">
        <header className="mb-10 space-y-5">
          <Link
            href="/admin/orders"
            className="inline-flex text-xs font-semibold uppercase tracking-wider text-[#00F5FF] hover:underline"
          >
            ← All orders
          </Link>
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#00F5FF]/90">Internal · Order</p>
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {ticket?.recipientName?.trim() || "Order detail"}
            </h1>
            {ticket && (
              <p className="font-mono text-xs text-zinc-500">
                ID <span className="text-zinc-400">{ticket.id}</span>
              </p>
            )}
          </div>
        </header>

        <div className="mb-8 rounded-2xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-sm">
          <label className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Admin secret</span>
            <div className="flex flex-wrap gap-3">
              <input
                type="password"
                autoComplete="off"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="ADMIN_SECRET"
                className="min-w-[200px] flex-1 rounded-xl border border-white/10 bg-[#0c0c0c] px-4 py-3 text-sm text-white outline-none ring-0 transition focus:border-[#00F5FF]/45 focus:shadow-[0_0_24px_rgba(0,245,255,0.08)]"
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => void fetchOrder(secret)}
                disabled={fetching}
                className="rounded-lg border border-[#00F5FF]/40 bg-zinc-950/90 px-5 py-3 text-sm font-semibold uppercase tracking-wider text-[#00F5FF] shadow-[0_0_20px_rgba(0,245,255,0.12)] disabled:opacity-50"
              >
                {fetching ? "Loading…" : "Load"}
              </motion.button>
            </div>
          </label>
        </div>

        {deliverBanner && (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.07] px-4 py-3 text-sm text-emerald-100/95">
            {deliverBanner}
          </div>
        )}
        {resendBanner && (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.07] px-4 py-3 text-sm text-emerald-100/95">
            {resendBanner}
          </div>
        )}

        {error && (
          <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>
        )}

        {fetching && !ticket && <p className="mb-8 text-sm text-zinc-500">Loading order…</p>}

        {ticket && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={customerPreviewHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/12 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-[#00F5FF]/35 hover:text-white"
              >
                Open customer view
              </a>
              {canMarkDelivered && (
                <button
                  type="button"
                  onClick={() => {
                    setDeliverBanner(null);
                    setResendBanner(null);
                    setDeliverModalOpen(true);
                  }}
                  className="rounded-lg border border-[#00F5FF]/45 bg-[#00F5FF]/10 px-4 py-2.5 text-sm font-semibold text-[#00F5FF] shadow-[0_0_24px_rgba(0,245,255,0.12)] transition hover:bg-[#00F5FF]/15"
                >
                  Mark as delivered
                </button>
              )}
              {!isDelivered && (
                <button
                  type="button"
                  onClick={() => void resendOrderEmail()}
                  disabled={resending || !secret.trim()}
                  className="rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-[#00F5FF]/35 hover:text-[#00F5FF] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {resending ? "Re-sending…" : "Re-send Email"}
                </button>
              )}
              {ticket.fulfillmentStatus === "DELIVERED" && (
                <span className="rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300/95">
                  Delivered
                </span>
              )}
            </div>

            {!paid && (
              <p className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3 text-sm text-amber-100/90">
                This ticket is still a draft (awaiting payment). Fulfillment actions unlock after payment.
              </p>
            )}
            {paid && !ticket.email?.trim() && (
              <p className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3 text-sm text-amber-100/90">
                No customer email on file — add one on the public ticket before marking delivered.
              </p>
            )}

            <DetailSection
              title="Customer info"
              subtitle="Who placed the order and where to send communications."
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Name" value={ticket.customerName} />
                <Field label="Email" value={ticket.email ?? ""} />
              </div>
            </DetailSection>

            <DetailSection title="Recipient & occasion" subtitle="Who the song is for and the moment you’re honoring.">
              <div className="grid gap-6">
                <Field label="Recipient name" value={ticket.recipientName} />
                <Field label="Occasion" value={ticket.occasion} />
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Relationship" value={ticket.relationship} />
                  <Field label="Personality" value={ticket.personality} />
                </div>
              </div>
            </DetailSection>

            <DetailSection title="Story & message" subtitle="Narrative, must-include lines, and emotional direction.">
              <div className="space-y-6">
                <OptionalField label="Full story" value={ticket.story} />
                <OptionalField label="Specific lines / quotes" value={ticket.specificLines} />
                <Field label="Emotion" value={ticket.emotion} />
              </div>
            </DetailSection>

            <DetailSection title="Music preferences" subtitle="Genre, arrangement, and length.">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Genre" value={ticket.genre} />
                <Field label="Mood" value={ticket.mood} />
                <Field label="Vocals" value={ticket.vocals} />
                <Field label="Instruments" value={ticket.instruments} />
                <Field label="Tempo" value={ticket.tempo} />
                <Field label="Production" value={ticket.production} />
                <Field label="Duration" value={ticket.duration} className="sm:col-span-2" />
              </div>
            </DetailSection>

            <CopyPromptPanel title="Grok lyrics prompt" body={ticket.grokPrompt} />
            <CopyPromptPanel title="Suno style prompt" body={ticket.sunoPrompt} />

            <DetailSection
              title="Order status & timeline"
              subtitle="Pipeline state and billing references."
            >
              <dl className="grid gap-5 sm:grid-cols-2">
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Fulfillment</dt>
                  <dd className="mt-1.5 text-sm font-medium text-white">{fulfillmentLabels[ticket.fulfillmentStatus]}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Ticket status</dt>
                  <dd className="mt-1.5 text-sm font-medium text-white">{statusLabels[ticket.status]}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Created</dt>
                  <dd className="mt-1.5 text-sm text-zinc-300">
                    {new Date(ticket.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Last updated</dt>
                  <dd className="mt-1.5 text-sm text-zinc-300">
                    {new Date(ticket.updatedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                  </dd>
                </div>
                {ticket.stripeSessionId?.trim() && (
                  <div className="sm:col-span-2">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Stripe checkout</dt>
                    <dd className="mt-1.5 break-all font-mono text-xs text-zinc-400">{ticket.stripeSessionId}</dd>
                  </div>
                )}
                {ticket.stripePaymentIntentId?.trim() && (
                  <div className="sm:col-span-2">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Payment intent</dt>
                    <dd className="mt-1.5 break-all font-mono text-xs text-zinc-400">{ticket.stripePaymentIntentId}</dd>
                  </div>
                )}
              </dl>
            </DetailSection>

            {isDelivered && (
              <DetailSection
                title="Delivery info"
                subtitle="What was sent to the customer and where the master lives."
              >
                <dl className="space-y-5 text-sm">
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Delivered file</dt>
                    <dd className="mt-1.5 font-mono text-xs text-zinc-200">
                      {ticket.deliveredFileName?.trim() || "—"}
                    </dd>
                  </div>
                  {ticket.deliveredAudioUrl?.trim() && (
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        Storage URL (internal)
                      </dt>
                      <dd className="mt-1.5 break-all font-mono text-xs text-zinc-500">{ticket.deliveredAudioUrl}</dd>
                    </div>
                  )}
                  {customerDownloadUrl && (
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        Customer download link
                      </dt>
                      <dd className="mt-2 break-all font-mono text-xs text-[#00F5FF]/90">{customerDownloadUrl}</dd>
                      <p className="mt-2 text-xs text-zinc-600">
                        Same link included in the delivery email; token is unguessable.
                      </p>
                    </div>
                  )}
                </dl>
              </DetailSection>
            )}

            <DetailSection title="Danger zone" subtitle="Permanent actions — use for test orders or mistakes.">
              <p className="mb-4 text-sm text-zinc-500">
                Deleting removes the ticket and its data from the database. This cannot be undone.
              </p>
              <button
                type="button"
                onClick={() => void deleteOrder()}
                disabled={deleting || !secret.trim()}
                className="rounded-lg border border-red-500/45 bg-red-950/35 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-950/55 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deleting ? "Deleting…" : "Delete order"}
              </button>
            </DetailSection>
          </motion.div>
        )}
      </div>

      {ticket && (
        <AdminDeliverSongModal
          open={deliverModalOpen}
          onClose={() => setDeliverModalOpen(false)}
          recipientName={ticket.recipientName}
          customerEmail={ticket.email}
          orderId={ticket.id}
          secret={secret}
          onSuccess={(result) => {
            setDeliverModalOpen(false);
            void fetchOrder(secret);
            setDeliverBanner(
              result.emailSent
                ? "Order marked delivered. The song was emailed to the customer with the audio file attached."
                : `Order marked delivered, but email could not be sent${result.emailError ? `: ${result.emailError}` : "."}`,
            );
          }}
        />
      )}
    </div>
  );
}
