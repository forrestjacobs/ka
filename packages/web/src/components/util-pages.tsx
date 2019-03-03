import React, { ReactNode } from "react";
import { Route, RouteComponentProps } from "react-router";
import { ApiErrorType } from "../api";
import { AsyncState, AsyncStatus } from "../async";

export function NotFoundPage(): JSX.Element {
  return mapError(ApiErrorType.NotFound, true);
}

export function mapAsyncState<V>(
  state: AsyncState<V> | undefined, map: (value: V) => JSX.Element, isPage: boolean = false,
): JSX.Element {
  return state === undefined || state.status === AsyncStatus.IN_PROGRESS ? <>Loading</> :
    state.status === AsyncStatus.ERROR ? mapError(state.error.type, isPage) :
    map(state.response);
}

function mapError(type: ApiErrorType | undefined, updateStatus: boolean): JSX.Element {
  function render({ staticContext }: RouteComponentProps<any>): ReactNode {
    if (updateStatus && staticContext) {
      staticContext.statusCode = type === ApiErrorType.NotFound ? 404 : 500;
    }
    return type === ApiErrorType.NotFound ? "Not Found" : "Error";
  }

  return <Route {...{render}} />;
}
