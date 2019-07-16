import React from "react";
import { create } from "react-test-renderer";
import { ApiError, ApiErrorType } from "../api";
import { AsyncState, AsyncStatus, resolved } from "../async";
import { MapAsyncState } from "./map-async-state";
import { Loading } from "./loading/component";
import { NotFound } from "./not-found/component";
import { ErrorComponent } from "./error/component";

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
    expect(el.toJSON()).toEqual(create(<ErrorComponent />).toJSON());
  });

  it("shows the result of the callback when state is resolved", () => {
    const state: AsyncState<string> = resolved("test");
    const el = create(
      <MapAsyncState state={state}>{text => <>{text}</>}</MapAsyncState>
    );
    expect(el.toJSON()).toEqual(create(<>test</>).toJSON());
  });
});
