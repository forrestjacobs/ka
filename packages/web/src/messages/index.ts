import { createContext, useContext } from "react";
import { Messages } from "./messages";
import { data } from "./messages-loader";

const MessagesContext = createContext("en");

export const MessagesProvider = MessagesContext.Provider;

export function useMessages(): Messages {
  const locale = useContext(MessagesContext);
  return data[locale];
}
