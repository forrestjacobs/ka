import React, { ReactNode } from "react";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { Route, RouteComponentProps, StaticContext } from "react-router";
import { ApiErrorType } from "../api";
import { AsyncState, AsyncStatus } from "../async";

export function mapAsyncStateToEl<V>(state: AsyncState<V> | undefined, cb: (value: V) => JSX.Element): JSX.Element {
  return mapAsyncState(
    state,
    (
      <div className="loading-row">
        <span className="sr-only">
          <FormattedMessage id="loading.message" />
        </span>
      </div>
    ),
    <FormattedMessage id="error.message"/>,
    <FormattedMessage id="not-found.message"/>,
    cb,
  );
}

export function mapAsyncStateToPage<V>(state: AsyncState<V> | undefined, cb: (value: V) => JSX.Element): JSX.Element {
  return mapAsyncState(
    state,
    (
      <Page>
        <div className="text-center">
          <div className="spinner-border text-secondary" role="status">
            <span className="sr-only">
              <FormattedMessage id="loading.message" />
            </span>
          </div>
        </div>
      </Page>
    ),
    (
      <FormattedMessage id="error.title">
        {(title) => <Page status={500} title={title as string}><FormattedMessage id="error.message" /></Page>}
      </FormattedMessage>
    ),
    <NotFoundPage/>,
    cb,
  );
}

export function NotFoundPage(): JSX.Element {
  return (
    <FormattedMessage id="not-found.title">
      {(title) => <Page status={404} title={title as string}><FormattedMessage id="not-found.message" /></Page>}
    </FormattedMessage>
  );
}

export const Page = injectIntl(
  (props: {title?: string, status?: number, children?: ReactNode} & InjectedIntlProps) => {
    const defaultTitle = props.intl.formatMessage({ id: "title" });
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
