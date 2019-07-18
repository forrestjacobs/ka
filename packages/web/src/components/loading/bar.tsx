import React from "react";

export enum LoadingBarStatus {
  Loading = "loading",
  Canceled = "canceled",
  Complete = "complete"
}

export function LoadingBar({
  status
}: {
  status: LoadingBarStatus;
}): JSX.Element {
  return (
    <div className="loading-bar">
      <div className={`track -${status}`} />
    </div>
  );
}
