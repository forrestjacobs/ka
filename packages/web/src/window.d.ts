import { NormalizedCacheObject } from "apollo-boost";

declare global {
  interface Window {
    __PRELOADED_STATE__: NormalizedCacheObject | undefined;
  }
}
