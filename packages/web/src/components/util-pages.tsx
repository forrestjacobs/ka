import React, { ReactNode } from "react";
import { AsyncState, AsyncStatus } from "../async";

export function Loading(): JSX.Element {
  return <>Loading</>;
}

export function NotFound(): JSX.Element {
  return <>Not found</>;
}

export function Error(): JSX.Element {
  return <>Error</>;
}

export function mapStateToComponent<Response>(
  state: AsyncState<Response | undefined> | undefined, mapper: (response: Response) => ReactNode,
): ReactNode {
  if (state === undefined || state.status === AsyncStatus.IN_PROGRESS) {
    return <Loading />;
  }
  if (state.status === AsyncStatus.ERROR) {
    return <Error />;
  }
  if (state.response === undefined) {
    return <NotFound />;
  }
  return mapper(state.response);
}

export function mapStateToPage<Response>(
  state: AsyncState<Response | undefined> | undefined, mapper: (response: Response) => ReactNode,
): ReactNode {
  return mapStateToComponent(state, mapper);
}
