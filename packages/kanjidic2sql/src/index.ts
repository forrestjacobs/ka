import { end } from "@ka/data";
import { createReadStream } from "fs";
import { KanjiDic2Parser } from "./kanjidic2parser";
import { UpdateCharacterStream } from "./update-character-stream";

const path = process.argv[2];

createReadStream(path, "utf8")
  .pipe(new KanjiDic2Parser())
  .pipe(new UpdateCharacterStream(250))
  .pipe(process.stdout)
  .on("finish", () => end())
  .on("error", () => process.exit(1));
