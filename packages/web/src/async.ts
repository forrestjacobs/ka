export enum AsyncStatus {
  IN_PROGRESS,
  NOT_FOUND,
  ERROR,
  RESOLVED
}

export type AsyncState<Response> =
  | { status: AsyncStatus.IN_PROGRESS }
  | { status: AsyncStatus.NOT_FOUND }
  | { status: AsyncStatus.ERROR }
  | { status: AsyncStatus.RESOLVED; response: Response };

/* eslint-disable @typescript-eslint/no-explicit-any */
export const inProgressState: AsyncState<any> = {
  status: AsyncStatus.IN_PROGRESS
};

export const notFoundState: AsyncState<any> = {
  status: AsyncStatus.NOT_FOUND
};

export const errorState: AsyncState<any> = {
  status: AsyncStatus.ERROR
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export function resolvedState<T>(response: T): AsyncState<T> {
  return { status: AsyncStatus.RESOLVED, response };
}

export function map<T, U>(
  state: AsyncState<T>,
  cb: (response: T) => U
): AsyncState<U> {
  return state.status === AsyncStatus.RESOLVED
    ? resolvedState(cb(state.response))
    : state;
}
