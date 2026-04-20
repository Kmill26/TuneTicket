import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function GlassPanel({
  children,
  className,
  glow,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-zinc-950/80 p-8 shadow-xl backdrop-blur-xl",
        glow && "shadow-[0_0_40px_rgba(0,245,255,0.08)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
