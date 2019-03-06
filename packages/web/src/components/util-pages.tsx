import { InjectedProps, Localized, withLocalization } from "fluent-react";
import React, { ReactNode } from "react";
import { Route, RouteComponentProps, StaticContext } from "react-router";
import { ApiErrorType } from "../api";
import { AsyncState, AsyncStatus } from "../async";

export function mapAsyncStateToEl<V>(state: AsyncState<V> | undefined, cb: (value: V) => JSX.Element): JSX.Element {
  return mapAsyncState(
    state,
    <Localized id="loading"/>,
    <Localized id="error"/>,
    <Localized id="not-found"/>,
    cb,
  );
}

export function mapAsyncStateToPage<V>(state: AsyncState<V> | undefined, cb: (value: V) => JSX.Element): JSX.Element {
  return mapAsyncState(
    state,
    <Localized id="loading">
      <Page />
    </Localized>,
    <Localized id="error" attrs={{title: true}}>
      <Page status={500} title="" />
    </Localized>,
    <NotFoundPage/>,
    cb,
  );
}

export function NotFoundPage(): JSX.Element {
  return (
    <Localized id="not-found" attrs={{title: true}}>
      <Page status={404} title="" />
    </Localized>
  );
}

export const Page = withLocalization(
  (props: {title?: string, status?: number, children?: ReactNode} & InjectedProps) => {
    const defaultTitle = props.getString("title");
    const title = props.title === undefined ? defaultTitle : `${props.title} - ${defaultTitle}`;

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
  });

function mapAsyncState<V, U>(
  state: AsyncState<V> | undefined, loading: U, error: U, notFound: U, cb: (value: V) => U,
): U {
  return state === undefined || state.status === AsyncStatus.IN_PROGRESS ? loading :
    state.status === AsyncStatus.ERROR && state.error.type === ApiErrorType.NotFound ? notFound :
    state.status === AsyncStatus.ERROR ? error :
      cb(state.response);
}
