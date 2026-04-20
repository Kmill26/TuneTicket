import { defaultWizardData, type WizardData } from "./wizard-schema";

export type WizardExample = {
  id: string;
  label: string;
  blurb: string;
  data: WizardData;
};

function ex(overrides: Partial<WizardData>): WizardData {
  return { ...defaultWizardData, ...overrides };
}

export const WIZARD_EXAMPLES: WizardExample[] = [
  {
    id: "birthday-surprise",
    label: "Birthday surprise",
    blurb: "35-year-old wife · hiking · dogs",
    data: ex({
      occasion: "Birthday",
      recipientName: "Jordan",
      relationship: "My wife — we have been together twelve years, married eight.",
      personality:
        "Turns 35 this spring. Calm, witty, fiercely loyal. Lives for weekend trail runs, always has mud on her boots, and our two rescue dogs follow her everywhere. She hums when she cooks and never asks for the spotlight — but she deserves it.",
      story:
        "Last October we watched the sunrise from a ridge she had wanted to hike for years. The dogs tired out halfway; we laughed, shared water, and she said this was enough — being here, together. I want the song to feel like that morning: gratitude, adventure, and the quiet certainty that she is home.",
      emotion: "Warm & nostalgic",
      specificLines:
        "Reference trail dust and sunrise; include the phrase “two tired dogs and forever to go” somewhere in a verse.",
      genre: "Indie folk",
      mood: "Hopeful",
      vocals: "Warm intimate female vocals",
      instruments: "Fingerpicked acoustic guitar and soft strings",
      tempo: "78 BPM",
      production: "Clean modern mix, airy room reverb, subtle tape warmth on vocals",
      duration: "2:45–3:10",
      email: "",
      customerName: "Casey Lee",
    }),
  },
  {
    id: "anniversary-12",
    label: "Anniversary love song",
    blurb: "12 years together",
    data: ex({
      occasion: "Anniversary",
      recipientName: "Sam",
      relationship: "My partner — twelve years, three cities, one stubborn cat.",
      personality:
        "Patient, brilliant, terrible at directions, great at apologies. Loves late-night documentaries and Sunday crossword puzzles. Makes coffee exactly how I like it without asking.",
      story:
        "Twelve years ago we argued about pizza toppings and never stopped choosing each other. We have buried parents, changed careers, and learned to fight fair. This anniversary I want a song that says: I would pick you again in every timeline — not because it is easy, but because it is us.",
      emotion: "Intimate & quiet",
      specificLines:
        "Mention “twelve rings on the calendar” and our cat’s name if it fits: “Miso.”",
      genre: "Acoustic ballad",
      mood: "Warm & nostalgic",
      vocals: "Warm intimate male vocals",
      instruments: "Piano and subtle pads",
      tempo: "72 BPM",
      production: "Intimate close-mic vocal, soft room, strings entering in the second chorus",
      duration: "3:00–3:20",
      email: "",
      customerName: "Jordan Kim",
    }),
  },
  {
    id: "pet-memorial",
    label: "Pet memorial",
    blurb: "Beloved golden retriever",
    data: ex({
      occasion: "Other",
      recipientName: "Sunny",
      relationship: "Our golden retriever — family member for fourteen years.",
      personality:
        "Gentle giant energy, tennis ball obsession, greeted every stranger like a long-lost friend. Shed enough fur to knit a sweater. The house feels too quiet without his nails on the hardwood.",
      story:
        "Sunny waited by the door every day. He was there for first jobs, first homes, and hard goodbyes. When the vet said it was time, he rested his head in my lap like always. I want lyrics that honor joy, not only grief — the way love stays in small habits: an empty leash hook, a slobbery window print, a silence that used to wag.",
      emotion: "Melancholic",
      specificLines:
        "Include “golden light on the kitchen floor” and keep the tone tender, never maudlin.",
      genre: "Indie folk",
      mood: "Cinematic",
      vocals: "Breathy ethereal vocals",
      instruments: "Fingerpicked acoustic guitar and soft strings",
      tempo: "68 BPM",
      production: "Sparse arrangement, long sustains, very light reverb — like a held breath",
      duration: "2:30–2:50",
      email: "",
      customerName: "Morgan Ellis",
    }),
  },
  {
    id: "marriage-proposal",
    label: "Marriage proposal",
    blurb: "The big question",
    data: ex({
      occasion: "Wedding / proposal",
      recipientName: "Riley",
      relationship: "Partner of four years — I am proposing on the waterfront at dusk.",
      personality:
        "Bold, kind, laughs with their whole body. Builds playlists for road trips and remembers everyone’s coffee order. Afraid of heights but climbed a fire escape with me once “for the story.”",
      story:
        "I am asking Riley to marry me where we had our first real conversation — same bench, same harbor lights. Nervous in the best way. The song should build from vulnerable verses to a chorus that feels inevitable: not perfect, but chosen. I want them to feel seen before I even reach for the ring.",
      emotion: "Euphoric",
      specificLines:
        "Work in “stay” as a double meaning — stay here, stay with me. Optional callback to harbor lights.",
      genre: "Alt-pop",
      mood: "Hopeful",
      vocals: "Bright pop lead vocals",
      instruments: "Electric guitar, bass, and drums",
      tempo: "92 BPM",
      production: "Wide stereo, modern pop lift into chorus, restrained verse dynamics",
      duration: "2:55–3:15",
      email: "",
      customerName: "Alex Rivera",
    }),
  },
];
