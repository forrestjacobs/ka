import React from "react";
import { useMessages } from "../../messages";

export function Loading(): JSX.Element {
  const messages = useMessages();
  return (
    <div className="loading-component">
      <span className="sr-only">{messages.loading.message()}</span>
    </div>
  );
}
