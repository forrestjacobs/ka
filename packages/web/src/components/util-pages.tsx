import React, { ReactNode } from "react";
import { Route, RouteComponentProps, StaticContext } from "react-router";
import { ApiErrorType } from "../api";
import { AsyncState, AsyncStatus } from "../async";

const DEFAULT_TITLE = "Kanji Dictionary";

export function mapAsyncStateToEl<V>(state: AsyncState<V> | undefined, cb: (value: V) => JSX.Element): JSX.Element {
  return mapAsyncState(state, <>Loading</>, <>Error</>, <>Not Found</>, cb);
}

export function mapAsyncStateToPage<V>(state: AsyncState<V> | undefined, cb: (value: V) => JSX.Element): JSX.Element {
  return mapAsyncState(state, <Page>Loading</Page>, <NotFoundPage/>, <Page title="Error">Error</Page>, cb);
}

export function NotFoundPage(): JSX.Element {
  return <Page title="Not found" status={404}>Not found</Page>;
}

export function Page(props: { title?: string, status?: number, children?: ReactNode }): JSX.Element {
  const title = props.title === undefined ? DEFAULT_TITLE : `${props.title} - ${DEFAULT_TITLE}`;

  function render({ staticContext }: RouteComponentProps<any, {title?: string} & StaticContext>): ReactNode {
    if (staticContext) {
      staticContext.title = title;
      staticContext.statusCode = props.status;
    }

    return <>{props.children}</>;
  }

  if (process.env.TARGET === "web") {
    if (document.title !== title) {
      document.title = title;
    }
    return <>{props.children}</>;
  } else {
    return <Route {...{render}} />;
  }
}

function mapAsyncState<V, U>(
  state: AsyncState<V> | undefined, loading: U, error: U, notFound: U, cb: (value: V) => U,
): U {
  return state === undefined || state.status === AsyncStatus.IN_PROGRESS ? loading :
    state.status === AsyncStatus.ERROR && state.error.type === ApiErrorType.NotFound ? notFound :
    state.status === AsyncStatus.ERROR ? error :
      cb(state.response);
}
