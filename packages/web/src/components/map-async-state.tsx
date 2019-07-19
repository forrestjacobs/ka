import React from "react";
import { AsyncState, AsyncStatus } from "../async";
import { ErrorComponent } from "./error/component";
import { ErrorPage } from "./error/page";
import { Loading } from "./loading/component";
import { LoadingPage } from "./loading/page";
import { NotFound } from "./not-found/component";
import { NotFoundPage } from "./not-found/page";

interface AsyncStateMapping {
  loading(): JSX.Element;
  notFound(): JSX.Element;
  error(): JSX.Element;
}

const componentMapping: AsyncStateMapping = {
  loading: Loading,
  notFound: NotFound,
  error: ErrorComponent
};

const pageMapping: AsyncStateMapping = {
  loading: LoadingPage,
  notFound: NotFoundPage,
  error: ErrorPage
};

function mapAsyncState<V>(
  state: AsyncState<V> | undefined,
  mapping: AsyncStateMapping,
  cb: (value: V) => JSX.Element
): JSX.Element {
  if (state === undefined || state.status === AsyncStatus.IN_PROGRESS) {
    return <mapping.loading />;
  }

  if (state.status === AsyncStatus.NOT_FOUND) {
    return <mapping.notFound />;
  }

  if (state.status === AsyncStatus.ERROR) {
    return <mapping.error />;
  }

  return cb(state.response);
}

export function MapAsyncState<V>({
  state,
  page,
  children
}: {
  state: AsyncState<V> | undefined;
  page?: boolean;
  children: (value: V) => JSX.Element;
}): JSX.Element {
  return mapAsyncState(state, page ? pageMapping : componentMapping, children);
}
