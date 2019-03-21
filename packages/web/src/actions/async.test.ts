import { AsyncStatus } from "../async";
import { asyncDispatch } from "./async";

describe("asyncDispatch", () => {
  const type = "type";
  const request = "query";

  test("dispatches async API calls", async () => {
    const apiCall = jest.fn(async (arg: string) => arg.toUpperCase());
    const dispatch = jest.fn();

    await asyncDispatch(type, request, apiCall)(dispatch);

    expect(dispatch).toBeCalledWith({
      type, request,
      state: { status: AsyncStatus.IN_PROGRESS },
    });

    expect(dispatch).toBeCalledWith({
      type, request,
      state: { status: AsyncStatus.RESOLVED, response: request.toUpperCase() },
    });
  });

  test("handles API errors", async () => {
    const error = new Error("test");
    const apiCall = jest.fn(async () => { throw error; });
    const dispatch = jest.fn();

    await asyncDispatch(type, request, apiCall)(dispatch);

    expect(dispatch).toBeCalledWith({
      type, request,
      state: { status: AsyncStatus.IN_PROGRESS },
    });

    expect(dispatch).toBeCalledWith({
      type, request,
      state: { status: AsyncStatus.ERROR, error },
    });
  });

});
