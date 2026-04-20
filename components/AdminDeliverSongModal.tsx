"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SongDeliveryDropzone } from "@/lib/uploadthing-components";
import type { ClientUploadedFileData } from "uploadthing/types";

type UploadMeta = ClientUploadedFileData<{
  ufsUrl: string;
  url: string;
  key: string;
  name: string;
}>;

type Props = {
  open: boolean;
  onClose: () => void;
  recipientName: string;
  customerEmail: string | null;
  orderId: string;
  secret: string;
  /** Called after PATCH completes (order marked delivered; email may still fail). */
  onSuccess: (result: { emailSent: boolean; emailError?: string }) => void;
};

export function AdminDeliverSongModal({
  open,
  onClose,
  recipientName,
  customerEmail,
  orderId,
  secret,
  onSuccess,
}: Props) {
  const [uploadedFile, setUploadedFile] = useState<UploadMeta | null>(null);
  const [deliverSubmitting, setDeliverSubmitting] = useState(false);
  const [deliverError, setDeliverError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setUploadedFile(null);
      setDeliverError(null);
    }
  }, [open]);

  const finalizeDelivery = async () => {
    if (!uploadedFile || !secret.trim() || !customerEmail?.trim()) return;
    setDeliverSubmitting(true);
    setDeliverError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${secret.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fulfillmentStatus: "DELIVERED",
          audioUrl: uploadedFile.url,
          audioKey: uploadedFile.key,
          fileName: uploadedFile.name,
        }),
      });
      const json = (await res.json()) as {
        error?: string;
        emailSent?: boolean;
        emailError?: string;
      };
      if (!res.ok) throw new Error(json.error ?? "Delivery failed");
      const emailOk = json.emailSent === true;
      const emailErr = typeof json.emailError === "string" ? json.emailError : "";
      onSuccess({ emailSent: emailOk, emailError: emailErr });
      onClose();
    } catch (e) {
      setDeliverError(e instanceof Error ? e.message : "Delivery failed");
    } finally {
      setDeliverSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !deliverSubmitting && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal
            aria-labelledby="admin-deliver-title"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#0c0c0c] p-6 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
          >
            <h2 id="admin-deliver-title" className="text-lg font-semibold text-white">
              Mark as delivered
            </h2>
            <p className="mt-1 text-sm text-[#A1A1AA]">
              For <span className="text-white">{recipientName}</span> — upload the final .wav or .mp3 below. The file is{" "}
              <span className="text-zinc-300">required</span>: we attach it to the customer&apos;s email (max ~25 MB for
              email delivery; use MP3 if needed).
            </p>

            {!customerEmail?.trim() && (
              <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                This ticket has no customer email. Add an email on the ticket before delivering.
              </p>
            )}

            <div className="mt-6">
              <SongDeliveryDropzone
                endpoint="songDeliveryAudio"
                headers={() => ({ Authorization: `Bearer ${secret.trim()}` })}
                onClientUploadComplete={(res) => {
                  const first = res[0];
                  if (first) setUploadedFile(first as UploadMeta);
                }}
                onUploadError={(e) => setDeliverError(e.message)}
                content={{
                  allowedContent: "Audio: WAV or MP3 — attach up to ~25 MB; larger files cannot be emailed",
                }}
                appearance={{
                  container:
                    "border border-dashed border-white/20 rounded-xl bg-black/40 ut-uploading:border-[#00F5FF]/40",
                  label: "text-sm text-zinc-300",
                  allowedContent: "text-xs text-zinc-500",
                  button: "ut-ready:bg-zinc-900 ut-ready:text-[#00F5FF] ut-uploading:cursor-not-allowed",
                }}
              />
            </div>

            {uploadedFile && (
              <p className="mt-4 text-sm text-[#A1A1AA]">
                Ready: <span className="font-mono text-xs text-white">{uploadedFile.name}</span>
              </p>
            )}

            {deliverError && <p className="mt-4 text-sm text-red-400">{deliverError}</p>}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={deliverSubmitting}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm text-[#A1A1AA] hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void finalizeDelivery()}
                disabled={deliverSubmitting || !uploadedFile || !customerEmail?.trim()}
                className="rounded-lg border border-[#00F5FF]/50 bg-[#00F5FF]/10 px-5 py-2 text-sm font-semibold text-[#00F5FF] hover:bg-[#00F5FF]/15 disabled:opacity-40"
              >
                {deliverSubmitting ? "Sending…" : "Email song & mark delivered"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
