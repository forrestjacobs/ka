import { isKanji } from "./character";

describe("kanji validation", () => {

  test("accepts characters in CJK Unified Ideographs Extension A", () => {
    expect(isKanji("㐀")).toBe(true);
    expect(isKanji("䶵")).toBe(true);
    expect(isKanji("\u4DB5")).toBe(true);
  });

  test("accepts characters in CJK Unified Ideographs", () => {
    expect(isKanji("一")).toBe(true);
    expect(isKanji("拿")).toBe(true);
    expect(isKanji("挀")).toBe(true);
    expect(isKanji("矿")).toBe(true);
    expect(isKanji("砀")).toBe(true);
    expect(isKanji("賿")).toBe(true);
    expect(isKanji("贀")).toBe(true);
    expect(isKanji("鿕")).toBe(true);
    expect(isKanji("\u9FFF")).toBe(true);
  });

  // tslint:disable-next-line: no-identical-functions
  test("accepts characters in CJK Compatibility Ideographs", () => {
    expect(isKanji("豈")).toBe(true);
    expect(isKanji("舘")).toBe(true);
    expect(isKanji("\uFAFF")).toBe(true);
  });

  test("rejects empty string", () => {
    expect(isKanji("")).toBe(false);
  });

  test("rejects string with multiple characters", () => {
    expect(isKanji("一番")).toBe(false);
  });

  test("rejects characters outside of the defined ranges", () => {
    expect(isKanji("\u33FF")).toBe(false);
    expect(isKanji("\u4DB6")).toBe(false);

    expect(isKanji("\u4DFF")).toBe(false);
    expect(isKanji("\uA000")).toBe(false);

    expect(isKanji("\uF8FF")).toBe(false);
    expect(isKanji("\uFB00")).toBe(false);
  });

});
