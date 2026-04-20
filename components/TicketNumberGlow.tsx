"use client";

import { motion } from "framer-motion";

export function TicketNumberGlow({ id }: { id: string }) {
  const short = id.slice(0, 8).toUpperCase();

  return (
    <div className="flex flex-col gap-3 md:items-start">
      <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-zinc-500">Ticket no.</span>
      <motion.span
        className="inline-block font-mono text-base font-semibold tracking-[0.2em] text-white md:text-lg"
        animate={{
          textShadow: [
            "0 0 16px rgba(0, 245, 255, 0.25)",
            "0 0 32px rgba(0, 245, 255, 0.5), 0 0 64px rgba(59, 130, 246, 0.12)",
            "0 0 16px rgba(0, 245, 255, 0.25)",
          ],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {short}
      </motion.span>
      <p className="max-w-[min(100%,280px)] break-all font-mono text-[10px] leading-relaxed text-zinc-600">{id}</p>
    </div>
  );
}
