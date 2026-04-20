"use client";

import { motion } from "framer-motion";

export function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="tt-grid-bg absolute inset-0 opacity-40" />
      <motion.div
        className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-[#00F5FF]/10 blur-[120px]"
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#3B82F6]/15 blur-[100px]"
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#00F5FF]/30 to-transparent" />
    </div>
  );
}
