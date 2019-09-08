import React, { ReactNode } from "react";
import { useLoadingRoute } from "react-navi";
import { MessagesProvider } from "../messages";
import { Nav } from "./nav/component";
import { LoadingBar, LoadingBarStatus } from "./loading/bar";

export function Root({ children }: { children: ReactNode }): JSX.Element {
  const isLoading = useLoadingRoute() !== undefined;

  return (
    <MessagesProvider value="en">
      <div className="container">
        <LoadingBar
          status={
            isLoading ? LoadingBarStatus.Loading : LoadingBarStatus.Complete
          }
        />
        <Nav />
        {children}
      </div>
    </MessagesProvider>
  );
}
