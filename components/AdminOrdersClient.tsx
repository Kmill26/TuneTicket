"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { FulfillmentStatus, TicketStatus } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { SongDeliveryDropzone } from "@/lib/uploadthing-components";
import type { ClientUploadedFileData } from "uploadthing/types";

type OrderRow = {
  id: string;
  createdAt: string;
  customerName: string;
  email: string | null;
  recipientName: string;
  occasion: string;
  fulfillmentStatus: FulfillmentStatus;
  status: TicketStatus;
  accessToken: string;
};

type UploadMeta = ClientUploadedFileData<{
  ufsUrl: string;
  url: string;
  key: string;
  name: string;
}>;

const fulfillmentLabels: Record<FulfillmentStatus, string> = {
  PENDING_PAYMENT: "Pending",
  NEW: "New",
  IN_PROGRESS: "In progress",
  DELIVERED: "Delivered",
};

/** Statuses admins can set from the dropdown (delivery uses upload modal). */
const selectableFulfillment: FulfillmentStatus[] = ["PENDING_PAYMENT", "NEW", "IN_PROGRESS"];

function ticketHref(id: string, token: string) {
  return `/ticket/${id}?token=${encodeURIComponent(token)}`;
}

export function AdminOrdersClient() {
  const [secret, setSecret] = useState("");
  const [stored, setStored] = useState(false);
  const [rows, setRows] = useState<OrderRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deliverFor, setDeliverFor] = useState<OrderRow | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadMeta | null>(null);
  const [deliverSubmitting, setDeliverSubmitting] = useState(false);
  const [deliverError, setDeliverError] = useState<string | null>(null);
  const [deliverSuccess, setDeliverSuccess] = useState<string | null>(null);

  const [testEmailLoadingId, setTestEmailLoadingId] = useState<string | null>(null);
  const [testEmailBanner, setTestEmailBanner] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    const s = typeof window !== "undefined" ? sessionStorage.getItem("tuneticket_admin_secret") : null;
    if (s) {
      setSecret(s);
      setStored(true);
    }
  }, []);

  const load = useCallback(async () => {
    if (!secret.trim()) {
      setError("Enter admin secret.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${secret.trim()}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load");
      setRows(json.orders as OrderRow[]);
      if (typeof window !== "undefined") sessionStorage.setItem("tuneticket_admin_secret", secret.trim());
      setStored(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [secret]);

  const updateStatus = async (id: string, fulfillmentStatus: FulfillmentStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${secret.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fulfillmentStatus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Update failed");
      void load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  };

  const openDeliverModal = (row: OrderRow) => {
    setDeliverFor(row);
    setUploadedFile(null);
    setDeliverError(null);
    setDeliverSuccess(null);
  };

  const closeDeliverModal = () => {
    if (deliverSubmitting) return;
    setDeliverFor(null);
    setUploadedFile(null);
    setDeliverError(null);
  };

  const sendTestEmail = async (orderId: string) => {
    if (!secret.trim()) {
      setTestEmailBanner({ kind: "err", text: "Enter admin secret first." });
      return;
    }
    setTestEmailLoadingId(orderId);
    setTestEmailBanner(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/send-test-email`, {
        method: "POST",
        headers: { Authorization: `Bearer ${secret.trim()}` },
      });
      const json = (await res.json()) as { ok?: boolean; message?: string; error?: string };
      if (!res.ok || !json.ok) {
        setTestEmailBanner({
          kind: "err",
          text: json.error ?? "Failed to send email.",
        });
        return;
      }
      setTestEmailBanner({
        kind: "ok",
        text: json.message ?? "Test email sent successfully.",
      });
    } catch (e) {
      setTestEmailBanner({
        kind: "err",
        text: e instanceof Error ? e.message : "Failed to send email.",
      });
    } finally {
      setTestEmailLoadingId(null);
    }
  };

  const finalizeDelivery = async () => {
    if (!deliverFor || !uploadedFile || !secret.trim()) return;
    setDeliverSubmitting(true);
    setDeliverError(null);
    try {
      const res = await fetch(`/api/admin/orders/${deliverFor.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${secret.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fulfillmentStatus: "DELIVERED",
          audioUrl: uploadedFile.url,
          audioKey: uploadedFile.key,
          fileName: uploadedFile.name,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Delivery failed");

      const emailOk = json.emailSent === true;
      const emailErr = typeof json.emailError === "string" ? json.emailError : "";
      setDeliverSuccess(
        emailOk
          ? "Order marked delivered. The song was emailed to the customer with the audio file attached."
          : `Order marked delivered, but email could not be sent${emailErr ? `: ${emailErr}` : "."}`,
      );
      setDeliverFor(null);
      setUploadedFile(null);
      void load();
    } catch (e) {
      setDeliverError(e instanceof Error ? e.message : "Delivery failed");
    } finally {
      setDeliverSubmitting(false);
    }
  };

  const paid = (r: OrderRow) => r.status !== "AWAITING_PAYMENT";

  return (
    <div className="mx-auto max-w-6xl px-6 pb-32 pt-28">
      <header className="mb-10 space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#00F5FF]">Internal</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Orders</h1>
        <p className="max-w-xl text-sm text-[#A1A1AA]">
          Fulfillment: New → In progress → Delivered (upload a .wav or .mp3). The song is attached to the customer
          email; a secure download link is included as a backup.
        </p>
      </header>

      <div className="mb-8 flex flex-wrap items-end gap-4">
        <label className="flex min-w-[240px] flex-1 flex-col gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Admin secret</span>
          <input
            type="password"
            autoComplete="off"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="ADMIN_SECRET from env"
            className="rounded-xl border border-white/10 bg-[#111111]/90 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5FF]/40"
          />
        </label>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={load}
          disabled={loading}
          className="rounded-md border border-[#00F5FF]/40 bg-zinc-950/80 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#00F5FF] shadow-[0_0_20px_rgba(0,245,255,0.15)] disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load orders"}
        </motion.button>
        {stored && <span className="text-xs text-zinc-600">Secret remembered for this session.</span>}
      </div>

      {deliverSuccess && (
        <div className="mb-6 rounded-xl border border-[#00F5FF]/30 bg-[#00F5FF]/[0.06] px-4 py-3 text-sm text-[#A1A1AA]">
          {deliverSuccess}
        </div>
      )}

      {testEmailBanner && (
        <div
          className={cn(
            "mb-6 rounded-xl border px-4 py-3 text-sm",
            testEmailBanner.kind === "ok"
              ? "border-emerald-500/35 bg-emerald-500/[0.08] text-emerald-100/90"
              : "border-red-500/35 bg-red-500/[0.08] text-red-200",
          )}
        >
          {testEmailBanner.text}
        </div>
      )}

      {error && <p className="mb-6 text-sm text-red-400">{error}</p>}

      {rows && rows.length === 0 && <p className="text-sm text-[#A1A1AA]">No orders yet.</p>}

      {rows && rows.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 shadow-[0_0_40px_rgba(0,245,255,0.06)] backdrop-blur-xl">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="border-b border-white/10 bg-black/40 text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
              <tr>
                <th className="px-4 py-4">Recipient</th>
                <th className="px-4 py-4">Occasion</th>
                <th className="px-4 py-4">Customer</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Ticket</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Deliver</th>
                <th className="px-4 py-4">Test email</th>
                <th className="px-4 py-4">View</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const isPaid = paid(r);
                return (
                  <tr key={r.id} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-4 font-medium text-white">{r.recipientName || "—"}</td>
                    <td className="px-4 py-4 text-[#A1A1AA]">{r.occasion || "—"}</td>
                    <td className="px-4 py-4 text-[#A1A1AA]">{r.customerName || "—"}</td>
                    <td className="max-w-[180px] truncate px-4 py-4 font-mono text-xs text-zinc-400">{r.email || "—"}</td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider",
                          isPaid ? "border-[#00F5FF]/35 text-[#00F5FF]" : "border-white/15 text-zinc-500",
                        )}
                      >
                        {isPaid ? "Ready" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={r.fulfillmentStatus}
                        onChange={(e) => updateStatus(r.id, e.target.value as FulfillmentStatus)}
                        disabled={!isPaid || r.fulfillmentStatus === "DELIVERED"}
                        className="max-w-[160px] rounded-lg border border-white/15 bg-[#0a0a0a] px-2 py-1.5 text-xs text-white outline-none focus:border-[#00F5FF]/40 disabled:opacity-40"
                      >
                        {selectableFulfillment.map((k) => (
                          <option key={k} value={k}>
                            {fulfillmentLabels[k]}
                          </option>
                        ))}
                        {r.fulfillmentStatus === "DELIVERED" && (
                          <option value="DELIVERED">{fulfillmentLabels.DELIVERED}</option>
                        )}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      {r.fulfillmentStatus === "DELIVERED" ? (
                        <span className="text-xs text-zinc-500">Done</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openDeliverModal(r)}
                          disabled={!isPaid || !r.email?.trim()}
                          title={!r.email?.trim() ? "Add customer email on the ticket first" : "Upload song and deliver"}
                          className="text-xs font-semibold uppercase tracking-wider text-[#00F5FF] hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline"
                        >
                          Mark as delivered
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => void sendTestEmail(r.id)}
                        disabled={testEmailLoadingId === r.id || !secret.trim()}
                        title="Sends the full ops notification to the configured inbox (e.g. kedm@mac.com)"
                        className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-[#00F5FF] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {testEmailLoadingId === r.id ? "Sending…" : "Send test email"}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={ticketHref(r.id, r.accessToken)}
                        className="text-xs font-semibold uppercase tracking-wider text-[#00F5FF] hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {deliverFor && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDeliverModal}
          >
            <motion.div
              role="dialog"
              aria-modal
              aria-labelledby="deliver-title"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#0c0c0c] p-6 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
            >
              <h2 id="deliver-title" className="text-lg font-semibold text-white">
                Mark as delivered
              </h2>
              <p className="mt-1 text-sm text-[#A1A1AA]">
                For <span className="text-white">{deliverFor.recipientName}</span> — upload the final .wav or .mp3 below.
                The file is <span className="text-zinc-300">required</span>: we attach it to the customer&apos;s email
                (max ~25 MB for email delivery; use MP3 if needed).
              </p>

              {!deliverFor.email?.trim() && (
                <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                  This ticket has no customer email. Add an email on the ticket before delivering.
                </p>
              )}

              <div className="mt-6">
                <SongDeliveryDropzone
                  endpoint="songDeliveryAudio"
                  headers={() => ({ Authorization: `Bearer ${secret.trim()}` })}
                  onClientUploadComplete={(res) => {
                    const first = res[0];
                    if (first) setUploadedFile(first as UploadMeta);
                  }}
                  onUploadError={(e) => setDeliverError(e.message)}
                  content={{
                    allowedContent: "Audio: WAV or MP3 — attach up to ~25 MB; larger files cannot be emailed",
                  }}
                  appearance={{
                    container:
                      "border border-dashed border-white/20 rounded-xl bg-black/40 ut-uploading:border-[#00F5FF]/40",
                    label: "text-sm text-zinc-300",
                    allowedContent: "text-xs text-zinc-500",
                    button: "ut-ready:bg-zinc-900 ut-ready:text-[#00F5FF] ut-uploading:cursor-not-allowed",
                  }}
                />
              </div>

              {uploadedFile && (
                <p className="mt-4 text-sm text-[#A1A1AA]">
                  Ready: <span className="font-mono text-xs text-white">{uploadedFile.name}</span>
                </p>
              )}

              {deliverError && <p className="mt-4 text-sm text-red-400">{deliverError}</p>}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={closeDeliverModal}
                  disabled={deliverSubmitting}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-[#A1A1AA] hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={finalizeDelivery}
                  disabled={
                    deliverSubmitting ||
                    !uploadedFile ||
                    !deliverFor.email?.trim()
                  }
                  className="rounded-lg border border-[#00F5FF]/50 bg-[#00F5FF]/10 px-5 py-2 text-sm font-semibold text-[#00F5FF] hover:bg-[#00F5FF]/15 disabled:opacity-40"
                >
                  {deliverSubmitting ? "Sending…" : "Email song & mark delivered"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
