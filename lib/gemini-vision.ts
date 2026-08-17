import { GoogleGenAI, Type } from '@google/genai';

// Thin wrapper around the Gemini API for the AI photo minifig identifier
// premium feature. No catalog/DB knowledge lives here -- the caller
// (app/api/scan/identify/route.ts) is responsible for resolving guesses
// against the real catalog and fetching pricing.

let client: GoogleGenAI | null = null;
function getClient(): GoogleGenAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

// gemini-3.6-flash chosen over Flash-Lite for better fine-detail accuracy on
// small printed minifig parts (faces, torso prints) -- cost difference is
// still a fraction of a cent per scan either way. (gemini-2.5-flash was
// deprecated for new callers as of this writing -- Google's error message
// pointed here.)
const MODEL = 'gemini-3.6-flash';

export interface GuessCandidate {
  itemNo: string;
  name: string;
  confidence: number;
}

export type IdentifyResult =
  | { isMixed: false; primary: GuessCandidate; alternates: GuessCandidate[] }
  | { isMixed: true; parts: { head?: GuessCandidate; torso?: GuessCandidate; legs?: GuessCandidate; hair?: GuessCandidate } };

const GUESS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    itemNo: { type: Type.STRING, description: 'The BrickLink catalog item number for this guess.' },
    name: { type: Type.STRING, description: 'The official name of the minifigure or part.' },
    confidence: { type: Type.NUMBER, description: 'Confidence from 0 to 1 that this guess is correct.' },
  },
  required: ['itemNo', 'name', 'confidence'],
};

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    isMixed: {
      type: Type.BOOLEAN,
      description: 'True if this is a custom/mixed figure assembled from parts belonging to different official minifigures, rather than a single complete official minifigure.',
    },
    primary: { ...GUESS_SCHEMA, description: 'Best guess for the complete minifigure. Only set when isMixed is false.' },
    alternates: {
      type: Type.ARRAY,
      items: GUESS_SCHEMA,
      description: 'Up to 2 alternate guesses for the complete minifigure, most confident first. Only set when isMixed is false.',
    },
    head: { ...GUESS_SCHEMA, description: "Guess for the head piece's BrickLink part number. Only set when isMixed is true and a head is visible." },
    torso: { ...GUESS_SCHEMA, description: "Guess for the torso piece's BrickLink part number. Only set when isMixed is true and a torso is visible." },
    legs: { ...GUESS_SCHEMA, description: "Guess for the legs piece's BrickLink part number. Only set when isMixed is true and legs are visible." },
    hair: { ...GUESS_SCHEMA, description: "Guess for the hair/headgear piece's BrickLink part number. Only set when isMixed is true and hair/headgear is visible." },
  },
  required: ['isMixed'],
};

const PROMPT = `You are identifying a LEGO minifigure from a photo for a price-tracking app.

First, decide: is this a single COMPLETE official LEGO minifigure (as originally released), or a CUSTOM/MIXED figure assembled from parts that belong to different official minifigures (a common thing among collectors -- e.g. a head from one set with a torso from another)?

If it is a COMPLETE official minifigure:
- Set isMixed to false.
- Set "primary" to your best guess at its BrickLink catalog item number and name, with a confidence from 0 to 1.
- Set "alternates" to up to 2 other plausible guesses, most confident first. Leave it as an empty array if you have no other plausible guesses.
- Do not set head/torso/legs/hair.

If it is a CUSTOM/MIXED figure:
- Set isMixed to true.
- For each part you can clearly see (head, torso, legs, hair/headgear), give your best guess at that individual part's BrickLink part number and name, with a confidence from 0 to 1.
- Omit any part you cannot see or identify at all.
- Do not set primary/alternates.

Only ever return BrickLink item/part numbers you are actually estimating from visual identification -- never invent a plausible-looking number as a placeholder.`;

export async function identifyMinifig(imageBuffer: Buffer, mimeType = 'image/webp'): Promise<IdentifyResult> {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          { text: PROMPT },
          { inlineData: { data: imageBuffer.toString('base64'), mimeType } },
        ],
      },
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Gemini returned an empty response');
  }

  const parsed = JSON.parse(text);

  if (parsed.isMixed) {
    return {
      isMixed: true,
      parts: {
        head: isValidGuess(parsed.head) ? parsed.head : undefined,
        torso: isValidGuess(parsed.torso) ? parsed.torso : undefined,
        legs: isValidGuess(parsed.legs) ? parsed.legs : undefined,
        hair: isValidGuess(parsed.hair) ? parsed.hair : undefined,
      },
    };
  }

  if (!isValidGuess(parsed.primary)) {
    throw new Error('Gemini did not return a usable primary guess');
  }

  return {
    isMixed: false,
    primary: parsed.primary,
    alternates: Array.isArray(parsed.alternates) ? parsed.alternates.filter(isValidGuess) : [],
  };
}

function isValidGuess(value: unknown): value is GuessCandidate {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as GuessCandidate).itemNo === 'string' &&
    (value as GuessCandidate).itemNo.trim().length > 0 &&
    typeof (value as GuessCandidate).name === 'string' &&
    typeof (value as GuessCandidate).confidence === 'number'
  );
}
