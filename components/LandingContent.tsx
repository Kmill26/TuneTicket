"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeroBackdrop } from "./HeroBackdrop";
import { GlassPanel } from "./GlassPanel";
import { LandingExampleStrip } from "./LandingExampleStrip";

const cards = [
  {
    title: "Brief",
    body: "Distill your narrative into a focused creative brief — no musical theory required.",
  },
  {
    title: "Dual prompts",
    body: "Receive two production-grade prompts: one for lyrical intelligence, one for sonic texture.",
  },
  {
    title: "Ticketed delivery",
    body: "A single neon pass to copy, archive, and track — from brief to final master.",
  },
];

export function LandingContent() {
  return (
    <div className="relative">
      <HeroBackdrop />
      <section className="relative mx-auto flex min-h-[85vh] max-w-5xl flex-col justify-center px-6 pb-24 pt-36">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold uppercase tracking-[0.35em] text-[#00F5FF]"
        >
          TuneTicket
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight text-white md:text-6xl md:leading-[1.05]"
        >
          Turn any story into a{" "}
          <span className="bg-gradient-to-r from-white via-[#E4E4E7] to-[#00F5FF] bg-clip-text text-transparent">
            masterpiece song
          </span>
          .
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-[#A1A1AA]"
        >
          A calm, intelligent workflow that transforms your story into prompts ready for Grok and Suno — with the
          restraint of a Tesla cockpit and the clarity of xAI.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex flex-wrap gap-6"
        >
          <Link
            href="/create"
            className="tt-glow-hover inline-flex items-center rounded-md border border-[#00F5FF]/50 bg-zinc-950/80 px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#00F5FF]"
          >
            Start creating
          </Link>
          <Link
            href="/#how"
            className="inline-flex items-center rounded-md border border-white/15 px-10 py-4 text-sm font-medium text-[#A1A1AA] transition hover:border-white/30 hover:text-white"
          >
            See the flow
          </Link>
        </motion.div>
        <LandingExampleStrip />
        <div className="mt-20 grid gap-4 text-xs text-zinc-600 sm:grid-cols-3">
          <p>One-tap ticket generation — your brief, delivered cleanly</p>
          <p>Prompts engineered for modern AI stacks</p>
          <p>Dark-mode native — no visual noise</p>
        </div>
      </section>

      <section id="how" className="relative mx-auto max-w-6xl scroll-mt-28 px-6 pb-32">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">How it works</h2>
          <p className="mt-4 text-sm leading-relaxed text-[#A1A1AA]">
            Three disciplined moves. Infinite sonic outcomes.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <GlassPanel className="h-full hover:border-[#00F5FF]/20" glow>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-white">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#A1A1AA]">{c.body}</p>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
