"use client";

import type { WizardData } from "@/lib/wizard-schema";
import { GlassPanel } from "./GlassPanel";

export function LivePromptPreview({
  step = 0,
}: {
  data: WizardData;
  step?: number;
}) {
  const headline =
    step >= 3
      ? "Your personalized prompts are ready. You'll receive your custom song within 24–48 hours."
      : "We’re shaping your order from your answers. You’ll receive your custom song within 24–48 hours.";

  return (
    <GlassPanel className="sticky top-28 p-6" glow>
      <div className="space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#00F5FF]">What happens next</p>
        <p className="text-sm leading-relaxed text-white">{headline}</p>
        <p className="text-xs leading-relaxed text-[#A1A1AA]">
          No prompt wall here — just complete your brief and create your ticket. Our team handles the rest.
        </p>
      </div>
    </GlassPanel>
  );
}
