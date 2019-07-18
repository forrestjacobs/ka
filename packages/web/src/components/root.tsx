import { HooksProvider, useDispatch } from "@epeli/redux-hooks";
import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps, Route } from "react-router";
import { Store } from "redux";
import { MessagesProvider } from "../messages";
import { routes, loadData } from "./routes";
import { LoadingBar, LoadingBarStatus } from "./loading/bar";
import { Nav } from "./nav/component";
import { renderRoutes } from "react-router-config";

const LoadingSwitch = withRouter(
  ({ location }: RouteComponentProps): JSX.Element => {
    const [loadingBarStatus, setLoadingBarStatus] = useState(
      LoadingBarStatus.Complete
    );
    const [renderedLocation, setRenderedLocation] = useState(location);
    const dispatch = useDispatch();

    useEffect((): (() => void) => {
      let canceled = false;

      const cancelLoadingStart = setTimeout((): void => {
        setLoadingBarStatus(LoadingBarStatus.Loading);
      }, 20);

      loadData(location, dispatch).then((): void => {
        if (!canceled) {
          clearTimeout(cancelLoadingStart);
          setLoadingBarStatus(LoadingBarStatus.Complete);
          setRenderedLocation(location);
        }
      });

      return (): void => {
        canceled = true;
        clearTimeout(cancelLoadingStart);
        setLoadingBarStatus(LoadingBarStatus.Canceled);
      };
    }, [location]);

    return (
      <>
        <LoadingBar status={loadingBarStatus} />
        <Route
          location={renderedLocation}
          render={(): JSX.Element => renderRoutes(routes)}
        />
      </>
    );
  }
);

export function Root({ store }: { store: Store }): JSX.Element {
  return (
    <MessagesProvider value="en">
      <HooksProvider store={store}>
        <div className="container">
          <Nav />
          <LoadingSwitch />
        </div>
      </HooksProvider>
    </MessagesProvider>
  );
}
