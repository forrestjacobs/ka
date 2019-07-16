import React from "react";
import { useMessages } from "../../messages";

export function NotFound(): JSX.Element {
  const messages = useMessages();
  return <>{messages.notFound.message()}</>;
}
