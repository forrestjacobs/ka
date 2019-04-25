import { data } from "./messages-loader";

describe("messages loader", () => {
  it("loads english messages", () => {
    expect(data.en.title()).toEqual("Kanji Dictionary");
  });
});
