import React from "react";
import { useMessages } from "../../messages";

export function ErrorComponent(): JSX.Element {
  const messages = useMessages();
  return <>{messages.error.message()}</>;
}
