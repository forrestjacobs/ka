import { AsyncState, AsyncStatus } from "../async";
import { UnsafeDispatch } from "./unsafe";

export interface AsyncAction<Type extends string, Request, Response> {
  type: Type;
  request: Request;
  state: AsyncState<Response>;
}

export function asyncDispatch(type: string, request: any, apiCall: (request: any) => Promise<any>):
    (dispatch: UnsafeDispatch) => Promise<void> {
  return async (dispatch) => {
    dispatch({ type, request, state: { status: AsyncStatus.IN_PROGRESS } });
    try {
      dispatch({ type, request, state: { status: AsyncStatus.RESOLVED, response: await apiCall(request) } });
    } catch (error) {
      dispatch({ type, request, state: { status: AsyncStatus.ERROR, error } });
      throw error;
    }
  };
}
