import React from "react";
import { create } from "react-test-renderer";
import { Character } from "../character/component";
import { Heading, Section } from "../section";

const characterComponentMock = jest.fn(({ character }) => character.literal);
jest.mock("../character/component", () => ({
  CharacterComponent: characterComponentMock
}));

import { SearchPage } from "./page";

describe("search page", () => {
  beforeEach(() => {
    characterComponentMock.mockClear();
  });

  // todo: this should not test class names or translated strings,
  // but that might require switching to a different testing library
  it("shows the search results", () => {
    expect(
      create(
        <SearchPage query="day" characters={[{ literal: "日" } as Character]} />
      ).toJSON()
    ).toEqual(
      create(
        <Section>
          <Heading>1 result for “day”</Heading>
          <ol className="list-group list-group-flush">
            <li className="list-group-item" key="日">
              日
            </li>
          </ol>
        </Section>
      ).toJSON()
    );
  });
});
