"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function NavBar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#00F5FF] shadow-[0_0_12px_#00F5FF] transition group-hover:scale-110" />
          <span className="text-sm font-semibold tracking-[0.2em] text-white">TUNETICKET</span>
        </Link>
        <nav className="flex items-center gap-8 text-sm text-[#A1A1AA]">
          <Link href="/#how" className="transition hover:text-white">
            How it works
          </Link>
          <Link href="/dashboard" className="transition hover:text-white">
            Dashboard
          </Link>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/create"
              className="inline-flex items-center rounded-md border border-[#00F5FF]/40 bg-zinc-950/80 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#00F5FF] shadow-[0_0_20px_rgba(0,245,255,0.15)] transition hover:border-[#00F5FF] hover:shadow-[0_0_24px_#00F5FF]"
            >
              Start creating
            </Link>
          </motion.div>
        </nav>
      </div>
    </header>
  );
}
