import { Character } from "@ka/base";
import { db, pgp } from "./db";

const CHARACTER_CS = new pgp.helpers.ColumnSet([
  "literal",
  "radical",
  { name: "nelson_radical", prop: "nelsonRadical" },
  { name: "grade", def: null },
  { name: "stroke_count", prop: "strokeCount" },
  { name: "freq", def: null },
  { name: "radical_names", prop: "radicalNames" },
  { name: "jlpt", def: null },
  "on",
  "kun",
  "meaning",
  "nanori",
], {
  table: "character",
});

export async function getCharacter(literal: string): Promise<Character | undefined> {
  const result = await db.oneOrNone("SELECT * FROM character WHERE literal = $1", literal);
  if (result === null) {
    return undefined;
  }
  const char: Character = {
    literal: result.literal,
    radical: result.radical,
    nelsonRadical: result.nelson_radical,
    strokeCount: result.stroke_count,
    radicalNames: result.radical_names,
    on: result.on,
    kun: result.kun,
    meaning: result.meaning,
    nanori: result.nanori,
  };
  if (result.grade !== null) {
    char.grade = result.grade;
  }
  if (result.freq !== null) {
    char.freq = result.freq;
  }
  if (result.jlpt !== null) {
    char.jlpt = result.jlpt;
  }
  return char;
}

export function getUpdateCharactersSql(characters: Character[]): string {
  return `${pgp.helpers.insert(characters, CHARACTER_CS)}
    ON CONFLICT (literal) DO UPDATE
    SET radical = EXCLUDED.radical,
        nelson_radical = EXCLUDED.nelson_radical,
        grade = EXCLUDED.grade,
        freq = EXCLUDED.freq,
        jlpt = EXCLUDED.jlpt,
        stroke_count = EXCLUDED.stroke_count,
        radical_names = EXCLUDED.radical_names,
        "on" = EXCLUDED."on",
        kun = EXCLUDED.kun,
        meaning = EXCLUDED.meaning,
        nanori = EXCLUDED.nanori`;
}
