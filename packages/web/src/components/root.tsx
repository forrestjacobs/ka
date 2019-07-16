import { HooksProvider, useDispatch } from "@epeli/redux-hooks";
import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps, Route } from "react-router";
import { Store } from "redux";
import { MessagesProvider } from "../messages";
import { routes, loadData } from "./routes";
import { LoadingBar } from "./loading/bar";
import { Nav } from "./nav/component";
import { renderRoutes } from "react-router-config";

const LoadingSwitch = withRouter(
  ({ location }: RouteComponentProps): JSX.Element => {
    const [loadingStart, setLoadingStart] = useState<number | undefined>();
    const [renderedLocation, setRenderedLocation] = useState(location);
    const dispatch = useDispatch();

    useEffect((): (() => void) => {
      let canceled = false;

      setLoadingStart(Date.now());
      loadData(location, dispatch).then(
        (): void => {
          if (!canceled) {
            setLoadingStart(undefined);
            setRenderedLocation(location);
          }
        }
      );

      return (): void => {
        canceled = true;
      };
    }, [location]);

    return (
      <>
        <LoadingBar start={loadingStart} />
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
