import React from "react";
import { StaticContext, StaticRouter } from "react-router";
import { create } from "react-test-renderer";
import { ApiError, ApiErrorType } from "../api";
import { AsyncState, AsyncStatus, resolved } from "../async";

import { ErrorEl, Loading, NotFound, Page, MapAsyncState } from "./util-pages";

describe("map async state", () => {
  function forbiddenCallback(): never {
    throw new Error("Callback should not be called");
  }

  it("shows 'loading' when state is not defined", () => {
    const el = create(
      <MapAsyncState state={undefined}>{forbiddenCallback}</MapAsyncState>
    );
    expect(el.toJSON()).toEqual(create(<Loading />).toJSON());
  });

  it("shows 'loading' when state is loading", () => {
    const state: AsyncState<any> = { status: AsyncStatus.IN_PROGRESS };
    const el = create(
      <MapAsyncState state={state}>{forbiddenCallback}</MapAsyncState>
    );
    expect(el.toJSON()).toEqual(create(<Loading />).toJSON());
  });

  it("shows 'not found' when state is not found", () => {
    const state: AsyncState<any> = {
      status: AsyncStatus.ERROR,
      error: new ApiError("Test", ApiErrorType.NotFound)
    };
    const el = create(
      <MapAsyncState state={state}>{forbiddenCallback}</MapAsyncState>
    );
    expect(el.toJSON()).toEqual(create(<NotFound />).toJSON());
  });

  it("shows 'error' when there is any other type of error", () => {
    const state: AsyncState<any> = {
      status: AsyncStatus.ERROR,
      error: new Error("Test")
    };
    const el = create(
      <MapAsyncState state={state}>{forbiddenCallback}</MapAsyncState>
    );
    expect(el.toJSON()).toEqual(create(<ErrorEl />).toJSON());
  });

  it("shows the result of the callback when state is resolved", () => {
    const state: AsyncState<string> = resolved("test");
    const el = create(
      <MapAsyncState state={state}>{text => <>{text}</>}</MapAsyncState>
    );
    expect(el.toJSON()).toEqual(create(<>test</>).toJSON());
  });
});

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
