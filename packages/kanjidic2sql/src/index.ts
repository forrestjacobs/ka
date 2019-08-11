import { Character } from "@ka/base";
import { end } from "@ka/data";
import { createReadStream } from "fs";
import { FilteredStream } from "./filtered-stream";
import { KanjiDic2Parser } from "./kanjidic2parser";
import { UpdateCharacterStream } from "./update-character-stream";

if (process.argv.length < 3) {
  // eslint-disable-next-line no-console
  console.error("Must pass path to kanjidic2.xml file");
  process.exit(1);
}

createReadStream(process.argv[2], "utf8")
  .pipe(new KanjiDic2Parser())
  .pipe(
    new FilteredStream(
      ({ meaning, on, kun }: Character): boolean =>
        meaning.length !== 0 && (on.length !== 0 || kun.length !== 0)
    )
  )
  .pipe(new UpdateCharacterStream())
  .pipe(process.stdout)
  .on("finish", (): void => end())
  .on("error", (): void => process.exit(1));
