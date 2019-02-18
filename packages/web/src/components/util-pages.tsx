import React, { ReactElement, ReactNode } from "react";
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
  state: AsyncState<Response> | undefined, mapper: (response: Response) => ReactNode,
): ReactNode {
  if (state === undefined || state.status === AsyncStatus.IN_PROGRESS) {
    return <Loading />;
  }
  if (state.status === AsyncStatus.ERROR) {
    return <Error error={state.error} />;
  }
  return mapper(state.response);
}

export function mapAsyncPropsToPage<Response>(
  props: { state?: AsyncState<Response>; fetch: () => void; },
  mapper: (response: Response) => ReactNode,
): ReactElement<any> {
  if (props.state === undefined) {
    props.fetch();
  }

  return <>
    {mapStateToComponent(props.state, mapper)}
  </>;
}
