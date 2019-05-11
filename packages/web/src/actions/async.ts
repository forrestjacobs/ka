import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { AsyncState, AsyncStatus } from "../async";

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
    dispatch({ type, request, state: { status: AsyncStatus.IN_PROGRESS } });
    try {
      dispatch({
        type,
        request,
        state: {
          status: AsyncStatus.RESOLVED,
          response: await apiCall(request)
        }
      });
    } catch (error) {
      dispatch({ type, request, state: { status: AsyncStatus.ERROR, error } });
    }
  };
}
