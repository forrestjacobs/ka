import React from "react";
import { useMessages } from "../../messages";
import { Page } from "../page";
import { NotFound } from "./component";

export function NotFoundPage(): JSX.Element {
  const messages = useMessages();
  return (
    <Page status={404} title={messages.notFound.title()}>
      <NotFound />
    </Page>
  );
}
