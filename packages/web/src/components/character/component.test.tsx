import React from "react";
import { create } from "react-test-renderer";

const useActiveMock = jest.fn();

jest.mock("react-navi", () => ({
  useActive: useActiveMock,
  Link: ({
    active,
    ...props
  }: React.HTMLProps<HTMLAnchorElement> & { active: Boolean }) => {
    expect(active).toBe(false);
    return <a {...props} />;
  }
}));

import { CharacterComponent } from "./component";

const character = {
  literal: "日",
  meaning: ["day"],
  kun: ["ひ"],
  on: ["ニチ"]
};

describe("character component", () => {
  // todo: this should not test class names or translated strings,
  // but that might require switching to a different testing library
  it("displays a character's readings and meanings", () => {
    expect(
      create(<CharacterComponent character={character} />).toJSON()
    ).toEqual(
      create(
        <article className="character-component">
          <h2 className="literal" lang="ja">
            <a href="/character/日">日</a>
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

  it("skips the link if we're on the character URL", () => {
    useActiveMock.mockImplementationOnce(() => true);

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
    const character = {
      literal: "日",
      meaning: ["day"],
      kun: [],
      on: []
    };

    expect(
      create(<CharacterComponent character={character} />).toJSON()
    ).toEqual(
      create(
        <article className="character-component">
          <h2 className="literal" lang="ja">
            <a href="/character/日">日</a>
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
