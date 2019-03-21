import { Api } from "./api";
import { restApi } from "./rest";

export { Api, ApiErrorType, HasErrorType } from "./api";

export function getApi(): Api {
  if (process.env.TARGET === "web") {
    return restApi;
  }

  throw new Error("No API available for the target");
}
