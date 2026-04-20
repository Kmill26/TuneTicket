export type WizardData = {
  customerName: string;
  occasion: string;
  recipientName: string;
  relationship: string;
  personality: string;
  story: string;
  emotion: string;
  specificLines: string;
  genre: string;
  mood: string;
  vocals: string;
  instruments: string;
  tempo: string;
  production: string;
  duration: string;
  email: string;
};

export const defaultWizardData: WizardData = {
  customerName: "",
  occasion: "",
  recipientName: "",
  relationship: "",
  personality: "",
  story: "",
  emotion: "",
  specificLines: "",
  genre: "",
  mood: "",
  vocals: "",
  instruments: "",
  tempo: "",
  production: "",
  duration: "",
  email: "",
};

export const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Wedding / proposal",
  "Graduation",
  "Just because",
  "Farewell / new chapter",
  "Holiday",
  "Other",
] as const;

export const MOODS = [
  "Warm & nostalgic",
  "Triumphant",
  "Melancholic",
  "Euphoric",
  "Intimate & quiet",
  "Playful",
  "Cinematic",
  "Hopeful",
] as const;

export const GENRES = [
  "Indie folk",
  "Alt-pop",
  "Acoustic ballad",
  "R&B",
  "Synth-pop",
  "Indie rock",
  "Country",
  "Lo-fi",
  "Electronic",
  "Soul",
] as const;

export const VOCAL_PRESETS = [
  "Warm intimate female vocals",
  "Warm intimate male vocals",
  "Breathy ethereal vocals",
  "Powerful belting vocals",
  "Soft spoken / near-whisper",
  "Bright pop lead vocals",
  "Soulful raspy vocals",
] as const;

export const INSTRUMENT_PRESETS = [
  "Fingerpicked acoustic guitar and soft strings",
  "Piano and subtle pads",
  "Electric guitar, bass, and drums",
  "Synth arps and deep bass",
  "Strings and light percussion",
  "Ukulele and hand percussion",
] as const;
