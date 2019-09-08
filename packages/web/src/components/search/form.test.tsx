import React from "react";
import { act, create, ReactTestRenderer } from "react-test-renderer";

const useActiveMock = jest.fn(() => false);
const useCurrentRouteMock = jest.fn();

const navigateMock = jest.fn();
const useNavigation = jest.fn(() => ({
  navigate: navigateMock
}));

jest.mock("react-navi", () => ({
  useActive: useActiveMock,
  useCurrentRoute: useCurrentRouteMock,
  useNavigation: useNavigation
}));

import { SearchForm } from "./form";

function updateQuery(query: string, form: ReactTestRenderer): void {
  act(() => {
    form.root.findByType("input").props.onChange({
      target: { value: query }
    });
  });
}

describe("search form", () => {
  beforeEach(() => {
    useActiveMock.mockClear();
    useCurrentRouteMock.mockClear();
    navigateMock.mockClear();
  });

  it("uses the URL's query", () => {
    useActiveMock.mockImplementationOnce(() => true);
    useCurrentRouteMock.mockImplementationOnce(() => ({
      url: {
        search: "?q=url%20query"
      }
    }));

    const form = create(<SearchForm />);

    // ensure hooks are called
    act(() => {});

    expect(form.root.findByType("input").props.value).toBe("url query");
  });

  it("updates the query on input", () => {
    const form = create(<SearchForm />);
    updateQuery("new value", form);
    expect(form.root.findByType("input").props.value).toBe("new value");
  });

  it("navigates to the search page with the query when submitted", () => {
    const form = create(<SearchForm />);

    const preventDefaultMock = jest.fn();
    updateQuery("new value", form);
    act(() => {
      form.root.findByType("form").props.onSubmit({
        preventDefault: preventDefaultMock
      });
    });

    expect(preventDefaultMock).toBeCalled();
    expect(navigateMock).toBeCalledWith("/search?q=new%20value");
  });
});
