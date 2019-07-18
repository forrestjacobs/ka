import React from "react";
import { create } from "react-test-renderer";
import { LoadingBar, LoadingBarStatus } from "./bar";

describe("loading bar", () => {
  it("can reflects the passed in status", () => {
    expect(
      create(<LoadingBar status={LoadingBarStatus.Complete} />).toJSON()
    ).toEqual(
      create(
        <div className="loading-bar">
          <div className="track -complete" />
        </div>
      ).toJSON()
    );
  });
});
