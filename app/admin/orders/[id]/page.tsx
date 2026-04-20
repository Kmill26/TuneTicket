import { Suspense } from "react";
import { AdminOrderDetailClient } from "@/components/AdminOrderDetailClient";

type Props = { params: Promise<{ id: string }> };

function Fallback() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-28 text-sm text-[#A1A1AA]">Loading order…</div>
  );
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <Suspense fallback={<Fallback />}>
      <AdminOrderDetailClient id={id} />
    </Suspense>
  );
}
