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

function characterFromRow(row: any): Character {
  const character: Character = {
    literal: row.literal,
    radical: row.radical,
    nelsonRadical: row.nelson_radical,
    strokeCount: row.stroke_count,
    radicalNames: row.radical_names,
    on: row.on,
    kun: row.kun,
    meaning: row.meaning,
    nanori: row.nanori,
  };
  if (row.grade !== null) {
    character.grade = row.grade;
  }
  if (row.freq !== null) {
    character.freq = row.freq;
  }
  if (row.jlpt !== null) {
    character.jlpt = row.jlpt;
  }
  return character;
}

export async function searchForCharacters(query: string): Promise<Character[]> {
  const terms = query.split(" ").filter((term) => term.length);
  if (terms.length === 0) {
    return [];
  }

  const rows = await db.manyOrNone(`
    SELECT *
    FROM (SELECT *,
          to_tsvector('simple', array_to_string(meaning, ' ')) as meaning_vector
          FROM character) character_search
    WHERE meaning_vector @@ to_tsquery('simple', $1)
  `, terms.join(" & "));
  return rows.map(characterFromRow);
}

export async function getCharacter(literal: string): Promise<Character | undefined> {
  const row = await db.oneOrNone("SELECT * FROM character WHERE literal = $1", literal);
  if (row === null) {
    return undefined;
  }
  return characterFromRow(row);
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
