import React from "react";
import { useMessages } from "../../messages";
import { Page } from "../page";

export function LoadingPage(): JSX.Element {
  const messages = useMessages();
  return (
    <Page>
      <div className="text-center">
        <div className="spinner-border text-secondary" role="status">
          <span className="sr-only">{messages.loading.message()}</span>
        </div>
      </div>
    </Page>
  );
}
