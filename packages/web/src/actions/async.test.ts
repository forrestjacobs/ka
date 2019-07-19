import { inProgressState, errorState, resolvedState } from "../async";
import { asyncDispatch } from "./async";

describe("asyncDispatch", () => {
  const type = "type";
  const request = "query";

  test("dispatches async API calls", async () => {
    const apiCall = jest.fn(async (arg: string) => arg.toUpperCase());
    const dispatch = jest.fn();

    await asyncDispatch(type, request, apiCall)(dispatch);

    expect(dispatch).toBeCalledWith({
      type,
      request,
      state: inProgressState
    });

    expect(dispatch).toBeCalledWith({
      type,
      request,
      state: resolvedState(request.toUpperCase())
    });
  });

  test("handles API errors", async () => {
    const apiCall = jest.fn(async () => {
      throw new Error("test");
    });
    const dispatch = jest.fn();

    await asyncDispatch(type, request, apiCall)(dispatch);

    expect(dispatch).toBeCalledWith({
      type,
      request,
      state: inProgressState
    });

    expect(dispatch).toBeCalledWith({
      type,
      request,
      state: errorState
    });
  });
});
