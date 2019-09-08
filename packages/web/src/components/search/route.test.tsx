import { createMemoryNavigation, mount, Navigation } from "navi";
import { searchRoute } from "./route";
import React from "react";
import { SearchPage } from "./page";
import { Character } from "../character/component";

const queryMock = jest.fn(async ({ variables }) => {
  return {
    data: {
      search: [{ literal: "日" }]
    }
  };
});

function makeNavigation(url: string): Navigation {
  return createMemoryNavigation({
    context: { client: { query: queryMock } },
    routes: mount({
      "/search": searchRoute
    }),
    url
  });
}

describe("search route", () => {
  beforeEach(() => {
    queryMock.mockClear();
  });

  it("404s when query is missing", async () => {
    const navigation = makeNavigation("/search");
    const route = await navigation.getRoute();
    expect(route.status).toBe(404);
  });

  it("fetches search results from passed in params", async () => {
    const navigation = makeNavigation("/search?q=day");
    const route = await navigation.getRoute();
    expect(route.views).toEqual([
      <SearchPage query="day" characters={[{ literal: "日" } as Character]} />
    ]);
  });
});
