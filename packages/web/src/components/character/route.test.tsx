import { createMemoryNavigation, mount, Navigation } from "navi";
import React from "react";
import { Character, CharacterComponent } from "./component";
import { characterRoute } from "./route";

const queryMock = jest.fn(async ({ variables }) => {
  return {
    data: {
      character: {
        literal: variables.literal
      }
    }
  };
});

function makeNavigation(url: string): Navigation {
  return createMemoryNavigation({
    context: { client: { query: queryMock } },
    routes: mount({
      "/character/:literal": characterRoute
    }),
    url
  });
}

describe("character route", () => {
  beforeEach(() => {
    queryMock.mockClear();
  });

  it("fetches a character from passed in params", async () => {
    const navigation = makeNavigation("/character/日");
    const route = await navigation.getRoute();
    expect(route.views).toEqual([
      <CharacterComponent character={{ literal: "日" } as Character} />
    ]);
  });
});
