"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FulfillmentStatus, TicketStatus } from "@prisma/client";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

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

function Field({ label, value, className }: { label: string; value: string; className?: string }) {
  const v = value?.trim();
  if (!v) return null;
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">{v}</p>
    </div>
  );
}

/** Always shows the label; uses an em dash when empty (helpful for long-form fields). */
function OptionalField({ label, value, className }: { label: string; value: string; className?: string }) {
  const v = value?.trim();
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">{v || "—"}</p>
    </div>
  );
}

function PromptBlock({ title, text }: { title: string; text: string }) {
  const t = text?.trim();
  if (!t) return null;
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#00F5FF]/80">{title}</p>
      <pre className="max-h-[320px] overflow-auto rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-xs leading-relaxed text-zinc-300">
        {t}
      </pre>
    </div>
  );
}

export function AdminOrderDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [ticket, setTicket] = useState<AdminTicketDetail | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const customerPreviewHref = ticket ? `/ticket/${ticket.id}?token=${encodeURIComponent(ticket.accessToken)}` : "#";

  return (
    <div className="mx-auto max-w-4xl px-6 pb-32 pt-28">
      <header className="mb-10 space-y-4">
        <Link
          href="/admin/orders"
          className="inline-flex text-xs font-semibold uppercase tracking-wider text-[#00F5FF] hover:underline"
        >
          ← All orders
        </Link>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#00F5FF]">Order detail</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {ticket?.recipientName?.trim() || "Ticket"}
          </h1>
          {ticket && (
            <p className="mt-2 font-mono text-xs text-zinc-500">
              ID <span className="text-zinc-400">{ticket.id}</span>
            </p>
          )}
        </div>
      </header>

      <div className="mb-8 rounded-2xl border border-white/10 bg-zinc-950/50 p-5">
        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Admin secret</span>
          <div className="flex flex-wrap gap-3">
            <input
              type="password"
              autoComplete="off"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="ADMIN_SECRET"
              className="min-w-[200px] flex-1 rounded-xl border border-white/10 bg-[#111111]/90 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5FF]/40"
            />
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => void fetchOrder(secret)}
              disabled={fetching}
              className="rounded-md border border-[#00F5FF]/40 bg-zinc-950/80 px-5 py-3 text-sm font-semibold uppercase tracking-wider text-[#00F5FF] disabled:opacity-50"
            >
              {fetching ? "Loading…" : "Load"}
            </motion.button>
          </div>
        </label>
      </div>

      {error && (
        <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>
      )}

      {fetching && !ticket && (
        <p className="mb-8 text-sm text-zinc-500">Loading order…</p>
      )}

      {ticket && (
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex flex-wrap gap-3">
            <a
              href={customerPreviewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-[#00F5FF]/40 hover:text-white"
            >
              Open customer view
            </a>
          </div>

          <section className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6 shadow-[0_0_40px_rgba(0,245,255,0.04)]">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Status &amp; timeline</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Fulfillment</dt>
                <dd className="mt-1 text-sm text-white">{fulfillmentLabels[ticket.fulfillmentStatus]}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Ticket status</dt>
                <dd className="mt-1 text-sm text-white">{statusLabels[ticket.status]}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Created</dt>
                <dd className="mt-1 text-sm text-zinc-300">
                  {new Date(ticket.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Updated</dt>
                <dd className="mt-1 text-sm text-zinc-300">
                  {new Date(ticket.updatedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Customer</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" value={ticket.customerName} />
              <Field label="Email" value={ticket.email ?? ""} />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Recipient &amp; occasion</h2>
            <div className="grid gap-5">
              <Field label="Recipient name" value={ticket.recipientName} />
              <Field label="Occasion" value={ticket.occasion} />
              <Field label="Relationship" value={ticket.relationship} />
              <Field label="Personality" value={ticket.personality} />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Story &amp; details</h2>
            <div className="space-y-5">
              <OptionalField label="Story" value={ticket.story} />
              <OptionalField label="Specific lines / quotes" value={ticket.specificLines} />
              <Field label="Emotion" value={ticket.emotion} />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Music direction</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Genre" value={ticket.genre} />
              <Field label="Mood" value={ticket.mood} />
              <Field label="Vocals" value={ticket.vocals} />
              <Field label="Instruments" value={ticket.instruments} />
              <Field label="Tempo" value={ticket.tempo} />
              <Field label="Production" value={ticket.production} />
              <Field label="Duration" value={ticket.duration} className="sm:col-span-2" />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Generated prompts</h2>
            <div className="space-y-6">
              <PromptBlock title="Grok prompt" text={ticket.grokPrompt} />
              <PromptBlock title="Suno prompt" text={ticket.sunoPrompt} />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Delivery &amp; billing</h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Delivered file</dt>
                <dd className="mt-1 text-zinc-200">
                  {ticket.deliveredFileName?.trim() ? (
                    <span className="font-mono text-xs">{ticket.deliveredFileName}</span>
                  ) : (
                    <span className="text-zinc-500">Not delivered yet</span>
                  )}
                </dd>
              </div>
              {ticket.deliveredAudioUrl?.trim() && (
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Storage URL (internal)</dt>
                  <dd className="mt-1 break-all font-mono text-xs text-zinc-400">{ticket.deliveredAudioUrl}</dd>
                </div>
              )}
              {ticket.stripeSessionId?.trim() && (
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Stripe session</dt>
                  <dd className="mt-1 font-mono text-xs text-zinc-400">{ticket.stripeSessionId}</dd>
                </div>
              )}
              {ticket.stripePaymentIntentId?.trim() && (
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Payment intent</dt>
                  <dd className="mt-1 font-mono text-xs text-zinc-400">{ticket.stripePaymentIntentId}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-2xl border border-red-500/20 bg-red-950/20 p-6">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-300/90">Danger zone</h2>
            <p className="mb-4 text-sm text-zinc-400">
              Remove this order from the database. Use for test data or mistaken entries.
            </p>
            <button
              type="button"
              onClick={() => void deleteOrder()}
              disabled={deleting || !secret.trim()}
              className="rounded-lg border border-red-500/50 bg-red-950/40 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-950/60 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {deleting ? "Deleting…" : "Delete this order"}
            </button>
          </section>
        </motion.div>
      )}
    </div>
  );
}
