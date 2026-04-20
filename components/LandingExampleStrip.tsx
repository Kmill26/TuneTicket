"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WIZARD_EXAMPLES } from "@/lib/wizard-examples";
import { cn } from "@/lib/cn";

const accent = ["#00F5FF", "#8B5CF6", "#3B82F6", "#22C55E"] as const;

function BriefGlyph({ color }: { color: string }) {
  return (
    <span
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/55 shadow-[0_0_24px_rgba(0,245,255,0.12)]"
      style={{ boxShadow: `0 0 24px ${color}2a` }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path d="M4 5.25h10M4 9h10M4 12.75h6.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function LandingExampleStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.28 }}
      className="mt-10 w-full max-w-5xl"
    >
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A1A1AA]">
        Sample briefs — tap to load
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {WIZARD_EXAMPLES.map((ex, i) => (
          <Link
            key={ex.id}
            href={`/create?example=${encodeURIComponent(ex.id)}`}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/65 px-4 py-4 backdrop-blur-xl transition duration-300",
              "hover:-translate-y-0.5 hover:border-[#00F5FF]/45 hover:bg-zinc-950/80 hover:shadow-[0_0_26px_rgba(0,245,255,0.14)]",
            )}
          >
            <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#00F5FF]/8 blur-2xl transition group-hover:bg-[#00F5FF]/15" />
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00F5FF]/45 to-transparent opacity-70" />

            <span className="relative flex items-start justify-between gap-4">
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#00F5FF]/90">
                  Sample {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-semibold text-white">{ex.label}</span>
                <span className="text-[11px] leading-snug text-[#A1A1AA]">{ex.blurb}</span>
              </span>
              <BriefGlyph color={accent[i % accent.length]} />
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
