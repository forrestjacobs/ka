import { readFileSync } from "fs";
import MessageFormat from "messageformat";
import { parse } from "yaml";
import { Messages } from "./messages";

const enMf = new MessageFormat();

function loadMessages(path: string, locale: string): Messages {
  const json = parse(readFileSync("./en.messages.yaml", "utf8"));
  return enMf.compile(json, "en") as any as Messages;
}

export const data: {[locale: string]: Messages} = {
  en: loadMessages("./en.messages.yaml", "en"),
};
