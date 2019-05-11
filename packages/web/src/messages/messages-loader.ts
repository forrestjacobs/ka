import { readFileSync } from "fs";
import MessageFormat from "messageformat";
import { join } from "path";
import { parse } from "yaml";
import { Messages } from "./messages";

const mf = new MessageFormat();

function loadMessages(path: string, locale: string): Messages {
  const json = parse(readFileSync(join(__dirname, path), "utf8"));
  return (mf.compile(json, locale) as unknown) as Messages;
}

export const data: { [locale: string]: Messages } = {
  en: loadMessages("en.messages.yaml", "en")
};
