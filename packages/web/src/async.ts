import { HasErrorType, ApiError, ApiErrorType } from "./api";

export enum AsyncStatus {
  IN_PROGRESS,
  RESOLVED,
  ERROR
}

export type AsyncState<Response> =
  | { status: AsyncStatus.IN_PROGRESS }
  | { status: AsyncStatus.RESOLVED; response: Response }
  | { status: AsyncStatus.ERROR; error: Error & Partial<HasErrorType> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const notFound: AsyncState<any> = {
  status: AsyncStatus.ERROR,
  error: new ApiError("Not found", ApiErrorType.NotFound)
};

export function resolved<T>(response: T): AsyncState<T> {
  return { status: AsyncStatus.RESOLVED, response };
}

export function map<T, U>(
  state: AsyncState<T>,
  cb: (response: T) => U
): AsyncState<U> {
  return state.status === AsyncStatus.RESOLVED
    ? resolved(cb(state.response))
    : state;
}
