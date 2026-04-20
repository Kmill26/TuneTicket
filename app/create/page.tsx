import { Suspense } from "react";
import { CreationWizard } from "@/components/CreationWizard";

function CreateFallback() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-28 text-sm text-[#A1A1AA]">Loading composer…</div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<CreateFallback />}>
      <CreationWizard />
    </Suspense>
  );
}
