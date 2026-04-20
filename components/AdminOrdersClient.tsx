"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { FulfillmentStatus, TicketStatus } from "@prisma/client";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { AdminDeliverSongModal } from "@/components/AdminDeliverSongModal";

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

const fulfillmentLabels: Record<FulfillmentStatus, string> = {
  PENDING_PAYMENT: "Pending",
  NEW: "New",
  IN_PROGRESS: "In progress",
  DELIVERED: "Delivered",
};

/** Statuses admins can set from the dropdown (delivery uses upload modal). */
const selectableFulfillment: FulfillmentStatus[] = ["PENDING_PAYMENT", "NEW", "IN_PROGRESS"];

export function AdminOrdersClient() {
  const [secret, setSecret] = useState("");
  const [stored, setStored] = useState(false);
  const [rows, setRows] = useState<OrderRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deliverFor, setDeliverFor] = useState<OrderRow | null>(null);
  const [deliverSuccess, setDeliverSuccess] = useState<string | null>(null);

  const [testEmailLoadingId, setTestEmailLoadingId] = useState<string | null>(null);
  const [testEmailBanner, setTestEmailBanner] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

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
    setDeliverSuccess(null);
  };

  const deleteOrder = async (orderId: string, label: string) => {
    if (!secret.trim()) {
      setError("Enter admin secret.");
      return;
    }
    const ok = typeof window !== "undefined" && window.confirm(`Delete this order permanently?\n\n${label}\n\nThis cannot be undone.`);
    if (!ok) return;
    setDeleteLoadingId(orderId);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${secret.trim()}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Delete failed");
      void load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleteLoadingId(null);
    }
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
                <th className="px-4 py-4">Delete</th>
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
                        href={`/admin/orders/${r.id}`}
                        className="text-xs font-semibold uppercase tracking-wider text-[#00F5FF] hover:underline"
                      >
                        View
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => void deleteOrder(r.id, r.recipientName || r.id.slice(0, 8))}
                        disabled={deleteLoadingId === r.id || !secret.trim()}
                        className="text-xs font-semibold uppercase tracking-wider text-red-400/90 hover:text-red-300 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {deleteLoadingId === r.id ? "…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {deliverFor && (
        <AdminDeliverSongModal
          open
          onClose={() => setDeliverFor(null)}
          recipientName={deliverFor.recipientName}
          customerEmail={deliverFor.email}
          orderId={deliverFor.id}
          secret={secret}
          onSuccess={(result) => {
            setDeliverSuccess(
              result.emailSent
                ? "Order marked delivered. The song was emailed to the customer with the audio file attached."
                : `Order marked delivered, but email could not be sent${result.emailError ? `: ${result.emailError}` : "."}`,
            );
            setDeliverFor(null);
            void load();
          }}
        />
      )}
    </div>
  );
}
