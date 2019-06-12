import { HooksProvider, useDispatch } from "@epeli/redux-hooks";
import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps, Route } from "react-router";
import { Store } from "redux";
import { MessagesProvider } from "../messages";
import { routes, loadData } from "./routes";
import { Nav } from "./nav/component";
import { renderRoutes } from "react-router-config";
import { LoadingPage, ErrorPage } from "./util-pages";
import { AsyncStatus } from "../async";

const LoadingSwitch = withRouter(
  ({
    location,
    status
  }: RouteComponentProps & { status: AsyncStatus }): JSX.Element => {
    const [renderedStatus, setRenderedStatus] = useState(status);
    const [renderedLocation, setRenderedLocation] = useState(location);
    const dispatch = useDispatch();

    useEffect((): void => {
      loadData(
        location,
        dispatch,
        (error?: Error): void => {
          setRenderedStatus(error ? AsyncStatus.ERROR : AsyncStatus.RESOLVED);
          setRenderedLocation(location);
        }
      );
    }, [location]);

    return renderedStatus === AsyncStatus.IN_PROGRESS ? (
      <LoadingPage />
    ) : renderedStatus === AsyncStatus.ERROR ? (
      <ErrorPage />
    ) : (
      <Route
        location={renderedLocation}
        render={(): JSX.Element => renderRoutes(routes)}
      />
    );
  }
);

export function Root({
  store,
  status
}: {
  store: Store;
  status: AsyncStatus;
}): JSX.Element {
  return (
    <MessagesProvider value="en">
      <HooksProvider store={store}>
        <div className="container">
          <Nav />
          <LoadingSwitch status={status} />
        </div>
      </HooksProvider>
    </MessagesProvider>
  );
}
