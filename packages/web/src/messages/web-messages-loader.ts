import enMessages from "../../messages/en.messages.yaml";
import { Messages } from "./messages";

export const data: { [locale: string]: Messages } = {
  en: enMessages as Messages
};
