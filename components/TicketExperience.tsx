"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { FulfillmentStatus, TicketStatus } from "@prisma/client";
import { StatusTrack } from "./StatusTrack";
import { TicketNumberGlow } from "./TicketNumberGlow";
import { SongDetailsCard } from "./SongDetailsCard";

type TicketPayload = {
  id: string;
  createdAt: string;
  email: string | null;
  customerName: string;
  fulfillmentStatus: FulfillmentStatus;
  recipientName: string;
  occasion: string;
  emotion: string;
  mood: string;
  status: TicketStatus;
  promptsLocked: boolean;
};

const ease = [0.22, 1, 0.36, 1] as const;

const inner = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.11, delayChildren: 0.08 },
  },
};

const section = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

export function TicketExperience({ id, token: tokenProp }: { id: string; token: string | null }) {
  const [ticket, setTicket] = useState<TicketPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [storedToken, setStoredToken] = useState<string | null>(null);

  useEffect(() => {
    if (tokenProp || typeof window === "undefined") return;
    const raw = sessionStorage.getItem(`tt_${id}`);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { token?: string };
      if (parsed.token) setStoredToken(parsed.token);
    } catch {
      /* ignore */
    }
  }, [id, tokenProp]);

  const token = useMemo(() => tokenProp ?? storedToken, [tokenProp, storedToken]);

  const load = useCallback(async () => {
    setError(null);
    const params = new URLSearchParams();
    if (token) params.set("token", token);
    const res = await fetch(`/api/tickets/${id}?${params.toString()}`);
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Could not load ticket.");
      return;
    }
    setTicket({
      ...json.ticket,
      promptsLocked: json.ticket.promptsLocked ?? json.ticket.status === "AWAITING_PAYMENT",
    });
  }, [id, token]);

  useEffect(() => {
    void load();
  }, [load]);

  const generateTicket = async () => {
    if (!ticket || !token) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`/api/tickets/${ticket.id}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          ...(ticket.email?.trim() ? { email: ticket.email.trim() } : {}),
          ...(ticket.customerName?.trim() ? { customerName: ticket.customerName.trim() } : {}),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not generate ticket.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setGenerating(false);
    }
  };

  const devDelivered = async () => {
    if (!ticket || !token) return;
    await fetch("/api/dev/mark-delivered", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId: ticket.id, token }),
    });
    void load();
  };

  if (error && !ticket) {
    return (
      <div className="mx-auto max-w-lg px-6 pt-32 text-center text-sm text-red-400">
        {error}
      </div>
    );
  }

  if (!ticket) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-lg px-6 pt-36 text-center text-sm text-[#A1A1AA]"
      >
        Initializing ticket…
      </motion.div>
    );
  }

  const locked = ticket.promptsLocked || ticket.status === "AWAITING_PAYMENT";

  if (!locked) {
    return (
      <div className="relative min-h-screen bg-[#0A0A0A]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[min(50vh,420px)] bg-gradient-to-b from-[#00F5FF]/[0.04] via-transparent to-transparent" />
        <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 pb-24 pt-24 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="rounded-[28px] border border-[#00F5FF]/20 bg-zinc-950/60 p-10 shadow-[0_0_120px_rgba(0,0,0,0.7)] backdrop-blur-2xl md:p-14"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#00F5FF]">TuneTicket</p>
            <h1 className="mt-6 text-2xl font-semibold leading-snug tracking-tight text-white md:text-3xl">
              Thank you! Your custom song request has been received.
            </h1>
            <p className="mt-6 text-[17px] leading-relaxed text-[#A1A1AA]">
              You&apos;ll receive your personalized song within <span className="text-white">24–48 hours</span>.
            </p>
            <p className="mt-10 font-mono text-xs text-zinc-600">
              Request ID · {ticket.id}
            </p>
            {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
            {process.env.NODE_ENV === "development" && token && (
              <div className="mt-10 border-t border-dashed border-white/10 pt-8">
                <button
                  type="button"
                  onClick={devDelivered}
                  className="rounded-lg border border-white/15 px-4 py-2 text-xs text-[#A1A1AA] hover:text-white"
                >
                  Dev: mark song delivered
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0A0A0A]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[min(50vh,420px)] bg-gradient-to-b from-[#00F5FF]/[0.04] via-transparent to-transparent" />

      <div className="relative mx-auto max-w-5xl px-6 pb-36 pt-32 md:px-12 md:pb-44 md:pt-40 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease }}
          className="rounded-[28px] border border-white/[0.07] bg-zinc-950/50 p-8 shadow-[0_0_120px_rgba(0,0,0,0.7)] backdrop-blur-2xl md:p-12 lg:p-14"
        >
          <motion.div variants={inner} initial="hidden" animate="show" className="space-y-14 md:space-y-16">
            <motion.header
              variants={section}
              className="flex flex-col gap-10 border-b border-white/[0.08] pb-12 md:flex-row md:items-start md:justify-between md:gap-16"
            >
              <div className="max-w-2xl space-y-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#00F5FF]">TuneTicket</p>
                <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
                  Your Custom Song Request
                </h1>
                <p className="text-base leading-relaxed text-[#A1A1AA] md:text-[17px] md:leading-relaxed">
                  Review your story summary below, then confirm to send your order to our team. Production details stay
                  with us — you&apos;ll get your finished song by email when it&apos;s ready.
                </p>
                <p className="font-mono text-xs text-zinc-600">
                  Draft saved{" "}
                  {new Date(ticket.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <TicketNumberGlow id={ticket.id} />
            </motion.header>

            <motion.div variants={section}>
              <SongDetailsCard
                recipientName={ticket.recipientName}
                occasion={ticket.occasion}
                emotion={ticket.emotion}
                mood={ticket.mood}
              />
            </motion.div>

            <motion.div variants={section} className="space-y-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500">Status</p>
              <StatusTrack status={ticket.status} />
            </motion.div>

            <motion.div
              variants={section}
              className="rounded-2xl border border-[#3B82F6]/20 bg-gradient-to-br from-[#3B82F6]/[0.07] to-transparent p-8 md:p-10"
            >
              <p className="text-lg font-medium text-white">Send your request</p>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#A1A1AA]">
                This saves your order and emails our studio the full creative brief. You won&apos;t see technical
                production prompts here — they&apos;re for our team only.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={generating || !token}
                  onClick={generateTicket}
                  className="rounded-xl border border-[#00F5FF]/50 bg-black/40 px-10 py-5 text-base font-semibold uppercase tracking-[0.12em] text-[#00F5FF] shadow-[0_0_32px_rgba(0,245,255,0.2)] transition hover:shadow-[0_0_40px_rgba(0,245,255,0.35)] disabled:opacity-50"
                >
                  {generating ? "Sending…" : "Generate Ticket"}
                </motion.button>
              </div>
              {!token && (
                <p className="mt-4 text-sm text-amber-200/90">
                  Open this page using the link from your session (with access token) to confirm your request.
                </p>
              )}
            </motion.div>

            {error && <p className="text-sm text-red-400">{error}</p>}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
