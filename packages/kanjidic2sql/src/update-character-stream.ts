import { Character } from "@ka/base";
import { getUpdateCharactersSql } from "@ka/data";
import { Transform } from "stream";

export class UpdateCharacterStream extends Transform {
  private readonly bufferSize: number;

  private buffer: Character[];

  public constructor(bufferSize: number) {
    super({ writableObjectMode: true });
    this.bufferSize = bufferSize;
    this.buffer = [];
  }

  public _transform(
    chunk: Character,
    encoding: string,
    callback: (error?: Error, data?: string) => void
  ): void {
    this.buffer.push(chunk);
    if (this.buffer.length < this.bufferSize) {
      callback();
    } else {
      this.updateCharacters(callback);
    }
  }

  public _flush(callback: (error?: Error, data?: unknown) => void): void {
    if (this.buffer.length === 0) {
      callback();
    } else {
      this.updateCharacters(callback);
    }
  }

  private updateCharacters(
    callback: (error?: Error, data?: string) => void
  ): void {
    try {
      const sql = `${getUpdateCharactersSql(this.buffer)};\n`;
      this.buffer = [];
      callback(undefined, sql);
    } catch (error) {
      callback(error);
    }
  }
}
