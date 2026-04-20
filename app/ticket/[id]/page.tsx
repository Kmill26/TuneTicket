import { Suspense } from "react";
import { TicketExperience } from "@/components/TicketExperience";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
};

function TicketFallback() {
  return (
    <div className="mx-auto max-w-lg px-6 pt-32 text-center text-sm text-[#A1A1AA]">
      Loading ticket…
    </div>
  );
}

export default async function TicketPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;

  return (
    <Suspense fallback={<TicketFallback />}>
      <TicketExperience id={id} token={sp.token ?? null} />
    </Suspense>
  );
}
