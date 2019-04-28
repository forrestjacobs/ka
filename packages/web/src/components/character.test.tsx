import { Character } from "@ka/base";
import React from "react";
import { create } from "react-test-renderer";
import { CharacterComponent } from "./character";

// NavLink creates a reference to a function, which makes it difficult to check
jest.mock("react-router-dom", () => ({
  NavLink({to, lang, children}: {to: string, lang: string, children: JSX.Element | JSX.Element[]}): JSX.Element {
    return <a href={to} lang={lang}>{children}</a>;
  },
}));

describe("character component", () => {

  // todo: this should not test class names or translated strings,
  // but that might require switching to a different testing library
  it("displays a character's readings and meanings", () => {
    const character = {
      literal: "日",
      on: ["ニチ"],
      kun: ["ひ"],
      meaning: ["day"],
    } as Partial<Character> as Character;

    expect(create((
      <CharacterComponent character={character} />
    )).toJSON()).toEqual(create((
      <div className="row position-relative">
        <div className="col-auto h1 position-static">
          <a href="/character/日" lang="ja">日</a>
        </div>
        <div className="col">
          <ol className="list-inline mb-3">
            <li className="list-inline-item mr-4">day</li>
          </ol>
          <div className="row mb-3">
            <h2 className="h6 col-2 col-md-1 mb-0">Kun</h2>
            <ol className="col list-inline mb-0">
              <li className="list-inline-item mr-4" lang="ja">ひ</li>
            </ol>
          </div>
          <div className="row mb-3">
            <h2 className="h6 col-2 col-md-1 mb-0">On</h2>
            <ol className="col list-inline mb-0">
              <li className="list-inline-item mr-4" lang="ja">ニチ</li>
            </ol>
          </div>
        </div>
      </div>
    )).toJSON());
  });

});
