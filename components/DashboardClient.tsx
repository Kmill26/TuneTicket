"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { TicketStatus } from "@prisma/client";
import { statusLabel } from "@/lib/ticket-status";
import { cn } from "@/lib/cn";

type Row = {
  id: string;
  createdAt: string;
  recipientName: string;
  occasion: string;
  status: TicketStatus;
  genre: string;
  mood: string;
  accessToken: string;
};

export function DashboardClient() {
  const [email, setEmail] = useState("");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tickets/by-email?email=${encodeURIComponent(email.trim())}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed");
      setRows(json.tickets as Row[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 pb-32 pt-28">
      <header className="mb-12 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5FF]">Mission control</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Your tickets</h1>
        <p className="max-w-xl text-sm text-[#A1A1AA]">
          Enter the email on your ticket — we will list every TuneTicket tied to it.
        </p>
      </header>

      <div className="mb-10 flex flex-wrap gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com"
          className="min-w-[240px] flex-1 rounded-xl border border-white/10 bg-[#111111]/90 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5FF]/40"
        />
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={load}
          disabled={loading}
          className="rounded-md border border-[#00F5FF]/40 bg-zinc-950/80 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-[#00F5FF] shadow-[0_0_20px_rgba(0,245,255,0.15)] hover:shadow-[0_0_24px_#00F5FF] disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load tickets"}
        </motion.button>
      </div>

      {error && <p className="mb-6 text-sm text-red-400">{error}</p>}

      {rows && rows.length === 0 && (
        <p className="text-sm text-[#A1A1AA]">No tickets for that email yet.</p>
      )}

      {rows && rows.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 shadow-[0_0_40px_rgba(0,245,255,0.06)] backdrop-blur-xl">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="border-b border-white/10 bg-black/40 text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Genre / mood</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-white/5 last:border-0">
                  <td className="px-6 py-4 font-medium text-white">
                    {r.recipientName?.trim()
                      ? `${r.recipientName}${r.occasion ? ` · ${r.occasion}` : ""}`
                      : "Song ticket"}
                  </td>
                  <td className="px-6 py-4 text-[#A1A1AA]">
                    {r.genre} · {r.mood}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider",
                        r.status === "SONG_DELIVERED"
                          ? "border-[#00F5FF]/40 text-[#00F5FF] shadow-[0_0_12px_rgba(0,245,255,0.2)]"
                          : r.status === "PROMPTS_READY" || r.status === "PAYMENT_RECEIVED"
                            ? "border-[#3B82F6]/35 text-[#3B82F6]"
                            : "border-white/15 text-[#A1A1AA]",
                      )}
                    >
                      {statusLabel(r.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#A1A1AA]">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/ticket/${r.id}?token=${encodeURIComponent(r.accessToken)}`}
                      className="text-xs font-semibold uppercase tracking-wider text-[#00F5FF] hover:underline"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
