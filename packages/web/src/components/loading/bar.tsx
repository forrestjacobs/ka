import React, { useEffect, useState } from "react";

export function LoadingBar({
  start
}: {
  start: number | undefined;
}): JSX.Element {
  const [modifier, setModifier] = useState("complete");
  useEffect((): void => {
    setModifier(
      (m): string =>
        start === undefined
          ? "complete"
          : m === "loadinga"
          ? "loadingb"
          : "loadinga"
    );
  }, [start]);

  return (
    <div className="loading-bar">
      <div className={`track -${modifier}`} />
    </div>
  );
}
