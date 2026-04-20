"use client";

import { motion } from "framer-motion";
import type { WizardData } from "@/lib/wizard-schema";
import { WIZARD_EXAMPLES } from "@/lib/wizard-examples";
import { cn } from "@/lib/cn";

type Props = {
  activeId: string | null;
  onApply: (data: WizardData, exampleId: string) => void;
};

export function WizardExamplePresets({ activeId, onApply }: Props) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#00F5FF]">
            Curated examples
          </p>
          <p className="mt-1 text-sm text-[#A1A1AA]">
            Load a full brief in one tap — explore the live prompts on the right.
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {WIZARD_EXAMPLES.map((ex, i) => {
          const active = activeId === ex.id;
          return (
            <motion.button
              key={ex.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onApply(ex.data, ex.id)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border px-4 py-4 text-left backdrop-blur-xl transition",
                "bg-zinc-950/75 shadow-[0_0_40px_rgba(0,0,0,0.45)]",
                active
                  ? "border-[#00F5FF]/55 shadow-[0_0_28px_rgba(0,245,255,0.22)]"
                  : "border-white/10 hover:border-[#00F5FF]/35 hover:shadow-[0_0_24px_rgba(0,245,255,0.12)]",
              )}
            >
              <span
                className={cn(
                  "absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition-opacity",
                  active ? "bg-[#00F5FF]/20 opacity-100" : "bg-[#3B82F6]/15 opacity-0 group-hover:opacity-100",
                )}
              />
              <span className="relative flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A1A1AA]">
                  Example {i + 1}
                </span>
                <span className="text-sm font-semibold tracking-tight text-white">{ex.label}</span>
                <span className="text-xs leading-snug text-[#A1A1AA]">{ex.blurb}</span>
              </span>
              <span className="relative mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#00F5FF]">
                Load brief <span aria-hidden>→</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
