import { end } from "@ka/data";
import { createReadStream } from "fs";
import { get } from "request";
import { createGunzip } from "zlib";
import { KanjiDic2Parser } from "./kanjidic2parser";
import { UpdateCharacterStream } from "./update-character-stream";

const kanjiDic2Stream = (process.argv.length > 1) ?
  createReadStream(process.argv[2], "utf8") :
  get("http://www.edrdg.org/kanjidic/kanjidic2.xml.gz").pipe(createGunzip());

kanjiDic2Stream
  .pipe(new KanjiDic2Parser())
  .pipe(new UpdateCharacterStream(250))
  .pipe(process.stdout)
  .on("finish", () => end())
  .on("error", () => process.exit(1));
