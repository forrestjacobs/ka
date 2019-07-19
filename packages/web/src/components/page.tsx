import React, { ReactNode } from "react";
import { Route, RouteComponentProps, StaticContext } from "react-router";
import { useMessages } from "../messages";

export function Page(props: {
  title?: string;
  status?: number;
  children?: ReactNode;
}): JSX.Element {
  const messages = useMessages();
  const defaultTitle = messages.title();
  const title =
    props.title === undefined
      ? defaultTitle
      : `${props.title} - ${defaultTitle}`;
  function render({
    staticContext
  }: RouteComponentProps<
    {},
    {
      title?: string;
    } & StaticContext
  >): ReactNode {
    if (staticContext) {
      staticContext.title = title;
      staticContext.statusCode = props.status;
    }
    return <>{props.children}</>;
  }
  if (process.env.TARGET === "web") {
    if (document.title !== title) {
      document.title = title;
    }
    return <>{props.children}</>;
  } else {
    return <Route {...{ render }} />;
  }
}
