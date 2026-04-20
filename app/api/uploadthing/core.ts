import { createUploadthing } from "uploadthing/next";
import type { FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

/**
 * Admin-only audio upload for song delivery (.wav / .mp3 via `audio` preset).
 * Client must send Authorization: Bearer ADMIN_SECRET.
 */
export const ourFileRouter = {
  songDeliveryAudio: f(
    {
      audio: { maxFileSize: "256MB", maxFileCount: 1 },
    },
    { awaitServerData: true },
  )
    .middleware(async ({ req }) => {
      const secret = process.env.ADMIN_SECRET?.trim();
      const auth = req.headers.get("authorization");
      if (!secret || auth !== `Bearer ${secret}`) {
        throw new UploadThingError("Unauthorized");
      }
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return {
        ufsUrl: file.ufsUrl,
        url: file.url,
        key: file.key,
        name: file.name,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
