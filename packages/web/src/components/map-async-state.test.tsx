import React from "react";
import { create } from "react-test-renderer";
import {
  resolvedState,
  inProgressState,
  notFoundState,
  errorState
} from "../async";
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
    const el = create(
      <MapAsyncState state={inProgressState}>{forbiddenCallback}</MapAsyncState>
    );
    expect(el.toJSON()).toEqual(create(<Loading />).toJSON());
  });

  it("shows 'not found' when state is not found", () => {
    const el = create(
      <MapAsyncState state={notFoundState}>{forbiddenCallback}</MapAsyncState>
    );
    expect(el.toJSON()).toEqual(create(<NotFound />).toJSON());
  });

  it("shows 'error' when there is any other type of error", () => {
    const el = create(
      <MapAsyncState state={errorState}>{forbiddenCallback}</MapAsyncState>
    );
    expect(el.toJSON()).toEqual(create(<ErrorComponent />).toJSON());
  });

  it("shows the result of the callback when state is resolved", () => {
    const el = create(
      <MapAsyncState state={resolvedState("test")}>
        {text => <>{text}</>}
      </MapAsyncState>
    );
    expect(el.toJSON()).toEqual(create(<>test</>).toJSON());
  });
});
