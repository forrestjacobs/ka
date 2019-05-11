let setLocale: string | undefined;
const providerMock = jest.fn();

jest.mock("react", () => ({
  createContext(locale: string): any {
    setLocale = locale;
    return { Provider: providerMock };
  },
  useContext: () => setLocale
}));

jest.mock("./messages-loader", () => ({
  data: {
    en: { title: () => "Test title" }
  }
}));

import { useMessages } from ".";

describe("messages", () => {
  it("uses English locale by default", () => {
    expect(setLocale).toBe("en");
  });

  it("can fetch messages in English", () => {
    expect(useMessages().title()).toBe("Test title");
  });
});
