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
  if (literal.length !== 1) {
    return false;
  }

  const val = literal.codePointAt(0);
  if (val === undefined) {
    return false;
  }

  return (
    (val >= 0x3400 && val <= 0x4db5) || // CJK Unified Ideographs Extension A
    (val >= 0x4e00 && val <= 0x9fff) || // CJK Unified Ideographs
    (val >= 0xf900 && val <= 0xfaff) // CJK Compatibility Ideographs
  );
}
