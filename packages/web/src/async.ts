import { HasErrorType } from "./api";

export enum AsyncStatus {
  IN_PROGRESS,
  RESOLVED,
  ERROR
}

export type AsyncState<Response> =
  | { status: AsyncStatus.IN_PROGRESS }
  | { status: AsyncStatus.RESOLVED; response: Response }
  | { status: AsyncStatus.ERROR; error: Error & Partial<HasErrorType> };

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
