import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildPromptsFromWizard } from "@/lib/prompts";
import type { WizardData } from "@/lib/wizard-schema";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as WizardData;
    if (
      !body.story?.trim() ||
      !body.recipientName?.trim() ||
      !body.emotion ||
      !body.genre ||
      !body.mood ||
      !body.vocals?.trim() ||
      !body.instruments?.trim()
    ) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const { grokPrompt, sunoPrompt } = buildPromptsFromWizard(body);

    const ticket = await prisma.ticket.create({
      data: {
        email: body.email?.trim() || null,
        customerName: body.customerName?.trim() ?? "",
        occasion: body.occasion?.trim() ?? "",
        recipientName: body.recipientName.trim(),
        relationship: body.relationship?.trim() ?? "",
        personality: body.personality?.trim() ?? "",
        story: body.story.trim(),
        emotion: body.emotion,
        specificLines: body.specificLines?.trim() ?? "",
        genre: body.genre,
        mood: body.mood,
        vocals: body.vocals.trim(),
        instruments: body.instruments.trim(),
        tempo: body.tempo?.trim() ?? "",
        production: body.production?.trim() ?? "",
        duration: body.duration?.trim() ?? "",
        grokPrompt,
        sunoPrompt,
      },
    });

    return NextResponse.json({
      id: ticket.id,
      accessToken: ticket.accessToken,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not create ticket." }, { status: 500 });
  }
}
