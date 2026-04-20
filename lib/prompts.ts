import type { WizardData } from './wizard-schema';

/**
 * GROK LYRICS PROMPT — World-class emotional songwriting
 */
export function buildGrokLyricsPrompt(d: WizardData): string {
  return `You are a world-class, emotionally intelligent songwriter known for writing deeply personal, vivid, and singable lyrics that feel completely human.

Using ONLY the details below, write original lyrics for a ${d.duration || '2:30–3:00'} song.

**Recipient Details:**
- Name: ${d.recipientName || 'the recipient'}
- Relationship to the buyer: ${d.relationship || 'special person in their life'}
- Personality, quirks & hobbies: ${d.personality || 'warm and caring'}
- Key memories or story: ${d.story || 'their unique journey together'}

**Creative Direction:**
- Emotional tone: ${d.emotion || 'heartfelt and uplifting'}
- Occasion: ${d.occasion || 'special moment'}
- Any specific lines, phrases, or references to include: ${d.specificLines || 'none'}

**Requirements:**
- Structure the lyrics exactly like this with section tags:
[Verse 1]
[Pre-Chorus]
[Chorus]
[Verse 2]
[Pre-Chorus]
[Chorus]
[Bridge]
[Final Chorus]

- Make every line feel personal and specific to the details above.
- Avoid generic clichés. Use vivid imagery and real emotion.
- The final chorus should land with emotional impact.

Output ONLY the lyrics with the section tags. No extra commentary.`;
}

/**
 * SUNO STYLE PROMPT — 2026 optimized for best Custom Mode results
 */
export function buildSunoStylePrompt(d: WizardData): string {
  const genre = d.genre || 'indie folk';
  const mood = d.mood || 'warm and emotional';
  const vocals = d.vocals || 'warm intimate female vocals';
  const instruments =
    d.instruments || 'fingerpicked acoustic guitar and soft strings';
  const tempo = d.tempo || '82 BPM';
  const production =
    d.production || 'clean modern mix with subtle reverb and space';

  return `${genre}, ${mood} energy, ${vocals}, ${instruments}, ${tempo}, ${production}, heartfelt storytelling style, high-quality studio production`;
}

/**
 * Helper to build both prompts at once
 */
export function buildPromptsFromWizard(d: WizardData) {
  return {
    grokPrompt: buildGrokLyricsPrompt(d),
    sunoPrompt: buildSunoStylePrompt(d),
  };
}
