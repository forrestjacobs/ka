import React from "react";
import { ApiError, ApiErrorType } from "../api/api";
import { AsyncState, AsyncStatus, resolved } from "../async";
import { ErrorEl, Loading, mapAsyncStateToEl, NotFound } from "./util-pages";

describe("map async state", () => {

  function forbiddenCallback(): never {
    throw new Error("Callback should not be called");
  }

  it("shows 'loading' when state is not defined", () => {
    const el = mapAsyncStateToEl(undefined, forbiddenCallback);
    expect(el).toEqual(<Loading/>);
  });

  it("shows 'loading' when state is loading", () => {
    const state: AsyncState<any> = { status: AsyncStatus.IN_PROGRESS };
    const el = mapAsyncStateToEl(state, forbiddenCallback);
    expect(el).toEqual(<Loading/>);
  });

  it("shows 'not found' when state is not found", () => {
    const state: AsyncState<any> = {
      status: AsyncStatus.ERROR,
      error: new ApiError("Test", ApiErrorType.NotFound),
    };
    const el = mapAsyncStateToEl(state, forbiddenCallback);
    expect(el).toEqual(<NotFound/>);
  });

  it("shows 'error' when there is any other type of error", () => {
    const state: AsyncState<any> = {
      status: AsyncStatus.ERROR,
      error: new Error("Test"),
    };
    const el = mapAsyncStateToEl(state, forbiddenCallback);
    expect(el).toEqual(<ErrorEl/>);
  });

  it("shows the result of the callback when state is resolved", () => {
    const state: AsyncState<string> = resolved("test");
    const el = mapAsyncStateToEl(state, (text) => <>{text}</>);
    expect(el).toEqual(<>test</>);
  });
});
