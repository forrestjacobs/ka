import { Character } from "@ka/base";
import { getUpdateCharactersSql } from "@ka/data";
import { Transform } from "stream";

export class UpdateCharacterStream extends Transform {
  private buffer: Character[];

  public constructor() {
    super({ writableObjectMode: true });
    this.buffer = [];
  }

  public _transform(
    chunk: Character,
    encoding: string,
    callback: () => void
  ): void {
    this.buffer.push(chunk);
    callback();
  }

  public _flush(callback: (error?: Error, data?: unknown) => void): void {
    try {
      callback(undefined, `${getUpdateCharactersSql(this.buffer)};\n`);
    } catch (error) {
      callback(error);
    }
  }
}
