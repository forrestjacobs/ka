import React from "react";
import { StaticRouter } from "react-router";
import { create } from "react-test-renderer";
import { createStore } from "redux";
import { Route } from "./route";

const loadDataMock = jest.fn();
const ComponentMock = jest.fn();
const routesMock: Route[] = [{ component: ComponentMock }];
jest.mock("./routes", () => ({
  routes: routesMock,
  loadData: loadDataMock
}));

import { Root } from "./root";

beforeEach(() => {
  loadDataMock.mockReset();
  ComponentMock.mockReset();
});

describe("root", () => {
  const mockStore = createStore(() => {});

  it("renders initial route", () => {
    ComponentMock.mockImplementationOnce(() => {
      return null;
    });

    const page = create(
      <StaticRouter>
        <Root store={mockStore} />
      </StaticRouter>
    );

    page!.root.findByType(ComponentMock);
  });
});
