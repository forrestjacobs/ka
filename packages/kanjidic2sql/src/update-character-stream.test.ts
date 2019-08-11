import { getUpdateCharactersSql } from "@ka/data";
import { promisify } from "util";
import { UpdateCharacterStream } from "./update-character-stream";

jest.mock("@ka/data");

const CHARACTERS = [{ literal: "零" }, { literal: "一" }, { literal: "二" }];

describe("Update character stream", () => {
  let stream: UpdateCharacterStream;

  beforeEach(() => {
    jest.resetAllMocks();
    stream = new UpdateCharacterStream();
  });

  test("updates characters in chunks", async () => {
    const write: (chunk: any) => Promise<void> = promisify(stream.write).bind(
      stream
    );
    const end = promisify(stream.end).bind(stream) as () => Promise<{}>;

    for (const c of CHARACTERS) {
      await write(c);
    }
    await end();
    expect(getUpdateCharactersSql).toHaveBeenCalledWith(CHARACTERS);
  });
});
