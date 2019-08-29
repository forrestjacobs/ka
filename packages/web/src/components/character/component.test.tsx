import { Character } from "@ka/base";
import React from "react";
import { create } from "react-test-renderer";
import { CharacterComponent } from "./component";

describe("character component", () => {
  // todo: this should not test class names or translated strings,
  // but that might require switching to a different testing library
  it("displays a character's readings and meanings", () => {
    const character = ({
      literal: "日",
      meaning: ["day"],
      kun: ["ひ"],
      on: ["ニチ"]
    } as Partial<Character>) as Character;

    expect(
      create(<CharacterComponent character={character} />).toJSON()
    ).toEqual(
      create(
        <article className="character-component">
          <h2 className="literal" lang="ja">
            日
          </h2>
          <div className="col">
            <section className="vlist">
              <ol>
                <li>day</li>
              </ol>
            </section>
            <section className="vlist">
              <h3 className="heading">Kun</h3>
              <ol lang="ja">
                <li>ひ</li>
              </ol>
            </section>
            <section className="vlist">
              <h3 className="heading">On</h3>
              <ol lang="ja">
                <li>ニチ</li>
              </ol>
            </section>
          </div>
        </article>
      ).toJSON()
    );
  });

  it("omits sections that aren't applicable", () => {
    const character = ({
      literal: "日",
      meaning: ["day"],
      kun: [],
      on: []
    } as Partial<Character>) as Character;

    expect(
      create(<CharacterComponent character={character} />).toJSON()
    ).toEqual(
      create(
        <article className="character-component">
          <h2 className="literal" lang="ja">
            日
          </h2>
          <div className="col">
            <section className="vlist">
              <ol>
                <li>day</li>
              </ol>
            </section>
          </div>
        </article>
      ).toJSON()
    );
  });
});
