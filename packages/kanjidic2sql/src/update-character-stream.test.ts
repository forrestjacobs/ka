import { getUpdateCharactersSql } from "@ka/data";
import { promisify } from "util";
import { UpdateCharacterStream } from "./update-character-stream";

jest.mock("@ka/data");

const CHARACTERS = [
  { literal: "零" },
  { literal: "一" },
  { literal: "二" },
  { literal: "三" },
];

describe("Update character stream", () => {

  let stream: UpdateCharacterStream;

  beforeEach(() => {
    jest.resetAllMocks();
    stream = new UpdateCharacterStream(2);
  });

  test("updates characters in chunks", async () => {
    const write: (chunk: any) => Promise<void> = promisify(stream.write).bind(stream);
    const end = promisify(stream.end).bind(stream) as () => Promise<{}>;

    await write(CHARACTERS[0]);
    expect(getUpdateCharactersSql).toHaveBeenCalledTimes(0);
    await write(CHARACTERS[1]);
    expect(getUpdateCharactersSql).toHaveBeenCalledTimes(1);
    expect(getUpdateCharactersSql).toHaveBeenNthCalledWith(1, [ CHARACTERS[0], CHARACTERS[1] ]);

    await write(CHARACTERS[2]);
    expect(getUpdateCharactersSql).toHaveBeenCalledTimes(1);
    await write(CHARACTERS[3]);
    expect(getUpdateCharactersSql).toHaveBeenCalledTimes(2);
    expect(getUpdateCharactersSql).toHaveBeenNthCalledWith(2, [ CHARACTERS[2], CHARACTERS[3] ]);

    await end();
    expect(getUpdateCharactersSql).toHaveBeenCalledTimes(2);
  });

  test("updates the remainder when stream ends", async () => {
    const write: (chunk: any) => Promise<void> = promisify(stream.write).bind(stream);
    const end = promisify(stream.end).bind(stream) as () => Promise<{}>;

    await write(CHARACTERS[0]);
    expect(getUpdateCharactersSql).toHaveBeenCalledTimes(0);
    await write(CHARACTERS[1]);
    expect(getUpdateCharactersSql).toHaveBeenCalledTimes(1);
    expect(getUpdateCharactersSql).toHaveBeenNthCalledWith(1, [ CHARACTERS[0], CHARACTERS[1] ]);

    await write(CHARACTERS[2]);
    expect(getUpdateCharactersSql).toHaveBeenCalledTimes(1);
    await end();
    expect(getUpdateCharactersSql).toHaveBeenCalledTimes(2);
    expect(getUpdateCharactersSql).toHaveBeenNthCalledWith(2, [ CHARACTERS[2] ]);
  });

});
