"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  defaultWizardData,
  OCCASIONS,
  MOODS,
  GENRES,
  VOCAL_PRESETS,
  INSTRUMENT_PRESETS,
  type WizardData,
} from "@/lib/wizard-schema";
import { GlassPanel } from "./GlassPanel";
import { TooltipHint } from "./TooltipHint";
import { WizardExamplePresets } from "./WizardExamplePresets";
import { WIZARD_EXAMPLES } from "@/lib/wizard-examples";
import { cn } from "@/lib/cn";

const steps = ["For them", "Heart", "Sound", "Review"];

export function CreationWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(defaultWizardData);
  const [examplePresetId, setExamplePresetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const patch = (p: Partial<WizardData>) => {
    setExamplePresetId(null);
    setData((d) => ({ ...d, ...p }));
  };

  const applyExample = (next: WizardData, id: string) => {
    setData(next);
    setExamplePresetId(id);
    setStep(0);
    setError(null);
  };

  useEffect(() => {
    const q = searchParams.get("example");
    if (!q) return;
    const found = WIZARD_EXAMPLES.find((e) => e.id === q);
    if (!found) return;
    setData(found.data);
    setExamplePresetId(found.id);
    setStep(0);
    setError(null);
    router.replace("/create", { scroll: false });
  }, [searchParams, router]);

  const submitTicket = async () => {
    const email = data.email.trim().toLowerCase();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (
      !data.customerName.trim() ||
      !email ||
      !emailValid ||
      !data.story.trim() ||
      !data.recipientName.trim() ||
      !data.emotion ||
      !data.genre ||
      !data.mood ||
      !data.vocals.trim() ||
      !data.instruments.trim()
    ) {
      setError(
        "Complete your name, valid email, recipient, story, emotion, genre, mood, vocals, and instruments before creating your ticket.",
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          email,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed");
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          `tt_${json.id}`,
          JSON.stringify({ token: json.accessToken }),
        );
      }
      router.push(`/ticket/${json.id}?token=${encodeURIComponent(json.accessToken)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-28">
      <div className="space-y-8">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5FF]">Composer</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Shape your song brief
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-[#A1A1AA]">
            Every field helps us craft a precise, personal request for your custom song.
          </p>
        </header>

        <div id="examples" className="scroll-mt-28">
          <WizardExamplePresets activeId={examplePresetId} onApply={applyExample} />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs text-[#A1A1AA]">
            <span>
              Step {step + 1} / {steps.length}
            </span>
            <span>{steps[step]}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#00F5FF]"
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
          <div className="flex gap-2">
            {steps.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(i)}
                className={cn(
                  "flex-1 rounded-md border px-2 py-2 text-[10px] font-medium uppercase tracking-wider transition",
                  i === step
                    ? "border-[#00F5FF]/50 bg-zinc-950/90 text-[#00F5FF] shadow-[0_0_16px_rgba(0,245,255,0.12)]"
                    : "border-white/10 bg-transparent text-[#A1A1AA] hover:border-white/20 hover:text-white",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <GlassPanel className="space-y-6">
              {step === 0 && <StepRecipient data={data} setData={patch} />}
              {step === 1 && <StepHeart data={data} setData={patch} />}
              {step === 2 && <StepSound data={data} setData={patch} />}
              {step === 3 && <StepReview data={data} setData={patch} />}
            </GlassPanel>
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={back}
            disabled={step === 0 || loading}
            className="rounded-md border border-white/15 px-6 py-3 text-sm font-medium text-[#A1A1AA] transition hover:border-white/30 hover:text-white disabled:opacity-40"
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={next}
              className="rounded-md border border-[#00F5FF]/40 bg-zinc-950/80 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-[#00F5FF] shadow-[0_0_20px_rgba(0,245,255,0.2)] transition hover:shadow-[0_0_28px_#00F5FF]"
            >
              Continue
            </motion.button>
          ) : (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              onClick={submitTicket}
              className="rounded-md border border-[#00F5FF]/40 bg-zinc-950/80 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-[#00F5FF] shadow-[0_0_20px_rgba(0,245,255,0.2)] transition hover:shadow-[0_0_28px_#00F5FF] disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create ticket"}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepRecipient({
  data,
  setData,
}: {
  data: WizardData;
  setData: (p: Partial<WizardData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Recipient &amp; occasion</h2>
        <p className="mt-1 text-sm text-[#A1A1AA]">Who is this song for, and what are you celebrating?</p>
      </div>

      <Field label="Occasion">
        <select
          value={data.occasion}
          onChange={(e) => setData({ occasion: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-[#111111]/80 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5FF]/40"
        >
          <option value="">Select or type below in story</option>
          {OCCASIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>

      <label className="block space-y-2">
        <span className="text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">
          Recipient name <span className="text-red-400">*</span>
        </span>
        <input
          value={data.recipientName}
          onChange={(e) => setData({ recipientName: e.target.value })}
          placeholder="Alex"
          className="w-full rounded-xl border border-white/10 bg-[#111111]/80 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#00F5FF]/40"
        />
      </label>

      <label className="block space-y-2">
        <span className="flex items-center text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">
          Relationship to you
          <TooltipHint text="e.g. partner, best friend, parent — helps Grok keep the perspective honest." />
        </span>
        <input
          value={data.relationship}
          onChange={(e) => setData({ relationship: e.target.value })}
          placeholder="My partner of five years"
          className="w-full rounded-xl border border-white/10 bg-[#111111]/80 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5FF]/40"
        />
      </label>

      <label className="block space-y-2">
        <span className="flex items-center text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">
          Personality, quirks &amp; hobbies
          <TooltipHint text="The small true details that make lyrics feel real — not generic." />
        </span>
        <textarea
          value={data.personality}
          onChange={(e) => setData({ personality: e.target.value })}
          rows={3}
          placeholder="Night owl, loves vinyl, always quotes old movies…"
          className="w-full rounded-xl border border-white/10 bg-[#111111]/80 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5FF]/40"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">
          Story &amp; key memories <span className="text-red-400">*</span>
        </span>
        <textarea
          value={data.story}
          onChange={(e) => setData({ story: e.target.value })}
          rows={8}
          placeholder="The moment you want this song to capture — setting, tension, what changed."
          className="w-full rounded-xl border border-white/10 bg-[#111111]/80 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#00F5FF]/40 focus:shadow-[0_0_20px_rgba(0,245,255,0.08)]"
        />
      </label>
    </div>
  );
}

function StepHeart({
  data,
  setData,
}: {
  data: WizardData;
  setData: (p: Partial<WizardData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Heart &amp; lines</h2>
        <p className="mt-1 text-sm text-[#A1A1AA]">Emotional temperature and anything you need woven in verbatim.</p>
      </div>

      <Field label="Emotional tone">
        <select
          value={data.emotion}
          onChange={(e) => setData({ emotion: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-[#111111]/80 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5FF]/40"
        >
          <option value="">Select emotional tone</option>
          {MOODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </Field>

      <label className="block space-y-2">
        <span className="flex items-center text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">
          Specific lines, phrases, or references (optional)
          <TooltipHint text="Exact phrases, inside jokes, or places Grok should name-check." />
        </span>
        <textarea
          value={data.specificLines}
          onChange={(e) => setData({ specificLines: e.target.value })}
          rows={4}
          placeholder="Include the phrase “northbound train” / reference our trip to Lisbon…"
          className="w-full rounded-xl border border-white/10 bg-[#111111]/80 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5FF]/40"
        />
      </label>
    </div>
  );
}

function StepSound({
  data,
  setData,
}: {
  data: WizardData;
  setData: (p: Partial<WizardData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Sound &amp; production</h2>
        <p className="mt-1 text-sm text-[#A1A1AA]">Everything Suno needs for a tight Custom Mode prompt.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Genre">
          <select
            value={data.genre}
            onChange={(e) => setData({ genre: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-[#111111]/80 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5FF]/40"
          >
            <option value="">Select genre</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Mood / energy">
          <select
            value={data.mood}
            onChange={(e) => setData({ mood: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-[#111111]/80 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5FF]/40"
          >
            <option value="">Select mood</option>
            {MOODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Vocals">
        <input
          list="tt-vocals-presets"
          value={data.vocals}
          onChange={(e) => setData({ vocals: e.target.value })}
          placeholder="Choose a preset or describe your own…"
          className="w-full rounded-xl border border-white/10 bg-[#111111]/80 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5FF]/40"
        />
        <datalist id="tt-vocals-presets">
          {VOCAL_PRESETS.map((v) => (
            <option key={v} value={v} />
          ))}
        </datalist>
      </Field>

      <Field label="Instruments">
        <input
          list="tt-instrument-presets"
          value={data.instruments}
          onChange={(e) => setData({ instruments: e.target.value })}
          placeholder="Palette or your own arrangement…"
          className="w-full rounded-xl border border-white/10 bg-[#111111]/80 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5FF]/40"
        />
        <datalist id="tt-instrument-presets">
          {INSTRUMENT_PRESETS.map((i) => (
            <option key={i} value={i} />
          ))}
        </datalist>
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Tempo (optional)">
          <input
            value={data.tempo}
            onChange={(e) => setData({ tempo: e.target.value })}
            placeholder="82 BPM"
            className="w-full rounded-xl border border-white/10 bg-[#111111]/80 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5FF]/40"
          />
        </Field>
        <Field label="Production (optional)">
          <input
            value={data.production}
            onChange={(e) => setData({ production: e.target.value })}
            placeholder="Clean mix, wide vocal…"
            className="w-full rounded-xl border border-white/10 bg-[#111111]/80 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5FF]/40"
          />
        </Field>
        <Field label="Target duration (optional)">
          <input
            value={data.duration}
            onChange={(e) => setData({ duration: e.target.value })}
            placeholder="2:30–3:00"
            className="w-full rounded-xl border border-white/10 bg-[#111111]/80 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5FF]/40"
          />
        </Field>
      </div>
    </div>
  );
}

function StepReview({
  data,
  setData,
}: {
  data: WizardData;
  setData: (p: Partial<WizardData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Review &amp; contact</h2>
        <p className="mt-1 text-sm text-[#A1A1AA]">
          Your name and email identify you as the customer; we&apos;ll use them for your order and confirmations.
        </p>
      </div>

      <label className="block space-y-2">
        <span className="text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">
          Your full name <span className="text-red-400">*</span>
        </span>
        <input
          type="text"
          value={data.customerName}
          onChange={(e) => setData({ customerName: e.target.value })}
          placeholder="Your legal or preferred name"
          className="w-full rounded-xl border border-white/10 bg-[#111111]/80 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5FF]/40"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">
          Email <span className="text-red-400">*</span>
        </span>
        <input
          type="email"
          required
          value={data.email}
          onChange={(e) => setData({ email: e.target.value })}
          placeholder="you@domain.com"
          className="w-full rounded-xl border border-white/10 bg-[#111111]/80 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5FF]/40"
        />
      </label>

      <ul className="space-y-2 text-sm text-[#A1A1AA]">
        <li>
          <span className="text-white">Customer ·</span> {data.customerName || "—"} · {data.email || "—"}
        </li>
        <li>
          <span className="text-white">For ·</span> {data.recipientName || "—"}{" "}
          {data.occasion ? `· ${data.occasion}` : ""}
        </li>
        <li>
          <span className="text-white">Emotion ·</span> {data.emotion || "—"}
        </li>
        <li>
          <span className="text-white">Sound ·</span> {data.genre || "—"} · {data.mood || "—"}
        </li>
        <li>
          <span className="text-white">Vocals / instruments ·</span> {data.vocals || "—"} · {data.instruments || "—"}
        </li>
      </ul>

      <p className="text-xs leading-relaxed text-zinc-500">
        Your request will be processed after you tap Generate Ticket.
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">{label}</span>
      {children}
    </label>
  );
}
