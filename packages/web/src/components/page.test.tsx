import React from "react";
import { StaticContext, StaticRouter } from "react-router";
import { create } from "react-test-renderer";
import { Page } from "./page";

describe("page element", () => {
  beforeEach(() => {
    process.env.TARGET = undefined;
  });

  it("renders children on the web", () => {
    process.env.TARGET = "web";
    expect(
      create(
        <Page>
          <span>child</span>
        </Page>
      ).toJSON()
    ).toEqual(create(<span>child</span>).toJSON());
  });

  it("renders children in node", () => {
    expect(
      create(
        <StaticRouter>
          <Page>
            <span>child</span>
          </Page>
        </StaticRouter>
      ).toJSON()
    ).toEqual(create(<span>child</span>).toJSON());
  });

  it("sets the document title on the web", () => {
    process.env.TARGET = "web";
    create(<Page title="test" />);
    expect(document.title).toBe("test - Kanji Dictionary");
  });

  it("sets title context property in node", () => {
    const context: { title?: string } & StaticContext = {};
    create(
      <StaticRouter context={context}>
        <Page title="test" />
      </StaticRouter>
    );
    expect(context.title).toBe("test - Kanji Dictionary");
  });

  it("sets status code context property in node", () => {
    const context: { title?: string } & StaticContext = {};
    create(
      <StaticRouter context={context}>
        <Page status={404} />
      </StaticRouter>
    );
    expect(context.statusCode).toBe(404);
  });
});
