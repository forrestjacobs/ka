import React from "react";
import { useMessages } from "../../messages";

export function LoadingPage(): JSX.Element {
  const messages = useMessages();
  return (
    <div className="text-center">
      <div className="spinner-border text-secondary" role="status">
        <span className="sr-only">{messages.loading.message()}</span>
      </div>
    </div>
  );
}
