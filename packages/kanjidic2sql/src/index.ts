import { end } from "@ka/data";
import { createReadStream } from "fs";
import { CharacterFilter } from "./character-filter";
import { KanjiDic2Parser } from "./kanjidic2parser";
import { UpdateCharacterStream } from "./update-character-stream";

if (process.argv.length < 3) {
  // eslint-disable-next-line no-console
  console.error("Must pass path to kanjidic2.xml file");
  process.exit(1);
}

createReadStream(process.argv[2], "utf8")
  .pipe(new KanjiDic2Parser())
  .pipe(new CharacterFilter())
  .pipe(new UpdateCharacterStream())
  .pipe(process.stdout)
  .on("finish", (): void => end())
  .on("error", (): void => process.exit(1));
