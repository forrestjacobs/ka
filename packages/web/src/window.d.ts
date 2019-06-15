import { compose } from "redux";
import { RootState } from "./state";

declare global {
  interface Window {
    // eslint-disable-next-line no-undef
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    __PRELOADED_STATE__: RootState | undefined;
  }
}
