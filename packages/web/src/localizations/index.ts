import { createContext, useContext } from "react";
import enMessages from "./en.messages.yaml";

interface HasMessage {
  message(): string;
}

interface HasTitle {
  title(): string;
}

type Messages = HasTitle & {
  loading: HasMessage;
  error: HasMessage & HasTitle;
  notFound: HasMessage & HasTitle;

  search: {
    field(): string;
    button(): string;
    results(args: {results: number, terms: string}): string;
  };

  character: {
    on(): string;
    kun(): string;
  };
};

const messageData: {[locale: string]: Messages} = {
  en: enMessages,
};

const IntlContext = createContext("en");

export const IntlProvider = IntlContext.Provider;

export function useIntl(): Messages {
  const locale = useContext(IntlContext);
  return messageData[locale];
}
