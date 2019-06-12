import { createStore } from "redux";
import { StaticRouter } from "react-router";
import React from "react";
import { LoadingPage, ErrorPage } from "./util-pages";
import { create, act } from "react-test-renderer";
import { Route } from "./route";

const loadDataMock = jest.fn();
const ComponentMock = jest.fn();
const routesMock: Route[] = [{ component: ComponentMock }];
jest.mock("./routes", () => ({
  routes: routesMock,
  loadData: loadDataMock
}));

import { Root } from "./root";
import { AsyncStatus } from "../async";

beforeEach(() => {
  loadDataMock.mockReset();
  ComponentMock.mockReset();
});

describe("root", () => {
  const mockStore = createStore(() => {});

  it("renders routes when preloaded", done => {
    ComponentMock.mockImplementationOnce(() => {
      done();
      return null;
    });

    create(
      <StaticRouter>
        <Root store={mockStore} status={AsyncStatus.RESOLVED} />
      </StaticRouter>
    );
  });

  it("first shows the loading page", () => {
    const page = create(
      <StaticRouter>
        <Root store={mockStore} status={AsyncStatus.IN_PROGRESS} />
      </StaticRouter>
    );

    page!.root.findByType(LoadingPage);
  });

  xit("shows errant state", () => {
    let resolver: (error?: Error) => void;
    loadDataMock.mockImplementationOnce(
      (
        location: unknown,
        dispatch: unknown,
        callback: (error?: Error) => void
      ): void => {
        resolver = callback;
      }
    );

    const page = create(
      <StaticRouter>
        <Root store={mockStore} status={AsyncStatus.IN_PROGRESS} />
      </StaticRouter>
    );
    expect(loadDataMock).toBeCalledTimes(1);

    act(() => {
      resolver(new Error());
    });
    page!.root.findByType(ErrorPage);
  });

  it("shows resolved state", done => {
    let resolver: (error?: Error) => void;
    loadDataMock.mockImplementationOnce(
      (
        location: unknown,
        dispatch: unknown,
        callback: (error?: Error) => void
      ): void => {
        resolver = callback;
      }
    );

    create(
      <StaticRouter>
        <Root store={mockStore} status={AsyncStatus.IN_PROGRESS} />
      </StaticRouter>
    );
    expect(loadDataMock).toBeCalledTimes(1);

    ComponentMock.mockImplementationOnce(() => {
      done();
      return null;
    });

    act(() => {
      resolver();
    });
  });
});
