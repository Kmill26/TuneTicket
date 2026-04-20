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

const benefits = [
  {
    title: "Done-for-you songwriting intelligence",
    body: "You share the story. We structure it into professional prompt architecture that captures nuance, memory, and emotional intent.",
  },
  {
    title: "Personal touch, never generic",
    body: "Every brief is built around a real relationship and real moments so the final song sounds specific, not templated.",
  },
  {
    title: "Fast turnaround with premium clarity",
    body: "Delivered in 24-48 hours with production-ready Grok + Suno prompts and a clean ticket workflow from start to final export.",
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
          className="mt-7 max-w-4xl text-4xl font-semibold leading-[1.06] tracking-tight text-white md:text-6xl"
        >
          Give someone you love a{" "}
          <span className="bg-gradient-to-r from-white via-[#E4E4E7] to-[#00F5FF] bg-clip-text text-transparent">
            once-in-a-lifetime song
          </span>
          {" "}crafted from your story.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-7 max-w-3xl text-lg leading-relaxed text-[#A1A1AA] md:text-xl"
        >
          TuneTicket blends human creative direction with precision AI prompting so your memories become lyrics, style,
          and emotional tone that actually feel personal.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-11 flex flex-wrap gap-4"
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
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24 }}
          className="mt-7 inline-flex w-fit flex-wrap items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2.5 text-[11px] font-medium text-zinc-300"
        >
          <span>Done-for-you</span>
          <span className="h-1 w-1 rounded-full bg-[#00F5FF]/80" />
          <span>Delivered in 24-48 hours</span>
          <span className="h-1 w-1 rounded-full bg-[#00F5FF]/80" />
          <span>Personalized by a real human</span>
        </motion.div>
        <LandingExampleStrip />

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {benefits.map((benefit) => (
            <GlassPanel key={benefit.title} className="h-full border-white/10 bg-zinc-950/55">
              <p className="text-sm font-semibold text-white">{benefit.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#A1A1AA]">{benefit.body}</p>
            </GlassPanel>
          ))}
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
