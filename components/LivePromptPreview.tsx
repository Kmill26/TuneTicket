"use client";

import { motion } from "framer-motion";
import type { WizardData } from "@/lib/wizard-schema";
import { GlassPanel } from "./GlassPanel";

const REVIEW_STEP_INDEX = 3;

export function LivePromptPreview({
  data,
  step = 0,
}: {
  data: WizardData;
  step?: number;
}) {
  const contentKey = [
    step,
    data.recipientName,
    data.occasion,
    data.emotion,
    data.genre,
    data.mood,
  ].join("|");

  const headline =
    step >= REVIEW_STEP_INDEX
      ? "Your personalized prompts are ready. You'll receive your custom song within 24–48 hours after you generate your ticket."
      : "We're shaping your song from your answers. After you generate your ticket, you'll receive your custom song within 24–48 hours.";

  return (
    <GlassPanel className="sticky top-28 flex min-h-[min(70vh,640px)] flex-col gap-4 p-6" glow>
      <div className="border-b border-white/10 pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#00F5FF]">
          Live preview
        </p>
        <p className="mt-1 text-xs text-[#A1A1AA]">
          A glimpse of your order — full lyrics and production details unlock on your ticket after you tap Generate Ticket.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <motion.div
          key={contentKey}
          initial={{ opacity: 0.75 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22 }}
          className="flex flex-1 flex-col rounded-xl border border-white/5 bg-black/40 p-5"
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            What you&apos;re getting
          </p>
          <p className="mt-4 text-[15px] font-medium leading-relaxed text-white md:text-base">
            {headline}
          </p>
          <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-[#A1A1AA]">
            High-quality emotional lyrics plus professional, polished production — tailored to your story and sound
            choices.
          </p>
        </motion.div>
      </div>
    </GlassPanel>
  );
}
