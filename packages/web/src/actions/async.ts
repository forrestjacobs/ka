import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import {
  AsyncState,
  notFoundState,
  resolvedState,
  inProgressState,
  errorState
} from "../async";

export interface AsyncAction<Type extends string, Request, Response> {
  type: Type;
  request: Request;
  state: AsyncState<Response>;
}

export function asyncDispatch<Req, Res>(
  type: string,
  request: Req,
  apiCall: (request: Req) => Promise<Res>
): (dispatch: ThunkDispatch<unknown, unknown, AnyAction>) => Promise<void> {
  return async (dispatch): Promise<void> => {
    dispatch({ type, request, state: inProgressState });
    try {
      const response = await apiCall(request);
      const state =
        response === undefined ? notFoundState : resolvedState(response);
      dispatch({ type, request, state });
    } catch (error) {
      // todo: log error
      dispatch({ type, request, state: errorState });
    }
  };
}
