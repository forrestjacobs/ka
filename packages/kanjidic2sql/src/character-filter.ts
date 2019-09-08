import { Transform } from "stream";
import { Character } from "@ka/base";

export class CharacterFilter extends Transform {
  public constructor() {
    super({ objectMode: true });
  }

  public _transform(
    chunk: Character,
    encoding: string,
    callback: (error?: undefined, data?: Character) => void
  ): void {
    if (
      chunk.meaning.length !== 0 &&
      (chunk.on.length !== 0 || chunk.kun.length !== 0)
    ) {
      callback(undefined, chunk);
    } else {
      callback();
    }
  }
}
