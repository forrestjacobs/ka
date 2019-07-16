import React from "react";
import { create, act } from "react-test-renderer";
import { LoadingBar } from "./bar";

describe("loading bar", () => {
  it("can be complete", () => {
    expect(create(<LoadingBar start={undefined} />).toJSON()).toEqual(
      create(
        <div className="loading-bar">
          <div className="track -complete" />
        </div>
      ).toJSON()
    );
  });

  it("can show loading", () => {
    const component = create(<LoadingBar start={0} />);

    // ensure hooks are called
    act(() => {});

    expect(component.toJSON()).toEqual(
      create(
        <div className="loading-bar">
          <div className="track -loadinga" />
        </div>
      ).toJSON()
    );
  });

  it("alternates between loading classes", () => {
    const component = create(<LoadingBar start={0} />);

    // ensure hooks are called
    act(() => {});

    component.update(<LoadingBar start={1} />);

    // ensure hooks are called
    act(() => {});

    expect(component.toJSON()).toEqual(
      create(
        <div className="loading-bar">
          <div className="track -loadingb" />
        </div>
      ).toJSON()
    );
  });

});
