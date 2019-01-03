export interface Character {
  literal: string;
  radical: number;
  nelsonRadical: number;
  grade?: number;
  strokeCount: number[];
  freq?: number;
  radicalNames: string[];
  jlpt?: number;
  on: string[];
  kun: string[];
  meaning: string[];
  nanori: string[];
}

export function isKanji(literal: string): boolean {
  const val = literal.codePointAt(0);
  return val !== undefined && (
    (val >= 0x3400 && val <= 0x4DB5) ||
    (val >= 0x4E00 && val <= 0x9FCB) ||
    (val >= 0xF900 && val <= 0xFA6A)
  );
}
