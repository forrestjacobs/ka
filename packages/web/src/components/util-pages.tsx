import React from "react";
import { ApiError, ApiErrorType } from "../api";
import { AsyncState, AsyncStatus } from "../async";

export function Loading(): JSX.Element {
  return <>Loading</>;
}

export function NotFound(): JSX.Element {
  return <>Not found</>;
}

export function Error({error}: {error: Error & Partial<ApiError> }): JSX.Element {
  return (error.type === ApiErrorType.NotFound) ? <NotFound /> : <>Error</>;
}

export function mapStateToComponent<Response>(
  state: AsyncState<Response> | undefined, mapper: (response: Response) => JSX.Element,
): JSX.Element {
  if (state === undefined || state.status === AsyncStatus.IN_PROGRESS) {
    return <Loading />;
  }
  if (state.status === AsyncStatus.ERROR) {
    return <Error error={state.error} />;
  }
  return mapper(state.response);
}

export function mapAsyncStateToPage<Response>(
  state: AsyncState<Response> | undefined,
  mapper: (response: Response) => JSX.Element,
): JSX.Element {
  return mapStateToComponent(state, mapper);
}
