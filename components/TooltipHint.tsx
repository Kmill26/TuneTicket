"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function TooltipHint({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex align-middle">
      <button
        type="button"
        aria-label="More info"
        className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/15 text-[10px] font-semibold text-[#A1A1AA] transition hover:border-[#00F5FF]/50 hover:text-[#00F5FF]"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        ?
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-xs leading-relaxed text-[#A1A1AA] shadow-[0_0_24px_rgba(0,0,0,0.6)]"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
