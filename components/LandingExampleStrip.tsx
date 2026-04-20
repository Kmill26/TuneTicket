"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WIZARD_EXAMPLES } from "@/lib/wizard-examples";
import { cn } from "@/lib/cn";

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
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {WIZARD_EXAMPLES.map((ex, i) => (
          <Link
            key={ex.id}
            href={`/create?example=${encodeURIComponent(ex.id)}`}
            className={cn(
              "group relative flex-1 overflow-hidden rounded-xl border border-white/10 bg-zinc-950/70 px-4 py-3 backdrop-blur-xl transition",
              "hover:border-[#00F5FF]/40 hover:shadow-[0_0_24px_rgba(0,245,255,0.15)]",
              "min-w-[min(100%,220px)] sm:min-w-[200px]",
            )}
          >
            <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#00F5FF]/10 blur-2xl transition group-hover:bg-[#00F5FF]/20" />
            <span className="relative flex flex-col gap-0.5">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-[#00F5FF]/90">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-semibold text-white">{ex.label}</span>
              <span className="text-[11px] leading-snug text-[#A1A1AA]">{ex.blurb}</span>
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
