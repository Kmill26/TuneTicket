import { Suspense } from "react";
import { AdminOrdersClient } from "@/components/AdminOrdersClient";

function Fallback() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-28 text-sm text-[#A1A1AA]">Loading admin…</div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <AdminOrdersClient />
    </Suspense>
  );
}
