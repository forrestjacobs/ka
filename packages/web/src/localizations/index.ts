import { FluentBundle } from "fluent";
import enUS from "./en-US.ftl";

export function* getBundles(): IterableIterator<FluentBundle> {
  const bundle = new FluentBundle("en-US");
  bundle.addMessages(enUS);
  yield bundle;
}
