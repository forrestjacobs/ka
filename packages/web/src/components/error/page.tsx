import React from "react";
import { useMessages } from "../../messages";
import { Page } from "../page";
import { ErrorComponent } from "./component";

export function ErrorPage(): JSX.Element {
  const messages = useMessages();
  return (
    <Page status={500} title={messages.error.title()}>
      <ErrorComponent />
    </Page>
  );
}
