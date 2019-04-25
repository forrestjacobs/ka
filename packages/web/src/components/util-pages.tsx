import React, { ReactNode } from "react";
import { Route, RouteComponentProps, StaticContext } from "react-router";
import { ApiErrorType } from "../api";
import { AsyncState, AsyncStatus } from "../async";
import { useMessages } from "../messages";

export function mapAsyncStateToEl<V>(state: AsyncState<V> | undefined, cb: (value: V) => JSX.Element): JSX.Element {
  return mapAsyncState(state, <Loading/>, <ErrorEl/>, <NotFound/>, cb);
}

export function mapAsyncStateToPage<V>(state: AsyncState<V> | undefined, cb: (value: V) => JSX.Element): JSX.Element {
  return mapAsyncState(state, <LoadingPage/>, <ErrorPage/>, <NotFoundPage/>, cb);
}

export function Loading(): JSX.Element {
  const messages = useMessages();
  return (
    <div className="loading-row">
      <span className="sr-only">
        {messages.loading.message()}
      </span>
    </div>
  );
}

export function LoadingPage(): JSX.Element {
  const messages = useMessages();
  return (
    <Page>
      <div className="text-center">
        <div className="spinner-border text-secondary" role="status">
          <span className="sr-only">
            {messages.loading.message()}
          </span>
        </div>
      </div>
    </Page>
  );
}

export function ErrorEl(): JSX.Element {
  const messages = useMessages();
  return <>{messages.error.message()}</>;
}

export function ErrorPage(): JSX.Element {
  const messages = useMessages();
  return (
    <Page status={500} title={messages.error.title()}>
      <ErrorEl/>
    </Page>
  );
}

export function NotFound(): JSX.Element {
  const messages = useMessages();
  return <>{messages.notFound.message()}</>;
}

export function NotFoundPage(): JSX.Element {
  const messages = useMessages();
  return (
    <Page status={404} title={messages.notFound.title()}>
      <NotFound/>
    </Page>
  );
}

export function Page(props: {title?: string, status?: number, children?: ReactNode}): JSX.Element {
  const messages = useMessages();
  const defaultTitle = messages.title();
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
}

function mapAsyncState<V, U>(
  state: AsyncState<V> | undefined, loading: U, error: U, notFound: U, cb: (value: V) => U,
): U {
  return state === undefined || state.status === AsyncStatus.IN_PROGRESS ? loading :
    state.status === AsyncStatus.ERROR && state.error.type === ApiErrorType.NotFound ? notFound :
    state.status === AsyncStatus.ERROR ? error :
      cb(state.response);
}
