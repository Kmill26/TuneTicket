"use client";

type Props = {
  recipientName: string;
  occasion: string;
  emotion: string;
  mood: string;
};

export function SongDetailsCard({ recipientName, occasion, emotion, mood }: Props) {
  const tone =
    emotion && mood ? `${emotion} · ${mood}` : emotion || mood || "—";

  const rows = [
    { label: "Recipient", value: recipientName?.trim() || "—" },
    { label: "Occasion", value: occasion?.trim() || "—" },
    { label: "Tone", value: tone },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-zinc-900/80 via-[#0a0a0a] to-zinc-950/90 p-8 md:p-10">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#00F5FF]/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[#3B82F6]/[0.07] blur-3xl" />

      <p className="relative text-[10px] font-semibold uppercase tracking-[0.35em] text-[#00F5FF]">Song details</p>
      <h2 className="relative mt-3 text-lg font-semibold tracking-tight text-white md:text-xl">Your brief at a glance</h2>

      <dl className="relative mt-10 grid gap-10 sm:grid-cols-3 sm:gap-0">
        {rows.map((row, i) => (
          <div key={row.label} className={i > 0 ? "sm:border-l sm:border-white/[0.08] sm:pl-10" : ""}>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{row.label}</dt>
            <dd className="mt-3 text-sm font-medium leading-relaxed text-[#E4E4E7] md:text-[15px]">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
