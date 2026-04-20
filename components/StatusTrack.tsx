"use client";

import type { TicketStatus } from "@prisma/client";
import { statusOrder, statusLabel, statusStepIndex } from "@/lib/ticket-status";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function StatusTrack({ status }: { status: TicketStatus }) {
  const active = statusStepIndex(status);

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#00F5FF]">
        Fulfillment signal
      </p>
      <div className="relative flex justify-between gap-2">
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/10" />
        {statusOrder.map((s, i) => {
          const done = i <= active;
          return (
            <div key={s} className="relative z-10 flex flex-1 flex-col items-center gap-2 text-center">
              <motion.div
                initial={false}
                animate={{
                  scale: done ? 1 : 0.85,
                  boxShadow: done ? "0 0 20px rgba(0,245,255,0.35)" : "none",
                }}
                className={cn(
                  "h-3 w-3 rounded-full border transition-colors",
                  done
                    ? "border-[#00F5FF] bg-[#00F5FF]"
                    : "border-white/20 bg-[#111111]",
                )}
              />
              <span
                className={cn(
                  "hidden text-[9px] font-medium uppercase tracking-wider sm:block",
                  done ? "text-white" : "text-zinc-600",
                )}
              >
                {statusLabel(s)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
