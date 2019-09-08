import { promisify } from "util";
import { CharacterFilter } from "./character-filter";

jest.mock("@ka/data");

const sun = { literal: "日", meaning: ["sun"], kun: ["ひ"], on: ["ニチ"] };
const voice = { literal: "声", meaning: ["voice"], kun: ["こえ"], on: [] };
const life = { literal: "生", meaning: ["life"], kun: [], on: ["セイ"] };
const band = { literal: "䋝", meaning: ["band"], kun: [], on: [] };
const bird = { literal: "鷣", meaning: [], kun: [], on: [] };

describe("Filter character stream", () => {
  test("removes characters with neither meaning nor reading", async () => {
    const stream = new CharacterFilter();
    const end = promisify(stream.end).bind(stream) as () => Promise<{}>;

    stream.write(sun);
    stream.write(voice);
    stream.write(life);
    stream.write(band);
    stream.write(bird);

    await end();
    expect(stream.read(1)).toEqual(sun);
    expect(stream.read(1)).toEqual(voice);
    expect(stream.read(1)).toEqual(life);
    expect(stream.read(1)).toEqual(null);
  });
});
