import { Transform } from "stream";

export class FilteredStream<T> extends Transform {
  private readonly filterCallback: (chunk: T) => boolean;

  public constructor(filterCallback: (chunk: T) => boolean) {
    super({ objectMode: true });
    this.filterCallback = filterCallback;
  }

  public _transform(
    chunk: T,
    encoding: string,
    callback: (error?: undefined, data?: T) => void
  ): void {
    if (this.filterCallback(chunk)) {
      callback(undefined, chunk);
    } else {
      callback();
    }
  }
}
